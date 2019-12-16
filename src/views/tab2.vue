<template>
  <div class="car-box">
    <div class="car-box-top-area">
      <div class="top-number-wrap">
        <h2>{{CharingDetail.tagno}}</h2>
        <p>插座号</p>
      </div>
    </div>
    <div class="car-box-top-area-y"></div>
    <div class="car-box-content">
      <p class="surplus-time">剩余时间</p>
      <div class="clock">
        <img src="../assets/icon/Section/table@2x.png">
      </div>
      <div class="surplus-times">
        <clocker :time="this.leaveTime" format="%H : %M : %S"></clocker>
      </div>
      <div class="suplus-two">
        <div class="suplus-two-content">
          <img src="../assets/icon/Section/power@2x.png">
          <h3>{{CharingDetail.currentpower}}瓦</h3>
          <p>当前功率</p>
        </div>
        <div class="suplus-two-content">
          <img src="../assets/icon/Section/rate@2x.png">
          <h3>{{chargingSpeed}}%</h3>
          <p>充电进度</p>
        </div>
      </div>
      <div class="device-area">
        <p>设备编号：{{selectStation.version}}</p>
        <p>{{CharingDetail.chargingdate|date}}</p>
      </div>
      <div class="address-area">
        <div class="address-area-left">
          <h4>{{selectStation.rtuname}}</h4>
          <p>{{selectStation.installer}}</p>
        </div>
        <div class="address-area-right">
          <div v-if="selectStation.curstatus==0">
            <img src="../assets/icon/Section/Group4@2x.png">
            <span class="icon">设备{{selectStation.curstatus|curstatus}}</span>
          </div>
          <div v-if="selectStation.curstatus==1">
            <img src="../assets/icon/Section/equipment @2x.png">
            <span class="icon icon2">设备{{selectStation.curstatus|curstatus}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="close-btn" @click="close">结束充电</div>

    <!--<div @click="close" >
        <span class="iconfont close">&#xe6a1;</span>
    </div>-->
    <div v-transfer-dom>
      <x-dialog v-model="showDialog" class="dialog-demo" @on-hide="intercept">
        <cell title="等待数据回复中..."></cell>
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
      <confirm v-model="showConfirm" title="关闭提醒" @on-confirm="onConfirm">
        <p style="text-align:center;">是否停止充电？</p>
      </confirm>
    </div>
  </div>
</template>
<script>
var userItem = JSON.parse(localStorage.getItem("userItem"));
import { format } from "date-fns";
import "@/tools/filter/filter.js";
import api from "../api/Piles.js";
import { mapState, mapGetters } from "vuex";
import { timeDif, formatDate, getErrorMsg } from "@/tools/commonJs/common";
import {
  XDialog,
  XProgress,
  Box,
  Cell,
  TransferDom,
  Clocker,
  Confirm
} from "vux";

export default {
  directives: {
    TransferDom
  },
  components: {
    XDialog,
    XProgress,
    Box,
    Cell,
    TransferDom,
    Clocker,
    Confirm
  },
  created() {
    this.checkTimer = setInterval(() => {
      this.GetCharging();
    }, 120000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
    }
  },
  computed: {
    ...mapState({
      token: state => state.token
    }),

    chargingSpeed() {
      return this.leaveSpeed;
    }
  },
  data() {
    return {
      showcancle: false,
      checkTimer: null,
      showConfirm: false,
      CharingDetail: {},
      timer: null,
      leaveTime: "",  //预计结束时间
      leaveSpeed: null, //进度
      selectStation: {},
      percent: 0,
      waitrecvMsg: "",
      recvTimeoutCount: 10,
      interrupt: false,
      showDialog: false,
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
            bright: "0",
            commaddress: "02020202",
            control: "0",
            groupindex: "1",
            time: "FFFF",
            numberid: 100
          }
        }
      }
    };
  },
  mounted() {
    this.$store
      .dispatch("AC_SinglePluginfo", {
        objectid: this.$route.params.id
      })
      .then(res => {
        this.selectStation = res.data.item;
      });
    this.GetCharging();
   
   
  },
  methods: {
    GetCharging() {
      this.$store
        .dispatch("AC_GetCharging", {
          chatid: userItem.openid,
          pmeterid: this.$route.params.id
        })
        .then(res => {
          if (res.listitem) {
            this.leaveTime = this.formatTime(
              new Date(res.listitem[0].chargingdate).getTime() +
                60 * 60 * 1000 * res.listitem[0].chargingduration
            );
            this.leaveSpeed =
              100 -
              timeDif(
                new Date(),
                new Date(res.listitem[0].chargingdate),
                res.listitem[0].chargingduration
              ).speeds;
              console.log("speed:"+this.leaveSpeed);
              console.log("leaveTime:"+this.leaveTime);
            this.CharingDetail = res.listitem[0];
            this.CharingDetail.currentpower =
              1000 * this.CharingDetail.currentpower;
            if (!this.timer) {
              this.timer = setInterval(() => {
                this.leaveSpeed =
                  100 -
                  timeDif(
                    new Date(),
                    new Date(res.listitem[0].chargingdate),
                    res.listitem[0].chargingduration
                  ).speeds;
              }, 1000);
            }
          } else {
            console.log("停止了充电");
            this.$router.go(-1);
          }
        });
    },
    onConfirm() {
      this.showcancle = true;
      this.showDialog = true;
      this.interrupt = false;
      this.percent = 0;
      this.recvTimeoutCount = 10;
      this.sendData();
    },
    close() {
      this.showConfirm = true;
    },

    formatTime(val) {
      return format(val, "YYYY-MM-DD HH:mm:ss");
    },
    formatTimes(val) {
      return format(val, "YYYY-MM-DD ");
    },

    sendData() {
      this.switchList.objectid = this.CharingDetail.rtuid;
      this.switchList.content.data.commaddress = this.CharingDetail.commaddress;
      this.switchList.content.data.numberid = this.CharingDetail.numberid;
      this.genTaskid();
      this.genRequestid();
      this.$store.dispatch("AC_SendCharing", this.switchList).then(res => {
        if (res.data.success == 1) {
          this.receiveData();
        } else {
          this.$store.commit("UPDATE_TOAST", "关闭失败");
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
          this.$store
            .dispatch("AC_UpdateRecharge", {
              chargingid: this.CharingDetail.chargingid,
              chargingdate: this.formatTime(this.CharingDetail.chargingdate),
              chargingstatus: 2
            })
            .then(res => {
              if (res.data.returnCode == 1) {
                this.$store.commit("UPDATE_TOAST", "结束充电成功");
                this.SendWaringMsg();
                this.$router.go(-1);
              } else {
                this.$store.commit("UPDATE_TOAST", "结束充电失败");
              }
            });
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
    async SendWaringMsg() {
      const result = await this.$store.dispatch("AC_SendWaringMsg", {
        title: "服务状态提醒",
        datas: `充电完成通知,本次充电金额:${
          this.CharingDetail.chargingmoney
        }元\t${
          this.CharingDetail.tagno
        }号插座充电结束\t手动停止，完成充电\t充电过程中，如果出现电充满、充电插头故障、功率过高、电流过大、插头拔出、手动停止等情况会停止充电`,
        userOpenid: userItem.openid,
        mpAccount: userItem.appid,
        jumpUrl: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
          userItem.appid
        }&redirect_uri=http%3a%2f%2fbee.statesky.cn%2fpowerh5%2f%23%2fnewbatteryRecord%2f${
          this.CharingDetail.chargingid
        }/${this.formatTimes(
          this.CharingDetail.chargingdate
        )}&response_type=code&scope=snsapi_base&state=1&conn`
      });
    },
    intercept() {
      this.interrupt = true;
      this.recvTimeoutCount = -1;
      this.showDialog = false;
      this.percent = 0;
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
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.car-box {
  position: relative;
  color: white;
  .car-box-top-area {
    position: relative;
    z-index: 5;
    height: 160 / @width75;
    background: #35bab6;
    padding-top: 20 / @width75;
    .top-number-wrap {
      margin: 0 auto;
      width: 432 / @width75;
      height: 98 / @width75;
      background: url(../assets/icon/Section/jack@2x.png) no-repeat center
        center;
      background-size: 432 / @width75 66 / @width75;
      h2 {
        font-size: 70 / @width75;
        color: #ffffff;
        text-align: center;
      }
      p {
        line-height: 28 / @width75;
        height: 28 / @width75;
        font-size: 24 / @width75;
        text-align: center;
        color: #ffffff;
      }
    }
  }

  .car-box-top-area-y {
    height: 200 / @width75;
    background: #35bab6;
    border-radius: 50%;
    position: relative;
    top: -100 / @width75;
  }

  .car-box-content {
    width: 672 / @width75;
    border-radius: 25 / @width75;
    padding-top: 38 / @width75;
    position: absolute;
    z-index: 10;
    left: 50%;
    top: 144 / @width75;
    background: #ffffff;
    color: #000000;
    margin-left: -336 / @width75;
    .surplus-time {
      line-height: 40 / @width75;
      font-size: 28 / @width75;
      color: #666666;
      text-align: center;
      margin-bottom: 20 / @width75;
    }
    .clock {
      height: 44 / @width75;
      text-align: center;
      margin-bottom: 18 / @width75;
      img {
        display: inline-block;
        height: 44 / @width75;
      }
    }
    .surplus-times {
      height: 134 / @width75;
      padding-top: 10 / @width75;
      font-size: 112 / @width75;
      text-align: center;
      margin-bottom: 20 / @width75;
    }
    .suplus-two {
      display: flex;
      padding-left: 120 / @width75;
      padding-right: 120 / @width75;
      justify-content: space-between;
      .suplus-two-content {
        width: 210 / @width75;
        text-align: center;
        img {
          display: inline-block;
          height: 48 / @width75;
          margin-bottom: 16 / @width75;
        }
        h3 {
          font-size: 40 / @width75;
          line-height: 48 / @width75;
          text-align: center;
          height: 48 / @width75;
          margin-bottom: 8 / @width75;
        }
        p {
          line-height: 40 / @width75;
          height: 40 / @width75;
          font-size: 28 / @width75;
          color: #999999;
          margin-bottom: 40 / @width75;
        }
      }
    }
    .device-area {
      height: 92 / @width75;
      line-height: 92 / @width75;
      padding-left: 20 / @width75;
      padding-right: 20 / @width75;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      font-size: 26 / @width75;
      color: #666666;
    }

    .address-area {
      height: 200 / @width75;
      padding-left: 20 / @width75;
      padding-right: 30 / @width75;
      display: flex;
      justify-content: space-between;
      .address-area-left {
        width: 400 / @width75;
        overflow: hidden;
        h4 {
          margin-top: 42 / @width75;
          line-height: 44 / @width75;
          height: 44 / @width75;
          font-size: 32 / @width75;
          color: #000000;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 26 / @width75;
        }
        p {
          line-height: 36 / @width75;
          height: 36 / @width75;
          font-size: 26 / @width75;
          color: #666666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .address-area-right {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200 / @width75;
        img {
          display: inline-block;
          width: 28 / @width75;
          position: relative;
          top: -2 / @width75;
        }
        span {
          font-size: 20 / @width75;
          color: #999999;
          line-height: 28 / @width75;
          height: 28 / @width75;
        }
      }
    }
  }

  .close-btn {
    width: 672 / @width75;
    height: 88 / @width75;
    line-height: 88 / @width75;
    border-radius: 44 / @width75;
    overflow: hidden;
    background: #35bab6;
    color: #ffffff;
    font-size: 34 / @width75;
    position: absolute;
    left: 50%;
    margin-left: -336 / @width75;
    top: 1040 / @width75;
    text-align: center;
  }
}
</style>
<style lang="less">
@width75: 75rem;
.vux-x-dialog .weui-mask {
  z-index: 500 !important;
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
  display: inline-block;
  height: 40 / @width75!important;
  line-height: 40 / @width75!important;
  font-size: 36 / @width75!important;
  letter-spacing: 4px;
  color: #007aff;
  margin-bottom: 40 / @width75!important;
}
// .weui-dialog .vux-close: before,
// .weui-dialog .vux-close: after {
//   display: none;
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
