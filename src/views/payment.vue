<template>
  <div>
    <div class="top-title">
      <p>设备编号: {{selectScoket.version}}</p>
      <div v-if="selectScoket.curstatus==0">
        <img src="../assets/icon/Section/Group4@2x.png">
        <span class="icon">设备{{selectScoket.curstatus|curstatus}}</span>
      </div>
      <div v-if="selectScoket.curstatus==1">
        <img src="../assets/icon/Section/equipment @2x.png">
        <span class="icon icon2">设备{{selectScoket.curstatus|curstatus}}</span>
      </div>
    </div>
    <div class="information">
      <flexbox>
        <flexbox-item :span="1/4">
          <div class="left">
            <div>
              <div>
                <badge :text="selectScoket.tagno" class="badge"></badge>
              </div>
              <p>插座号</p>
            </div>
          </div>
        </flexbox-item>
        <flexbox-item :span="3/4">
          <div class="center">
            <h3>{{selectScoket.rtuname}}</h3>
            <p>{{selectScoket.installer}}</p>
            <p>插座编号：{{selectScoket.meterno}}</p>
          </div>
        </flexbox-item>
      </flexbox>
    </div>
    <div class="selectTime">
      <div class="selectTime-header">选择充电时间</div>
      <div class="btn-group">
        <flexbox :gutter="0" wrap="wrap">
          <flexbox-item
            v-for="(item,index) of priceList"
            :key="item.priceid"
            :span="4"
            style="margin-bottom:10px"
          >
            <div>
              <x-button
                type="primary"
                @click.native="selectPrice(index,item)"
                :plain="btnList[index]"
              >
                <span>{{item.price}}元/{{item.hour}}小时</span>
              </x-button>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <div class="pay-area">
      <div class="pay-area-header">选择支付方式</div>
      <div class="check-item">
        <checklist
          :options="commonList"
          v-model="radioValue"
          :max="1"
          @on-change="seletPay"
          disabled
        ></checklist>
      </div>
    </div>
    <div class="btn-box">
      <x-button class="btn" @click.native="beginCharging">
        <span>开始充电</span>
      </x-button>
    </div>
    <div class="warn-area">
      <div class="warn-area-header">站点备注</div>
      <h4>
        <span>可用功率：</span>
        {{this.showData.showvalue2}}
      </h4>
      <p class="warn-info">
        <span>注意：</span>
        {{this.showData.showvalue3}}
      </p>
      <p class="tips">
        <span>提示：</span>
        {{this.showData.showvalue4}}
      </p>
    </div>

    <!--<div class="pay">
      <div class="line pay-title">
        <div class="left">
          <h3>选择支付方式</h3>
        </div>
        <div class="right">
          充值

        </div>

      </div>
      <div class="check-item">
        <checklist :options="commonList" v-model="radioValue" :max="1" @on-change="seletPay" disabled></checklist>
      </div>

    </div>-->
    <div v-transfer-dom>
      <confirm v-model="show" title="提示" @on-confirm="onConfirm">
        <p class="text-center">本次充电付款{{this.payInfo.price}}元</p>
        <p class="text-center">确认充电？</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showDialog" class="dialog-demo" @on-hide="intercept">
        <cell title="等待数据处理中..."></cell>
        <div>
          <box gap="10px">
            <x-progress :percent="percent" :show-cancel="false"></x-progress>
            <cell :title="waitrecvMsg"></cell>
          </box>
        </div>
        <div @click="showDialog=false">
          <span class="vux-close" v-if="showcancle">取消</span>
        </div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <confirm v-model="toCharge" title="余额不足" @on-confirm="onConfirm2">
        <p style="text-align:center;">是否去充值？</p>
      </confirm>
    </div>

    <div v-transfer-dom>
      <confirm v-model="toCharges" title="余额不足" >
        <p style="text-align:center;">{{us}}</p>
      </confirm>
    </div>
  </div>
</template>
<script>
import {
  XButton,
  Flexbox,
  FlexboxItem,
  Badge,
  CheckIcon,
  Checklist,
  TransferDom,
  Popup,
  Group,
  Cell,
  Confirm,
  XDialog,
  XProgress,
  Box
} from "vux";

import { mapState, mapGetters, mapMutations } from "vuex";
import { timeDif, formatDate, getErrorMsg } from "@/tools/commonJs/common";
import "@/tools/filter/filter.js";
import wechat from "../tools/wechat";
import { format } from "date-fns";
import api from "../api/Piles.js";
import { constants } from "fs";
var userItem = JSON.parse(localStorage.getItem("userItem"));
export default {
  directives: {
    TransferDom
  },
  components: {
    XButton,
    Flexbox,
    FlexboxItem,
    Badge,
    Checklist,
    CheckIcon,
    TransferDom,
    Popup,
    Group,
    Cell,
    History,
    Confirm,
    XDialog,
    XProgress,
    Box
  },
  computed: {
    ...mapState({
      token: state => state.token
    }),
    ...mapGetters(["priceList", "userInfos"])
  },
  beforeCreate() {
    if (userItem != null) {
      var user = wechat.getSubscribe(userItem.appid, userItem.openid); //获取返回值
      //promsie里压根就读不到this，也就是说取不到全局变量，这就是作用域问题了
      //我们在promise外面定义let _this =this ，然后在promise里使用_this就好了
      let _this = this; //
      user.then(function(userInfo) {
        if (userInfo.subscribe == 0) {
          _this.$router.push("/aboutpublic");
        }
      });
    } else {
      this.$router.push("/login");
    }
  },
  // created() {
  //   if (this.userInfos.balancevlaue != undefined) {
  //     this.commonList.splice(0, 1, {
  //       key  : "1",
  //       value: `我的余额：${this.userInfos.balancevlaue}元`
  //     });
  //   } else {
  //     this.commonList.splice(0, 1, {
  //       key  : "1",
  //       value: `我的余额：0元`
  //     });
  //   }
  // },
  mounted() {
    var type = this.$route.params.type;
    if(type == 0){
          this.$store
          .dispatch("AC_GetShowInfo", {
            objectid: 1
          })
          .then(res => {
            const data = res.data.item;
            if (data) {
              this.showData = data;
            }
          });
        this.$store
          .dispatch("AC_SinglePluginfo", {
            objectid: this.$route.params.id
          })
          .then(res => {
            this.selectScoket = res.data.item;
            this.$store.dispatch("AC_GetPriceList", {
              objectid: res.data.item.ownerid
              //objectid: 34
            });
          });
        for (let i = 0; i < this.priceList.length; i++) {
          this.btnList.push(true);
        }
        this.btnList.splice(0, 1, false);
        let price = this.priceList[0];
        this.payInfo = {
          price: price.price,
          hour: price.hour
        };
        console.log(userItem.openid);
        this.$store
          .dispatch("AC_GetInfo", {
            chatid: userItem.openid
          })
          .then(res => {
              console.log(res);
              
              if (res.data.hasOwnProperty("balancevalue")) {
                this.commonList.splice(0, 1, {
                  key: "1",
                  value: `我的余额：${res.data.balancevalue}元`
                });
                this.balancevalue = res.data.balancevalue;
              } else {
                this.commonList.splice(0, 1, {
                  key: "1",
                  value: `我的余额：0元`
                });
                this.balancevalue = 0;
              }
        });
    }else{
       var dcuaddress = this.$route.params.dcuaddress;
       var meteraddress = this.$route.params.id;
       var pmeterid ;
        api.GetPointWebChatInfo({
          dcuaddress: dcuaddress,
          meteraddress:meteraddress,
        }).then(res =>{
              console.log(res);
              pmeterid = res.data.item.pmeterid;
            
              this.$store
              .dispatch("AC_GetShowInfo", {
                objectid: 1
              })
              .then(res => {
                const data = res.data.item;
                if (data) {
                  this.showData = data;
                }
              });
            this.$store
              .dispatch("AC_SinglePluginfo", {
                objectid: pmeterid
              })
              .then(res => {
                this.selectScoket = res.data.item;
                this.$store.dispatch("AC_GetPriceList", {
                  objectid: res.data.item.ownerid
                  //objectid: 34
                });
              });
            for (let i = 0; i < this.priceList.length; i++) {
              this.btnList.push(true);
            }
            this.btnList.splice(0, 1, false);
            let price = this.priceList[0];
            this.payInfo = {
              price: price.price,
              hour: price.hour
            };
            console.log(userItem.openid);
            this.$store
              .dispatch("AC_GetInfo", {
                chatid: userItem.openid
              })
              .then(res => {
                  console.log(res);
                  
                  if (res.data.hasOwnProperty("balancevalue")) {
                    this.commonList.splice(0, 1, {
                      key: "1",
                      value: `我的余额：${res.data.balancevalue}元`
                    });
                    this.balancevalue = res.data.balancevalue;
                  } else {
                    this.commonList.splice(0, 1, {
                      key: "1",
                      value: `我的余额：0元`
                    });
                    this.balancevalue = 0;
                  }
            });   
        });
    }
  },
  data: function() {
    return {
      t1: "",
      t2: "",
      showcancle: false,
      showData: {},
      toCharge: false,
      selectScoket: {},
      percent: 0,
      waitrecvMsg: "",
      recvTimeoutCount: 10,
      interrupt: false,
      showDialog: false,
      btnList: [],
      pay1: true,
      pay2: false,
      showPopup: false,
      commonList: [{ key: "1", value: "我的余额：0元" }],
      radioValue: ["1"],
      PayType: 1,
      show: false,
      toCharges:false,
      us:{},
      payInfo: {
        price: null,
        hour: null
      },
      switchList: {
        objectid: 17122,
        objecttype: 1,
        requestid: "requestid",
        taskid: 5579,
        isresive: 0,
        fin: "1",
        fir: "1",
        afn: "1",
        content: {
          name: "H335",
          data: {
            bright: "99",
            commaddress: "commaddress",
            control: "1",
            groupindex: "1",
            numberid: 100,
            time: "300"
          }
        }
      },
      balancevalue: 0
    };
  },
  methods: {
    // getInfo() {
    //   api
    //     .GetChatBandInfo({
    //       chatid: userItem.openid
    //     })
    //     .then(res => {
    //       if (res.data.hasOwnProperty("balancevalue")) {
    //         this.commonList.splice(0, 1, {
    //           key: "1",
    //           value: `我的余额：${res.data.balancevalue.toFixed(1)}元`
    //         });
    //         this.balancevalue = res.data.balancevalue;
    //       } else {
    //         this.commonList.splice(0, 1, {
    //           key: "1",
    //           value: `我的余额：0元`
    //         });
    //         this.balancevalue = 0;
    //       }
    //     });
    // },
    selectPrice(ind, item) {
      for (let i = 0; i < this.btnList.length; i++) {
        this.$set(this.btnList, i, true);
      }
      this.btnList.splice(ind, 1, false);
      this.payInfo = {
        price: item.price,
        hour: item.hour
      };
      console.log(this.payInfo);
    },
    beginCharging() {
      console.log(this.balancevalue, this.payInfo.price);
      if (this.selectScoket.curstatus == 1) {
        if (this.selectScoket.usestatus == 1) {
          if (this.balancevalue < this.payInfo.price) {
            this.toCharge = true;
          } else {
            this.show = true;
            this.showcancle = true;
          }
        } else {
          this.$store.commit("UPDATE_TOAST", "设备正在使用");
        }
      } else {
        this.$store.commit("UPDATE_TOAST", "设备已离线");
      }
    },
    sendData() {
      this.switchList.objectid = this.selectScoket.rtuid;
      this.switchList.content.data.commaddress = this.selectScoket.commaddress;
      this.switchList.content.data.numberid = this.selectScoket.numberid;
      this.switchList.content.data.time = (this.payInfo.hour * 60).toString();
      this.genTaskid();
      this.genRequestid();
      this.$store.dispatch("AC_SendCharing", this.switchList).then(res => {
        if (res.data.success == 1) {
          this.receiveData();
        } else {
          this.$store.commit("UPDATE_TOAST", "充电失败");
        }
      });
    },
    receiveData() {
      this.waitrecvMsg = "";
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
          this.showcancle = false;
          this.percent = 100;
          this.waitrecvMsg = "成功";
          this.addCharging();
        } else if (
          res.data.isresive == 1 &&
          res.data.content.data[0].result == 1
        ) {
          this.percent = 100;
          this.waitrecvMsg = getErrorMsg(
            res.data.content.data[0].errortype,
            res.data.content.data[0].errorcode
          );
        } else {
          this.percent = 100;
          this.waitrecvMsg = "超时";
        }
      });
    },
    intercept() {
      this.interrupt = true;
      this.recvTimeoutCount = -1;
      this.showDialog = false;
      this.percent = 0;
    },
    formatTime(val) {
      return format(val, "YYYY-MM-DD ");
    },

    async addCharging() {
      const result = await this.$store
        .dispatch("AC_AddBatteryCharging", {
          chatid: userItem.openid,
          currentpower: 0,
          chargingduration: this.payInfo.hour,
          chargingmoney: this.payInfo.price,
          rtuid: this.selectScoket.rtuid,
          pmeterid: this.selectScoket.pmeterid,
          paytype: 1
        })
        .then(res => {
          if (res.data.returncode == 1) {
            this.$router.push({ path: `/tab2/${this.selectScoket.pmeterid}` });
            this.t1 = res.data.chargingid;
            this.t2 = this.formatTime(res.data.chargingdate);
          }
          this.SendWaringMsg();
        });
    },
    async SendWaringMsg() {
      const result = await this.$store.dispatch("AC_SendWaringMsg", {
        title: "服务状态提醒",
        datas: `开始充电,本次充电金额:${this.payInfo.price}元,充电时长:${
          this.payInfo.hour
        }小时\t${this.selectScoket.tagno}号插座开始充电\t正在充电,充电时长${
          this.payInfo.hour
        }小时\t充电过程中，如果出现电充满、充电插头故障、功率过高、电流过大、插头拔出、手动停止等情况会停止充电`,
        userOpenid: userItem.openid,
        mpAccount: userItem.appid,
        jumpUrl: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
          userItem.appid
        }&redirect_uri=http%3a%2f%2fbee.statesky.cn%2fpowerh5%2f%23%2fnewbatteryRecord%2f${
          this.t1
        }/${this.t2}&response_type=code&scope=snsapi_base&state=1&conn`
      });
    },
    seletPay(value) {
      this.PayType = value[0];
      console.log(this.PayType);
    },
    onConfirm() {
      this.showDialog = true;
      this.interrupt = false;
      this.percent = 0;
      this.recvTimeoutCount = 10;
      this.sendData();
    },
    onConfirm2() {
      this.$router.push("/balanceRecharge");
    },

    // addChargingRecord() {
    //   this.$store
    //     .dispatch("AC_UpdateUserInfo", {
    //       chatid      : userItem.openid,
    //       balancevlaue: this.userInfos.balancevlaue - this.payInfo.price,
    //       chatname    : "",
    //       phone       : "",
    //       status      : 1
    //     })
    //     .then(res => {
    //       this.$store
    //         .dispatch("AC_GetUserInfomation", {
    //           chatid: userItem.openid
    //         })
    //         .then(() => {
    //           this.commonList.splice(0, 1, {
    //             key: "1",
    //             // value: `我的余额：${this.userInfos.balancevlaue !=undefined ? 0 :this.userInfos.balancevlaue}元`
    //             value: `我的余额：${this.userInfos.balancevlaue}元`
    //           });
    //         });
    //       this.$store.dispatch("AC_AddRecharge", {
    //         chatid       : userItem.openid,
    //         rechargevalue: -this.payInfo.price,
    //         rechargetype : 2
    //       });
    //       this.addCharging();
    //       this.SendWaringMsg();
    //     });
    // },
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
  }
};
</script>

<style lang="less" scoped>
@width75: 75rem;

.top-title {
  padding-left: 38 / @width75;
  padding-right: 28 / @width75;
  height: 80 / @width75;
  line-height: 80 / @width75;
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  p {
    color: #666666;
    font-size: 28 / @width75;
  }
  span {
    font-size: 20 / @width75;
    color: #999999;
  }
  img {
    display: inline-block;
    width: 28 / @width75;
    height: 28 / @width75;
    position: relative;
    top: -2 / @width75;
  }
}

.information {
  background: white;
  .left {
    text-align: center;
    .vux-badge {
      padding: 0;
    }
    .badge {
      width: 80 / @width75;
      height: 80 / @width75;
      line-height: 80 / @width75;
      border-radius: 50%;
      background: #35bab6;
      overflow: hidden;
      font-size: 28 / @width75;
      margin-bottom: 6 / @width75;
    }
    p {
      font-weight: bold;
      font-size: 28 / @width75;
      line-height: 40 / @width75;
      height: 40 / @width75;
    }
  }
  .center {
    h3 {
      line-height: 44 / @width75;
      font-size: 32 / @width75;
      height: 44 / @width75;
      font-weight: bolder;
      margin-top: 26 / @width75;
    }
    p {
      line-height: 36px;
      font-size: 26 / @width75;
      margin-top: 18 / @width75;
      color: #666666;
    }
    p:last-of-type {
      padding-bottom: 30 / @width75;
    }
  }
}
.selectTime {
  margin-top: 20 / @width75;
  background: #ffffff;
  .selectTime-header {
    line-height: 104 / @width75;
    height: 104 / @width75;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    font-size: 28 / @width75;
    color: #666666;
    padding-left: 38 / @width75;
  }
  .btn-group {
    background: #ffffff;
    padding: 40 / @width75;
    margin-bottom: 20 / @width75;
    .weui-btn {
      width: 210 / @width75;
      height: 110 / @width75;
      text-align: center;
      line-height: 110 / @width75;
      border: none;
      font-size: 32 / @width75;
      color: #000000;
      background: #f6f6f6;
    }
    .weui-btn_primary {
      background: #35bab6;
      color: #ffffff;
    }
  }
}

.pay-area {
  background: #ffffff;
  margin-bottom: 20 / @width75;
  .pay-area-header {
    line-height: 104 / @width75;
    height: 104 / @width75;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    font-size: 28 / @width75;
    color: #666666;
    padding-left: 38 / @width75;
  }
}

.warn-area {
  background: #ffffff;
  padding-bottom: 32 / @width75;
  .warn-area-header {
    line-height: 104 / @width75;
    height: 104 / @width75;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    font-size: 28 / @width75;
    color: #666666;
    padding-left: 38 / @width75;
  }
  h4 {
    padding-left: 40 / @width75;
    line-height: 44 / @width75;
    height: 44 / @width75;
    margin-top: 26 / @width75;
    margin-bottom: 20 / @width75;
    font-weight: normal;
    font-size: 28 / @width75;
    color: #666666;
    span {
      color: #000000;
      margin-right: 4 / @width75;
      font-weight: bolder;
    }
  }
  .warn-info,
  .tips {
    padding-left: 38 / @width75;
    padding-right: 38 / @width75;
    line-height: 44 / @width75;
    font-size: 28 / @width75;
    margin-bottom: 22 / @width75;
    color: #666666;
    span {
      color: #000000;
      margin-right: 4 / @width75;
      font-weight: bolder;
    }
  }
}

.btn-box {
  width: 672 / @width75;
  height: 88 / @width75;
  margin: 40 / @width75 auto;
  border: none;
  border-radius: 44 / @width75;
  overflow: hidden;
  //   .weui-btn    : after {
  //     display: none;
  //   }
  .btn {
    height: 88 / @width75;
    line-height: 88 / @width75;
    font-size: 40px;
    background: #35bab6;
    color: #ffffff;
    font-size: 34 / @width75;
  }
}

.weui-dialog {
  background: red !important;
}
</style>
 <style lang="less">
@width75: 75rem;
/*.pay .weui-cell {
  height   : 48px;
  font-size: 32px;
  .weui-cells_checkbox,
  .weui-icon-checked:before {
    font-size: 32px;
  }
}*/
.check-item {
  .weui-cell {
    padding: 0 0 0 38 / @width75;
  }
  .weui-cells {
    line-height: 128 / @width75;
    height: 128 / @width75;
  }
  .weui-cells:before {
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

// .weui-dialog .vux-close: before,
// .weui-dialog .vux-close: after {
//   display: none !important;
// }

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



