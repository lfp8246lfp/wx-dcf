<template>
  <div class="battery-record">
    <div class="seletTime">
      <div class="seleTime-top">
        <div class="time">
          <datetime v-model="beginTime" @on-confirm="changeBeginTime" :start-date="startDate"></datetime>
        </div>
        <img src="../../assets/icon/Section/turn.png" class="turn">
        <div class="time">
          <datetime v-model="endTime" @on-confirm="changeEndTime" :end-date="endDate"></datetime>
        </div>
      </div>
      <div class="seleTime-text">
        <div class="seleTime-intro">开始时间</div>
        <div class="seleTime-intro">结束时间</div>
      </div>
      <div class="search-btn" @click="searchRecord">搜索</div>
      <div v-transfer-dom>
        <confirm v-model="showInfo" title="提示" @on-confirm="onConfirm">
          <p class="text-center">结束日期要大于开始日期</p>
        </confirm>
      </div>
    </div>
    <div class="scroller-wrap">
      <scroller
        lock-x
        height="-180px"
        ref="scrollerBottom"
        use-pullup
        :pullup-config="pullupDefaultConfig"
        @on-pullup-loading="loadMore"
        use-pulldown
        :pulldown-config="pulldownDefaultConfig"
        @on-pulldown-loading="refresh"
      >
        <div class="charge-list">
          <!-- key='item.id' -->
          <div class="charge-item" v-for="(item,index) of chargeList.data" :key="index">
            <cell
              :title="item.disc"
              :value="item.chargingstatus|chargingstatus"
              class="charge-title"
            ></cell>
            <div class="clearfix">
              <div class="left fl">
                <p>
                  充电开始时间:
                  <span>{{formatTime2(item.chargingdate)}}</span>
                </p>
                <p>
                  消费金额:
                  <span>{{item.chargingmoney}}元</span>
                </p>
              </div>
              <div class="right fr">
                <div class="num">{{item.tagno}}</div>
                <p class="name">插座号</p>
              </div>
            </div>
          </div>
        </div>
      </scroller>
    </div>
  </div>
</template>
<script>
import "@/tools/filter/filter.js";
import { Datetime, Group, Cell, Scroller, Confirm, TransferDom } from "vux";
import { format } from "date-fns";
import { mapState, mapGetters, mapMutations } from "vuex";
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
  directives: {
    TransferDom
  },
  components: {
    Datetime,
    Group,
    Cell,
    Scroller,
    Confirm,
    TransferDom
  },
  computed: {
    ...mapState({
      token: state => state.token
    })
  },
  data: function() {
    return {
      startDate: "",
      endDate: "",
      showInfo: false,
      startime1: "",
      startime2: "",
      pullupDefaultConfig: pullupDefaultConfig,
      pulldownDefaultConfig: pulldownDefaultConfig,
      isEmpty: true,
      beginTime: this.formatTime(new Date().setHours(-24 * 7)),
      endTime: this.formatTime(new Date()),
      chargingInfo: {
        chatid: "",
        dateFrom: "",
        dateTo: "",
        pageSize: 5,
        pageNum: 1
      },

      chargeList: {
        totalCount: 0,
        data: []
      }
    };
  },
  mounted() {
    this.chargingInfo = {
      chatid: this.$route.params.id || userItem.openid,
      dateFrom: this.beginTime + " " + "00:00:00",
      dateTo: this.endTime + " " + "23:59:59",
      pageSize: 5,
      pageNum: 1
    };
    this.startDate = this.formatTime(
      new Date().setHours(-24 * 183),
      "YYYY-MM-DD "
    );
    this.endDate = this.formatTime(new Date().setHours(24 * 1), "YYYY-MM-DD ");
    this.$nextTick(() => {
      this.$refs.scrollerBottom.reset({ top: 0 });
    });
    this.loadMore();
  },
  methods: {
    searchRecord() {
      var t1 = this.startime1 || this.chargingInfo.dateFrom.slice(0, 10);
      var t2 = this.startime2 || this.chargingInfo.dateTo.slice(0, 10);
      var startTmp = t1.split("-");
      var endTmp = t2.split("-");
      var sd = new Date(startTmp[0], startTmp[1], startTmp[2]);
      var ed = new Date(endTmp[0], endTmp[1], endTmp[2]);
      if (sd.getTime() > ed.getTime()) {
        this.showInfo = true;
        return false;
      } else {
        this.isEmpty = true;
        this.chargingInfo.pageNum = 1;
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
      this.chargingInfo.dateFrom = value + " " + "00:00:00";
      this.startime1 = value;
    },
    changeEndTime(value) {
      console.log("结束时间" + value);
      this.chargingInfo.dateTo = value + " " + "23:59:59";
      this.startime2 = value;
    },
    async getData(fn) {
      const result = await this.$store
        // .dispatch("AC_ChargeRecord", this.chargingInfo)
        .dispatch("AC_QueryChargeRecord", this.chargingInfo)
        .then(res => {
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset();
          });
          this.chargeList.totalCount = res.data.count;
          if (this.chargingInfo.pageNum > 1) {
            this.chargeList.data = this.chargeList.data.concat(
              //   res.data.appChargingRecordItems
              res.data.appBatteryChargingRdItems
            );
          } else {
            // this.chargeList.data = res.data.appChargingRecordItems;
            this.chargeList.data = res.data.appBatteryChargingRdItems;
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
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.header {
  margin-top: 20px;
  padding: 20px;
  display: flex;
  background: white;
  font-size: 40px;
  line-height: 40px;
  div {
    flex: 1;
  }
}
.scroller-wrap {
  position: absolute;
  top: 314 / @width75;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  .charge-list {
    .charge-item {
      width: 710 / @width75;
      margin: 20 / @width75 auto 0 auto;
      border-radius: 5 / @width75;
      background: #ffffff;
      .charge-title {
        height: 84 / @width75!important;
        line-height: 84 / @width75!important;
        font-size: 32 / @width75!important;
        font-weight: bolder;
        border-bottom: 4 / @width75 #fafafa solid;
        .weui-cell__ft {
          font-size: 26 / @width75!important;
          color: #64a618 !important;
          background: green !important;
        }
      }
      .left {
        padding-top: 30 / @width75;
        padding-bottom: 30 / @width75;
        p {
          line-height: 40 / @width75;
          padding-left: 18 / @width75;
          font-size: 28 / @width75;
          color: #000000;
          span {
            display: inline-block;
            color: #666666;
            padding-left: 8 / @width75;
          }
        }
      }
      .right {
        .num {
          margin-right: 48 / @width75;
          margin-top: 18 / @width75;
          width: 80 / @width75;
          line-height: 80 / @width75;
          height: 80 / @width75;
          background: #35bab6;
          overflow: hidden;
          border-radius: 50%;
          font-size: 28 / @width75;
          color: #ffffff;
          text-align: center;
        }
        .name {
          padding-top: 6 / @width75;
          padding-bottom: 14 / @width75;
          line-height: 40 / @width75;
          font-size: 28 / @width75;
        }
      }
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
</style>

<style lang="less">
@width75: 75rem;
// .time .weui-cell_access .weui-cell__ft: after {
//   display: none !important;
// }

.time .vux-cell-value {
  color: #000000;
}

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
</style>





