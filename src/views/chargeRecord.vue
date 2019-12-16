<template>
  <div class="charge-record">
    <div class="position" @click="show()">
      <div class="position-left"></div>
      <div class="position-right">
        <img src="../assets/选择时间段@2x.png">
      </div>
    </div>
    <div class="seletTime" v-show="isShow">
      <div class="seleTime-top">
        <div class="time">
          <datetime v-model="begintime" @on-confirm="changeBeginTime" :start-date="startDate"></datetime>
        </div>
        <div class="space"></div>
        <div class="time">
          <datetime
            v-model="endtime"
            @on-confirm="changeEndTime"
            :end-date="endDate"
            format="YYYY-MM-DD"
          ></datetime>
        </div>
      </div>
      <div class="seleTime-text">
        <div class="seleTime-intro">{{$t("ab.start")}}</div>
        <div class="seleTime-intro">{{$t("ab.end")}}</div>
      </div>
      <div class="search-btn" @click="searchRecord">
        <div @click="show()">{{$t("device.search")}}</div>
      </div>
    </div>
    <div class="charge-list">
      <div class="charge-item listitem" v-for="(item,index) in chargeList.data" :key="index">
        <div class="newest">
          <div class="new-left">
            <p>{{item.month}}</p>
            <p>{{$t("meterlow.pay")}}
              <span>￥{{item.paytotal}}</span>
            </p>
          </div>
          <div class="new-right"></div>
        </div>
        <div class="patern" v-for="(it,index) in item.detaillist" :key="index">
          <div class="patern-left">
            <div v-if="it.paymoney <= 0">
              <img src="../assets/tuifei.png">
            </div>
            <div v-else>
              <img src="../assets/shengyudianliang@2x.png">
            </div>
          </div>
          <div>
            <div class="patern-right">
              <div class="content-left">
                <p v-if="it.tokentype ==1" class="big">{{$t("personal.button")}}</p>
                <p v-else class="big">{{$t("device.refund")}}</p>
                <p class="one">
                  <span>{{$t("device.electricnumber")}}：</span>
                  {{it.commaddress}}
                </p>
                <p>{{formatTime2(it.paytime)}}</p>
              </div>
              <div class="content-right">
                <p class="priceone">{{it.paymoney.toFixed(1)}} {{$t("record.yuan")}}</p>
                <p>
                  <span>{{$t("meterlow.elprice")}}：</span>
                  {{it.pricevalue}}{{$t("record.yuan")}}
                </p>
                <p>
                  <span>{{$t("meterlow.elquantity")}}：</span>
                  {{it.payvalue.toFixed(1)}}kWh
                </p>
              </div>
            </div>
            <hr>
          </div>
        </div>
      </div>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showInfo" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("ab.greater")}}</p>
      </confirm>
    </div>

    <p class="datano" v-show="datano">
      <img src="../assets/noData.png" alt="">
      <br>
      暂无数据
    </p>
  </div>
</template>
<script>
import {
  Cell,
  Group,
  XButton,
  Blur,
  Datetime,
  Scroller,
  Confirm,
  TransferDom
} from "vux";
import { format } from "date-fns";
import { mapState, mapGetters, mapMutations } from "vuex";
import Bscroll from "better-scroll";
var userItem = JSON.parse(localStorage.getItem("userItem"));
export default {
  computed: {
    ...mapState({
      token: state => state.token
    }),
    ...mapGetters(["userInfos"])
  },
  directives: {
    TransferDom
  },
  components: {
    Cell,
    Group,
    XButton,
    Blur,
    Datetime,
    Scroller,
    Confirm,
    TransferDom
  },
  mounted() {
    this.$store
      .dispatch("AC_GetChatVendingRecordDeafut", {
        objid:this.$route.query.rtuid,
        begintime: this.formatTime(new Date().setHours(-24 * 7)) + " 00:00:00",
        endtime: this.formatTime(new Date()) + " 23:59:59",
      })
      .then(res => {
        this.chargeList.totalCount = res.data.total;
        if (this.chargingInfo.pageNum > 1) {
          this.chargeList.data = this.chargeList.data.concat(res.data.listitem);
        } else {
          this.chargeList.data = res.data.listitem;
        }
        if (res.data.total == 0) {
          this.datano = true;
        }
      });
  },

  data: function() {
    return {
      startDate: "",
      endDate: "",
      showInfo: false,
      startime1: "",
      startime2: "",
      eleprice: "",
      datano: false,
      paymoney: "",
      isShow: false,
      isEmpty: true,
      begintime: this.formatTime(new Date().setHours(-24 * 7)),
      endtime: this.formatTime(new Date()),
      chargingInfo: {
        chatid: userItem.openid,
        begintime: this.formatTime(new Date().setHours(-24 * 7)) + " 00:00:00",
        endtime: this.formatTime(new Date()) + " 23:59:59",
        pageSize: 5,
        pageNum: 1
      },
      chargeList: {
        totalCount: 0,
        data: []
      }
    };
  },
  methods: {
    show: function() {
      this.isShow = !this.isShow;
      this.endDate = this.formatTime(new Date().setHours(24 * 1));
      var qtime = this.formatTime(new Date().setHours(-24 * 183));
      this.startDate = qtime;
    },
    searchRecord() {
      var t1 = this.startime1 || this.chargingInfo.begintime.slice(0, 10);
      var t2 = this.startime2 || this.chargingInfo.endtime.slice(0, 10);
      var startTmp = t1.split("-");
      var endTmp = t2.split("-");
      var sd = new Date(startTmp[0], startTmp[1], startTmp[2]);
      var ed = new Date(endTmp[0], endTmp[1], endTmp[2]);
      if (sd.getTime() > ed.getTime()) {
        this.showInfo = true;
        return false;
      } else {
        this.chargingInfo.pageNum = 1;
        this.chargingInfo.pageSize = 5;
        this.isEmpty = true;
        this.$store
          .dispatch("AC_GetaddVendingRecord", this.chargingInfo)
          .then(res => {
            console.log(res.data);
            this.chargeList.totalCount = res.data.total;
            if (this.chargingInfo.pageNum > 1) {
              this.chargeList.data = this.chargeList.data.concat(
                res.data.listitem
              );
            } else {
              this.chargeList.data = res.data.listitem;
            }
            if (this.datano == true) {
              this.datano = false;
              if (res.data.total == 0) {
                this.datano = true;
              }
            } else {
              if (res.data.total == 0) {
                this.datano = true;
              }
            }
          });
      }
    },
    formatTime(val) {
      return format(val, "YYYY-MM-DD");
    },
    formatTime2(val) {
      return format(val, "YYYY-MM-DD HH:mm:ss");
    },
    changeBeginTime(value) {
      // console.log("开始时间" + value);
      this.chargingInfo.begintime = value + " 00:00:00";
      this.startime1 = value;
    },
    changeEndTime(value) {
      // console.log("结束时间" + value);
      this.chargingInfo.endtime = value + " 23:59:59";
      this.startime2 = value;
    },
    onConfirm() {}
  },
  watch: {}
};
</script>
<style lang="less" scoped>
.charge-record {
  background: #ffffff;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .position {
    margin: 10 / @width75 650 / @width75 0;
    .position-right {
      img {
        height: 54 / @width75;
        width: 54 / @width75;
      }
    }
  }
  .seletTime {
    height: 314 / @width75;
    background: #ffffff;
    margin-bottom: 20 / @width75;
    .seleTime-top {
      padding-top: 32 / @width75;
      height: 66 / @width75;
      display: flex;
      .time {
        width: 343 / @width75;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 36 / @width75;
      }
      img.turn {
        display: block;
        width: 64 / @width75;
      }
      .space {
        width: 64 / @width75;
      }
    }
  }

  .seleTime-text {
    height: 65 / @width75;
    display: flex;
    padding-left: 55 / @width75;
    padding-right: 65 / @width75;
    justify-content: space-between;
    margin-bottom: 20 / @width75;
    .seleTime-intro {
      width: 220 / @width75;
      height: 64 / @width75;
      line-height: 64 / @width75;
      font-size: 28 / @width75;
      color: #666666;
      text-align: center;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  .search-btn {
    width: 672 / @width75;
    height: 88 / @width75;
    text-align: center;
    line-height: 88 / @width75;
    background: #35bab6;
    border-radius: 44 / @width75;
    font-size: 34 / @width75;
    color: #ffffff;
    margin: 0 auto;
  }

  .newest {
    background: #fafafa;
    display: flex;
    overflow: hidden;
    height: 112 / @width75;
    // border-top: 3px double black;
  }
  .new-left {
    margin: 10 / @width75 39 / @width75;
    height: 82 / @width75;
    width: 540 / @width75;
    p {
      height: 36 / @width75;
      width: 208 / @width75;
      line-height: 36 / @width75;
      margin: 4 / @width75;
    }
  }
  .new-right {
    height: 82 / @width75;
    line-height: 82 / @width75;
    margin: 10 / @width75 39 / @width75;
    img {
      height: 54 / @width75;
      width: 54 / @width75;
    }
  }
  .patern {
    background: #ffffff;
    padding: 26 / @width75 39 / @width75;
    display: flex;
    overflow: hidden;
    .patern-left {
      align-items: center;
      display: flex;
      margin-right: 29 / @width75;
      img {
        width: 80 / @width75;
        height: 80 / @width75;
      }
    }
    .patern-right {
      display: flex;
      overflow: hidden;
      color: rgb(153, 153, 153);
    }
    .content-left {
      width: 345 / @width75;
      margin-top: 10 / @width75;
      p {
        margin-bottom: 10 / @width75;
      }
      .big {
        font-size: 28 / @width75;
        font-weight: bold;
        color: black;
      }
    }
    .content-right {
      width: 225 / @width75;
      text-align: right;
      margin-top: 10 / @width75;
      p {
        margin-bottom: 10 / @width75;
      }
      .priceone {
        font-size: 28 / @width75;
        color: black;
        font-weight: bold;
      }
    }
  }
  .datano {
    text-align: center;
    font-size: 32 / @width75;
    margin: 32 / @width75;
    padding-bottom: 32 / @width75;
    color: rgb(153,153,153);
    img {
      width: 262 / @width75;
      height: 210 / @width75;
      margin: 320 / @width75 0 70 / @width75;
    }
  }
}
@width75: 75rem;
</style>
<style lang="less">
@width75: 75rem;
.dp-header {
  height: 90 / @width75 !important;
  line-height: 90 / @width75 !important;
  border-bottom: 0.013333rem solid #c7c7c7;
  background: #fbf9fe;
}

.dp-header .dp-item {
  font-size: 36 / @width75 !important;
  letter-spacing: 4 / @width75;
}
.scroller-component {
  height: 6.346666rem !important;
}

.scroller-component .scroller-mask {
  background-size: 100% 2.72rem !important;
}

.scroller-component .scroller-indicator {
  height: 0.906666rem !important;
  top: 2.72rem !important;
}

.scroller-content .scroller-item {
  font-size: 0.426666rem !important;
  height: 0.906666rem !important;
  line-height: 0.906666rem !important;
}
.weui-toast__content {
  height: 150 / @width75;
  line-height: 150 / @width75;
  font-size: 40 / @width75;
}
.weui-dialog {
  max-width    : 540 / @width75!important;
  border-radius: 20 / @width75!important;
  overflow     : hidden;
}
.weui-dialog__hd .weui-dialog__title {
  font-size     : 36 / @width75!important;
  letter-spacing: 4px;
  font-weight   : bolder;
}

.weui-dialog__bd .text-center {
  color      : #030303 !important;
  line-height: 40 / @width75;
  font-size  : 30 / @width75!important;
}

.weui-dialog__ft {
  line-height: 88 / @width75!important;
  height     : 88 / @width75!important;
}

.weui-dialog__ft .weui-dialog__btn {
  line-height: 88 / @width75!important;
  height     : 88 / @width75!important;
  font-size  : 34 / @width75!important;
  color      : #007aff;
}
</style>

