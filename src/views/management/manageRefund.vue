<!--退费详情  -->
<template>
  <div class="refund">
    <ul>
      <li>
        <h1>{{$t("barIndex.room")}}</h1>
        <p>{{funditems.metername}}</p>
      </li>
      <li>
        <h1>{{$t("device.electricnumber")}}</h1>
        <p>{{funditems.commaddress}}</p>
      </li>
      <li>
        <h1>{{$t("device.username")}}</h1>
        <p>{{funditems.chatname}}</p>
      </li>
      <li>
        <h1>{{$t("barIndex.phone")}}</h1>
        <p>{{funditems.phone}}</p>
      </li>
      <li>
        <h1>{{$t("barIndex.surplus")}}</h1>
        <p>{{funditems.balancevlaue}} kWh</p>
      </li>
      <li>
        <h1>{{$t("recharge.theprice")}}</h1>
        <p>{{funditems.pricevalue}} {{$t("record.yuank")}}</p>
      </li>
      <li>
        <h1>{{$t("eleedit.refundamount")}}</h1>
        <p>{{(funditems.balancevlaue*funditems.pricevalue).toFixed(1)}} {{$t('record.yuan')}}</p>
      </li>
    </ul>
    <group :title="$t('eleedit.fundtype')" class="fund">
      <radio :options="fundtype" @on-change="change" v-model="radio001"></radio>
    </group>
    <x-button @click.native="refund" class="refund-btn">{{$t("eleedit.refundbtn")}}</x-button>
    <div class="msg">
      <p>{{$t("eleedit.pcont")}}</p>
      <p>{{$t("eleedit.pcontt")}}</p>
    </div>
    <div v-transfer-dom>
      <confirm v-model="show" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("eleedit.refundbtn")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showDialog" class="dialog-demo" @on-hide="intercept">
        <cell :title="$t('device.wait')"></cell>
        <div>
          <box gap="10px">
            <x-progress :percent="percent" :show-cancel="false"></x-progress>
            <cell :title="waitrecvMsg"></cell>
          </box>
        </div>
        <div @click="showDialog=false">
          <span class="vux-close" v-if="showcancle">{{$t("device.cancel")}}</span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import api from "../../api/Piles.js";
import { getErrorMsg } from "@/tools/commonJs/common";
var id = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
var userItem = JSON.parse(localStorage.getItem("userItem")); //获取微信号
import {
  Radio,
  Group,
  XButton,
  TransferDom,
  XDialog,
  XProgress,
  Cell,
  Box,
  Confirm
} from "vux";
export default {
  data() {
    return {
      radio001: 2, //退款类型默认
      fundtype: [
        //退款类型
        {
          icon: "http://www.img.statesky.cn/image/wifi/pay3.png",
          key: 2,
          value: this.$t("record.cash")
        },
        {
          icon: "http://www.img.statesky.cn/image/wifi/pay2.png",
          key: 3,
          value: this.$t("record.weChattransfer")
        },
        {
          icon: "http://www.img.statesky.cn/image/wifi/pay1.png",
          key: 4,
          value: this.$t("record.zhifubaotrans")
        }
      ],
      funditems: "", //传递过来的数据对象
      switchList: {
        objectid: 17122,
        objecttype: 1,
        requestid: "requestid",
        taskid: 5579,
        isresive: 0,
        afn: "1",
        content: {
          name: "F93",
          data: ""
        }
      },
      interrupt: false,
      percent: 0, //进度
      showDialog: false,
      waitrecvMsg: "", //提示信息
      showcancle: false, //取消
      recvTimeoutCount: 10,
      show: false, //弹框是否显示
      tokenreq: {
        //获取token的请求参数
        meterno: "",
        chargevalue: "0",
        isclear: 1
      },
      tokenvalue: "", //获取的token值
      commad: "",
      retype: 2,
      objid: ""
    };
  },
  directives: {
    TransferDom
  },
  components: {
    Radio,
    Group,
    XButton,
    XDialog,
    XProgress,
    Cell,
    Box,
    Confirm
  },

  computed: {},

  mounted() {
    this.funditems = JSON.parse(this.$route.query.funditem);
    this.objid = this.funditems.rtuid;
    console.log(this.funditems)
  },

  methods: {
    //   选择支付方式
    change(value, label) {
      this.retype = value;
      
    },
    //   退费按钮点击
    refund() {
      this.show = true;
    },
    // 确定退费清零事件
    onConfirm() {
      if (this.funditems.commaddress.length > 11) {
        this.commad = this.funditems.commaddress.slice(-11);
      } else if (this.funditems.commaddress.length < 11) {
        this.commad = this.funditems.commaddress;
        for (let i = this.funditems.commaddress.length; i < 11; i++) {
          this.commad = "0" + this.commad;
        }
      }
      this.tokenreq.meterno = this.commad;
      // 获取token
      api.GetToken(this.tokenreq).then(res => {

        this.tokenvalue = res.data.tokenvalue.replace(/-/g, "");
        this.sendData(this.funditems);
        
      });
    },

    sendData(item) {
      this.switchList.objectid = item.rtuid;
      this.switchList.content.data = this.tokenvalue;
      this.genTaskid();
      this.genRequestid();
      this.$store.dispatch("AC_SendCharing", this.switchList).then(res => {
        // console.log(res.data);
        if (res.data.success == 1) {
          this.receiveData();
        } else {
          this.$store.commit("UPDATE_TOAST", this.$t("record.failrefund"));
        }
      });
    },
    receiveData() {
      this.$store.dispatch("AC_ReceiveCharing", this.switchList).then(res => {
        if (this.interrupt) {
          this.displayTimeout = false;
          this.percent = 0;
        } else {
          if (this.recvTimeoutCount == 10) {
            this.showDialog = true;
          }
          this.percent = ((10 - this.recvTimeoutCount) / 10) * 100;
        }

        if (res.data.isresive == 0 && this.recvTimeoutCount > 0) {
          setTimeout(() => {
            this.recvTimeoutCount--;
            this.receiveData();
          }, 5000);
        } else if (
          res.data.isresive == 1 &&
          res.data.content.data[0].result == 0
        ) {
          this.showcancle = true;
          this.percent = 100;
          //    this.waitrecvMsg = "成功";
          let r2$ = new Promise((resolve, reject) => {
            // 添加充电记录
            api
              .GetaddPryPayRecord({
                chatid: this.funditems.chatid,
                objectid: this.funditems.rtuid,
                objecttype: 1,
                paymoney: 0,
                payvalue: 0,
                tokentype: 4,
                token: this.tokenvalue,
                vendingtype: this.retype,
                pricevalue: this.funditems.pricevalue,
                returnmoney:parseFloat((this.funditems.balancevlaue*this.funditems.pricevalue)).toFixed(1),
                notes: "退费"
              })
              .then(res => {
                resolve(res.data.returnCode);
              });
          });

          // let r1$ = new Promise((resolve, reject) => {
          //   // 添加退款记录
          //   api
          //     .AddReturnRecord({
          //       chatname: this.funditems.chatname,
          //       phone: this.funditems.phone,
          //       balancevlaue: this.funditems.balancevlaue,
          //       metername: this.funditems.metername,
          //       commaddress: this.funditems.commaddress,
          //       pricevalue: this.funditems.pricevalue,
          //       rtuid: this.funditems.rtuid,
          //       chatid: this.funditems.chatid,
          //       returnmoney: -parseFloat(
          //         (
          //           this.funditems.balancevlaue * this.funditems.pricevalue
          //         ).toFixed(0)
          //       ),
          //       returntype: this.retype
          //     })
          //     .then(res => {
          //       resolve(res.data.returnCode);
          //     });
          // });
          Promise.all([r2$]).then(results => {
            for (let i = 0; i < results.length; i++) {
              if ((results[i] = 1)) {
                this.waitrecvMsg = this.$t("record.success");
                this.$router.push("/resetSuccess");
              } else {
                this.waitrecvMsg = this.$t("record.fail");
              }
            }
          });
        } else if (
          res.data.isresive == 1 &&
          res.data.content.data[0].result == 1
        ) {
          this.percent = 100;
          this.showcancle = true;
          this.waitrecvMsg = getErrorMsg(
            res.data.content.data[0].errortype,
            res.data.content.data[0].errorcode
          );
        } else {
          this.percent = 100;
          this.waitrecvMsg = this.$t("record.overtime");
          this.showcancle = true;
        }
      });
    },
    intercept() {
      this.interrupt = false;
      this.recvTimeoutCount = 10;
      this.showDialog = false;
      this.percent = 0;
      this.waitrecvMsg = "";
      this.showcancle = false;
    },
    genTaskid() {
      this.switchList.taskid = this.genRandomNum(1000, 9999);
    },
    genRequestid() {
      this.switchList.requestid = this.randomWord(false, 8, 8);
    },
    genRandomNum(min, max) {
      let range = max - min;
      let rand = Math.random();
      return min + Math.round(rand * range);
    },
    randomWord(randomFlag, min, max) {
      let str = "",
        range = min,
        arr = [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j",
          "k",
          "l",
          "m",
          "n",
          "o",
          "p",
          "q",
          "r",
          "s",
          "t",
          "u",
          "v",
          "w",
          "x",
          "y",
          "z",
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z"
        ];
      let pos;
      // 随机产生
      if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
      }
      for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
      }
      return str;
    }
    // 添加充电记录
    // addVendRecord(){
    //   api.AddVendRecord({
    //     chatid:this.funditems.chatid,
    //     objectid:this.objid,
    //     objecttype:1,
    //     paymoney:0,
    //     payvalue:0,
    //     tokentype:4,
    //     token:this.tokenvalue,
    //     vendingtype:this.retype,
    //     notes:"退费"
    //   }).then(res=>{
    //     return this.res.data.returnCode
    //   })
    // },
    // 添加退款记录
    // addReturnRecord(){
    //   api.AddReturnRecord({
    //     chatname:this.funditems.chatname,
    //     phone:this.funditems.phone,
    //     balancevlaue:this.funditems.balancevlaue,
    //     metername:this.funditems.metername,
    //     commaddress:this.funditems.commaddress,
    //     pricevalue:this.funditems.pricevalue,
    //     rtuid:this.funditems.rtuid,
    //     chatid:this.funditems.chatid,
    //     returnmoney:parseFloat((this.funditems.balancevlaue*this.funditems.pricevalue).toFixed(0)),
    //     returntype:this.retype,
    //   }).then(res=>{
    //     return res.data.returnCode
    //   })
    // }
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.refund {
  ul {
    margin-top: 20 / @width75;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    padding-left: 38 / @width75;
    background: #fff;
    li {
      border-bottom: 1px solid #f5f5f5;
      height: 78 / @width75;
      line-height: 78 / @width75;
      display: flex;
      font-size: 28 / @width75;
      h1 {
        width: 176 / @width75;
        padding: 9 / @width75 8 @width75;
        color: #999999;
      }
    }
  }
  h2 {
    height: 68 / @width75;
    line-height: 68 / @width75;
    padding-left: 36 / @width75;
  }
  .refund-btn {
    width: 674 / @width75;
    height: 88 / @width75;
    line-height: 88 / @width75;
    background: #35bab7;
    color: #fff;
    text-align: center;
    margin: 41/@width75 auto 50/@width75;
    border-radius: 44 / @width75;
    font-size: 36 / @width75 !important;
  }
  .msg {
    margin-top: 54 / @width75;
    text-align: center;
    color: red;
    font-size: 24 / @width75;
    p {
      margin-bottom: 6 / @width75;
    }
  }
}
</style>
<style lang="less" >
@width75: 75rem;
.fund {
  .weui-cells__title {
    height: 70 / @width75;
    line-height: 70 / @width75;
    padding-left: 38 / @width75;
    margin: 0;
    font-size: 28 / @width75;
  }
  .weui-cell {
    padding: 24 / @width75 38 / @width75;
    font-size: 28 / @width75;
  }
  .weui-cells_radio .weui-cell__bd .vux-radio-icon {
    display: inline-block !important;
    width: 36 / @width75;
    height: 36 / @width75;
    border: none;
  }
}

.weui-dialog {
  max-width: 540 / @width75!important;
  border-radius: 20 / @width75!important;
  overflow: hidden;
}
.weui-dialog__hd .weui-dialog__title {
  font-size: 36 / @width75!important;
  letter-spacing: 4px;
  font-weight: bolder;
}

.weui-dialog__bd .text-center {
  color: #030303 !important;
  line-height: 40 / @width75;
  font-size: 30 / @width75!important;
}

.weui-dialog__ft {
  line-height: 88 / @width75!important;
  height: 88 / @width75!important;
}
.weui-dialog__ft .weui-dialog__btn {
  line-height: 88 / @width75!important;
  height: 88 / @width75!important;
  font-size: 34 / @width75!important;
  color: #007aff;
}

.weui-dialog .vux-label {
  padding-top: 36 / @width75;
  line-height: 50 / @width75;
  height: 50 / @width75;
  font-size: 36 / @width75;
}

.weui-dialog .weui-cell:before {
  display: none;
}

.weui-dialog .weui-progress__bar {
  height: 10 / @width75!important;
}

.weui-dialog .vux-close {
  width: 120 / @width75!important;
  height: 40 / @width75!important;
  display: inline-block;
  line-height: 40 / @width75!important;
  font-size: 36 / @width75!important;
  letter-spacing: 4px;
  color: #007aff;
  margin-bottom: 40 / @width75!important;
}

</style>
