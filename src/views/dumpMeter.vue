<template>
  <div class="dump-meter">
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
          <datetime v-model="endtime" @on-confirm="changeEndTime" :end-date="endDate"></datetime>
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
    <div class="scroller-wrap">
      <scroller
        lock-x
        height="-30px"
        ref="scrollerBottom"
        use-pullup
        :pullup-config="pullupDefaultConfig"
        @on-pullup-loading="loadMore"
        use-pulldown
        :pulldown-config="pulldownDefaultConfig"
        @on-pulldown-loading="refresh"
      >
        <div class="charge-list">
          <div class="charge-item listitem" v-for="(item,index) in chargeList.data" :key="index">
            <div class="patern">
              <div class="patern-left">
                <img src="../assets/dianbiaodushu@2x.png">
              </div>
              <div>
                <div class="patern-right">
                  <div class="content-left">
                    <p class="one">
                      <span>{{$t("device.electricnumber")}}：</span>
                      {{item.commaddress}}
                    </p>
                    <p>{{formatTime2(item.datatime)}}</p>
                  </div>
                  <div class="content-right">
                    <p>{{item.zybm.toFixed(1)}}(kWh)</p>
                  </div>
                </div>
                <hr>
              </div>
            </div>
          </div>
        </div>
      </scroller>
    </div>
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
import { mapState, mapGetters, mapMutations } from "vuex";
import { format } from "date-fns";
import Bscroll from "better-scroll";
var userItem = JSON.parse(localStorage.getItem("userItem"));

const pulldownDefaultConfig = {
  content: "下拉刷新",
  height: 40,
  autoRefresh: false,
  downContent: "下拉刷新",
  upContent: "释放后刷新",
  loadingContent: "正在刷新...",
  clsPrefix: "xs-plugin-pulldown-"
};
const pullupDefaultConfig = {
  content: "上拉加载更多",
  pullUpHeight: 60,
  height: 40,
  autoRefresh: false,
  downContent: "释放后加载",
  upContent: "上拉加载更多",
  loadingContent: "加载中...",
  clsPrefix: "xs-plugin-pullup-"
};
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
    this.chargingInfo = {
      objid: this.$route.query.rtuid,
      begintime: this.begintime + " 00:00:00",
      endtime: this.endtime + " 23:59:59",
      pageSize: 12,
      pageNum: 1
    };
    this.$nextTick(() => {
      this.$refs.scrollerBottom.reset({ top: 0 });
    });
    this.loadMore();
  },

  data: function() {
    return {
      startDate: "",
      endDate: "",
      showInfo: false,
      startime1: "",
      startime2: "",
      datano: false,
      isShow: false,
      pullupDefaultConfig: pullupDefaultConfig,
      pulldownDefaultConfig: pulldownDefaultConfig,
      isEmpty: true,
      begintime: this.formatTime(new Date().setHours(-24 * 7)),
      endtime: this.formatTime(new Date()),
      chargingInfo: {
        objid: this.$route.query.rtuid,
        begintime: this.formatTime(new Date().setHours(-24 * 7)) + " 00:00:00",
        endtime: this.formatTime(new Date()) + " 23:59:59",
        pageSize: 12,
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
        this.isEmpty = true;
        this.loadMore();
      }
    },

    formatTime(val) {
      return format(val, "YYYY-MM-DD");
    },
    formatTime2(val) {
      return format(val, "YYYY-MM-DD HH:mm:ss");
    },
    changeBeginTime(value) {
      console.log("开始时间" + value);
      this.chargingInfo.begintime = value;
      this.startime1 = value;
    },
    changeEndTime(value) {
      console.log("结束时间" + value);
      this.chargingInfo.endtime = value + " " + "23:59:59";
      this.startime2 = value;
    },
    // endTime: function() {
    //   var date = new Date();
    //   var y    = date.getFullYear();
    //   var m    = date.getMonth() + 1;
    //       m    = m < 10 ? "0" + m : m;
    //   var d = date.getDate();
    //       d = d < 10 ? "0" + d : d;
    //   var h = date.getHours();
    //       h = h < 10 ? "0" + h : h;
    //   var minute = date.getMinutes();
    //   var second = date.getSeconds();
    //       minute = minute < 10 ? "0" + minute : minute;
    //   second = second < 10 ? "0" + second : second;
    //   return y + "-" + m + "-" + d + " " + 23 + ":" + 59 + ":" + 59;
    // },

    // nowTime: function() {
    //   var date = new Date(Date.parse(new Date()) - 2 * 24 * 60 * 60 * 1000);
    //   //获取系统前一个月的时间
    //   var y = date.getFullYear();
    //   var m = date.getMonth() + 1;
    //       m = m < 10 ? "0" + m : m;
    //   var d = date.getDate();
    //       d = d < 10 ? "0" + d : d;
    //   var h = date.getHours();
    //       h = h < 10 ? "0" + h : h;
    //   var minute = date.getMinutes();
    //   var second = date.getSeconds();
    //       minute = minute < 10 ? "0" + minute : minute;
    //   second = second < 10 ? "0" + second : second;
    //   return y + "-" + m + "-" + d + " " + "00" + ":" + "00" + ":" + "00";
    // },
    async getData(fn) {
      const result = await this.$store
        .dispatch("AC_GetChatEnergyData", this.chargingInfo)
        .then(res => {
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset();
          });
          this.chargeList.totalCount = res.data.total;
          console.log(res.data);
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

          fn();
        });
    },

    loadMore() {
      if (this.isEmpty) {
        this.isEmpty = false;
      } else {
        this.chargingInfo.pageNum++;
      }
      this.getData(() => {
        let index = this.chargingInfo.pageSize * this.chargingInfo.pageNum;

        if (this.chargeList.totalCount <= index) {
          this.$refs.scrollerBottom.disablePullup();
        }
        this.$refs.scrollerBottom.donePullup();
      });
    },
    refresh() {
      this.$refs.scrollerBottom.disablePullup();
      this.chargingInfo.pageNum = 1;
      this.getData(() => {
        let index = this.chargingInfo.pageSize * this.chargingInfo.pageNum;
        if (this.chargeList.totalCount > index) {
          this.$refs.scrollerBottom.enablePullup();
        }

        this.$refs.scrollerBottom.donePulldown();
      });
    },
    onConfirm() {}
  },
  watch: {}
};
</script>
<style lang="less" scoped>
.dump-meter {
  background: #ffffff;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .position {
    display: flex;
    overflow: hidden;
    margin: 10 / @width75 39 / @width75 0;
    z-index: 100000;
    .position-left {
      width: 590 / @width75;
      height: 54 / @width75;
      line-height: 54 / @width75;
    }
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
      //   padding-top: 32 / @width75;
      height: 66 / @width75;
      display: flex;
      .time {
        width: 343 / @width75;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 36 / @width75;
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
    height: 78 / @width75;
    line-height: 78 / @width75;
    // border-top: 3px double black;
  }
  .new-left {
    margin: 10 / @width75 39 / @width75;
    height: 78 / @width75;
    line-height: 78 / @width75;
    width: 540 / @width75;
  }
  .new-right {
    height: 78 / @width75;
    line-height: 78 / @width75;
    margin: 0 39 / @width75;
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
      margin-right: 29 / @width75;
      img {
        width: 80 / @width75;
        height: 80 / @width75;
      }
    }
    .patern-right {
      display: flex;
      overflow: hidden;
    }
    .content-left {
      width: 350 / @width75;
      p {
        margin-bottom: 10 / @width75;
      }
      .one {
        font-size: 28 / @width75;
        padding: 8/@width75 0 0 ;
        color: black;
        span {
          font-weight: bold;
        }
      }
    }
    .content-right {
      width: 200 / @width75;
      text-align: right;
      p {
        font-size: 32 / @width75;
        color: black;
        height: 36 / @width75;
        line-height: 36 / @width75;
        margin: 4 / @width75 0;
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
