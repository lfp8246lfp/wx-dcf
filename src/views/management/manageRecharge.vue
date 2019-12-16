<!-- 充值页 -->
<template>
  <div class="recharge">
    <ul>
      <li>
        <h1>{{$t("device.username")}}</h1>
        <p>{{chargeObj.chatname}}</p>
      </li>
      <li>
        <h1>{{$t("barIndex.room")}}</h1>
        <p>{{chargeObj.metername}}</p>
      </li>
      <li>
        <h1>{{$t("barIndex.phone")}}</h1>
        <p>{{chargeObj.phone}}</p>
      </li>
      <li>
        <h1>{{$t("barIndex.surplus")}}</h1>
        <p>{{balancevlaue}} kWh</p>
      </li>
      <li>
        <h1>{{$t("recharge.theprice")}}</h1>
        <p>{{(chargeObj.pricevalue)}} 元/kWh</p>
      </li>
      <li>
        <h1>{{$t("recharge.rechargeamount")}}</h1>
        <input
          v-on:input="tt($event)"
          autocomplete="off"
          type="text"
          v-model="pricenum"
          class="price"
          :max="5"
          :placeholder="$t('recharge.enteramount')"
        >
      </li>
      <li>
        <h1>{{$t("recharge.equivalent")}}</h1>
        <p>{{quantity()}} kWh</p>
      </li>
    </ul>
    <group :title="$t('recharge.rechargetype')" class="charge">
      <radio :options="options" @on-change="change" v-model="radio"></radio>
    </group>
    <x-button @click.native="recharge" class="recharge-btn">{{$t("personal.button")}}</x-button>
    <p class="msg">{{$t("recharge.cont")}}</p>
    <div v-transfer-dom>
      <confirm v-model="show" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("recharge.derecharge")}}</p>
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
          <span class="vux-close" v-if="showcancle">{{$t('device.cancel')}}</span>
        </div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <confirm v-model="show3" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')">
        <p class="text-center">{{$t("put.onenum")}}</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import api from "../../api/Piles.js";
import {
  Radio,
  Group,
  XButton,
  XInput,
  TransferDom,
  XDialog,
  XProgress,
  Cell,
  Box,
  Confirm
} from "vux";
import { getErrorMsg } from "@/tools/commonJs/common";
var userItem = JSON.parse(localStorage.getItem("userItem"));
var a = "";
export default {
  data() {
    return {
      balancevlaue: "", //剩余电量
      show3: false, //整数小数提醒
      radio: 2, //充值类型
      options: [ //选择的类型
        {
          icon: "http://www.img.statesky.cn/image/wifi/pay3.png",
          key: 2,
          value: this.$t("recharge.cashpay")
        },
        {
          icon: "http://www.img.statesky.cn/image/wifi/pay2.png",
          key: 3,
          value: this.$t("recharge.wechatpay")
        },
        {
          icon: "http://www.img.statesky.cn/image/wifi/pay1.png",
          key: 4,
          value: this.$t("recharge.zhifubao")
        }
      ],
      pricenum: "", //充值金额
      singer: "", //该表电价
      chargeObj: "", //传递过来的对象
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
        isclear: 0
      },
      tokenvalue: "", //获取的token值
      commad: "",
      paytype: 2, //转账类型
      objid: "",
      sendcharing:{}
    };
  },
  directives: {
    TransferDom
  },
  components: {
    Radio,
    Group,
    XButton,
    XInput,
    XDialog,
    XProgress,
    Cell,
    Box,
    Confirm,
    TransferDom
  },

  computed: {},

  mounted() {
    this.chargeObj = JSON.parse(this.$route.query.chargeitem);
    this.objid = this.chargeObj.rtuid;
    this.singer = this.chargeObj.pricevalue;
    this.balancevlaue = this.chargeObj.balancevlaue.toFixed(1);
  },

  methods: {
    //   输入充值的金额
    tt: function(e) {
      a = e.target.value;
      var re1 = /^\d+(\.\d{0,1})?$|^\.\d{1,2}$/;
      if (a !== "") {
        if (!re1.test(a)) {
          this.show3 = true;
          this.pricenum = a.match(/^\d*(\.?\d{0,1})/g)[0];
        } else {
          this.pricenum = a;
        }
      }
    },
    //计算价格
    quantity() {
      return (this.pricenum / this.singer).toFixed(1);
    },
    // 改变充值方式
    change(value, label) {
      // console.log(value, label);
      this.paytype = value;
    },
    // 充值
    recharge() {
      this.show = true;
    },
    // 确定充值事件
    onConfirm() {
      this.sendcharing.commaddress=this.chargeObj.commaddress;
      this.sendcharing.total=this.quantity();
      this.sendcharing.nowMoney=this.pricenum;
      this.sendcharing.balancevlaue=(Number(this.balancevlaue)+Number(this.pricenum)).toFixed(1)
      var re1 = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,1})))$/;
      if (!re1.test(this.pricenum)) {
        this.show3 = true;
      } else {
        if (this.chargeObj.commaddress.length > 11) {
          this.commad = this.chargeObj.commaddress.slice(-11);
        } else if (this.chargeObj.commaddress.length < 11) {
          this.commad = this.chargeObj.commaddress;
          for (let i = this.chargeObj.commaddress.length; i < 11; i++) {
            this.commad = "0" + this.commad;
          }
        }
        this.tokenreq.meterno = this.commad;
        this.tokenreq.chargevalue = this.quantity();
        // 获取token
        api.GetToken(this.tokenreq).then(res => {
          this.tokenvalue = res.data.tokenvalue.replace(/-/g, "");
          this.sendData(this.chargeObj);
        });
      }
    },

    sendData(item) {
      // console.log(this.tokenvalue);
      this.switchList.objectid = item.rtuid;
      this.switchList.content.data = this.tokenvalue;
      this.genTaskid();
      this.genRequestid();
      this.$store.dispatch("AC_SendCharing", this.switchList).then(res => {
        console.log(res.data);
        if (res.data.success == 1) {
          this.receiveData();
          this.saverecode(1);
        } else {
          this.$store.commit("UPDATE_TOAST", this.$t("record.failcharge"));
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
          //   this.addVendRecord();
          let r1$ = new Promise((resolve, reject) => {
            // 添加充电记录
            api
              .GetaddPryPayRecord({
                chatid: this.chargeObj.chatid,
                objectid: this.objid,
                objecttype: 1,
                paymoney: this.pricenum,
                payvalue: this.quantity(),
                tokentype: 1,
                token: this.tokenvalue,
                vendingtype: this.paytype,
                notes: "充电"
              })
              .then(res => {
                resolve(res.data.returnCode);
              });
          });
          console.log(r1$);
          if ((r1$ = !1)) {
            this.waitrecvMsg = this.$t("record.fail");
          } else {
            this.waitrecvMsg = this.$t("record.success");
            this.SendCharingMsg()
            this.saverecode(2);
            this.$router.push("/houSuccess");
          }
          // if(this.res==1){
          //   this.waitrecvMsg = "成功";
          // }else{
          //    this.waitrecvMsg = "失败";
          // }
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
          this.saverecode(3);
        } else {
          this.percent = 100;
          this.waitrecvMsg = this.$t("record.overtime");
          this.showcancle = true;
          this.saverecode(3);
        }
      });
    },
    intercept() {
      this.interrupt = true;
      this.recvTimeoutCount = -1;
      this.showDialog = false;
      this.percent = 0;
    },
    // 添加记录
    saverecode(type){
      api.insertChargeLog({
        objectid:this.switchList.objectid,
        objecttype:1,
        sendstatus:type,
        token:this.tokenvalue,
        openid:userItem.openid,
        paymoney :this.pricenum,
        payenergy :this.quantity()
      })
    },
    // 产生随机数
    genTaskid() {
      this.switchList.taskid = this.genRandomNum(1000, 9999);
    },
    // 产生随机数
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
    },
    async SendCharingMsg() {
      const result = await this.$store.dispatch("AC_SendWaringMsg", {
        title: "充电成功通知",
        datas:
          `您好，您已经成功充值到电表\t${
            this.sendcharing.commaddress
          }\t${
            this.sendcharing.nowMoney
          }元\t${
            this.sendcharing.total
          }kWh\t${
            this.sendcharing.balancevlaue
          }kWh\t电充蜂平台\t感谢您的使用`,
        userOpenid: this.chargeObj.chatid,
        mpAccount: this.chargeObj.appid,
        jumpUrl: `http://bee.statesky.cn/powerh5/?mpid=${this.chargeObj.appid}#/meterLow`
      });
    },
    // 添加充电记录
    // addVendRecord(){
    //   api.AddVendRecord({
    //     chatid:this.chargeObj.chatid,
    //     objectid:this.objid,
    //     objecttype:1,
    //     paymoney:this.pricenum,
    //     payvalue:this.quantity(),
    //     tokentype:4,
    //     token:this.tokenvalue,
    //     vendingtype:this.paytype,
    //     notes:"充值"
    //   }).then(res=>{
    //   })
    // }
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.recharge {
  ul {
    margin-top: 20 / @width75;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    padding-left: 38 / @width75;
    background: #fff;
    li {
      border-bottom: 1px solid #f5f5f5;
      height: 88 / @width75;
      line-height: 88 / @width75;
      display: flex;
      font-size: 32 / @width75;
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
  .recharge-btn {
    width: 674 / @width75;
    height: 88 / @width75;
    line-height: 88 / @width75;
    background: #35bab7;
    color: #fff;
    text-align: center;
    margin: 60 / @width75 auto 20/@width75;
    border-radius: 44 / @width75;
    font-size: 36 / @width75 !important;
  }
  .msg{
    text-align: center;
  }
}
</style>
<style lang="less" >
@width75: 75rem;
.charge {
  .weui-cells__title {
    height: 68 / @width75;
    line-height: 68 / @width75;
    padding: 7 / @width75 0 6 / @width75;
    padding-left: 38 / @width75;
    margin: 0;
    font-size: 28 / @width75;
  }
  .weui-cell {
    padding: 24 / @width75 38 / @width75;
    font-size: 28 / @width75;
  }
  // .weui-cells_radio .weui-cell__bd .vux-radio-icon {
  //   display: inline-block !important;
  //   width: 36 / @width75;
  //   height: 36 / @width75;
  //   border: none;
  // }

  // .weui-cells_radio .weui-cell:nth-child(1) .weui-cell__bd .vux-radio-icon {
  //   background: url("../../assets/icon/Section/sum.png") center;
  // }
  // .weui-cells_radio .weui-cell:nth-child(2) .weui-cell__bd .vux-radio-icon {
  //   background: url("../../assets/icon/Section/weixin.png") center;
  // }
  // .weui-cells_radio .weui-cell:nth-child(3) .weui-cell__bd .vux-radio-icon {
  //   background: url("../../assets/icon/Section/zfb.png") center;
  // }
}
.recharge {
  .price {
    width:520/@width75;
    padding: 0;
    color: #000;
    .weui-input {
      padding-left: 0;
      margin-top: -6px;
    }
  }
  .price:before {
    display: none;
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

.weui-toast {
  width: 540 / @width75!important;
  height: 180 / @width75!important;
  border-radius: 20 / @width75!important;
  top: 50% !important;
  margin-top: -90 / @width75!important;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3) !important;

  .weui-toast__content {
    line-height: 160 / @width75!important;
    font-size: 36 / @width75!important;
  }
}
</style>
