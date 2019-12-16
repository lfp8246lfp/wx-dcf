<template>
  <!-- <div class="rechargeRecord">
    <div class="seletTime">
      <div class="seleTime-top">
        <div class="time">
          <datetime v-model="beginTime" @on-confirm="changeBeginTime"></datetime>
        </div>
        <img src="../../assets/icon/Section/turn.png" class="turn">
        <div class="time">
          <datetime v-model="endTime" @on-confirm="changeEndTime"></datetime>
        </div>
      </div>
      <div class="seleTime-text">
        <div class="seleTime-intro">开始时间</div>
        <div class="seleTime-intro">结束时间</div>
      </div>
      <div class="search-btn" @click="searchRecord">搜索</div>
    </div>
    <div class="recharge-list">
      <group>
        <div class="total-money">
          <cell title="充值总额:" :value="this.totalMoney+'元'"></cell>
        </div>

        <scroller
          lock-x
          ref = "scrollerBottom"
          use-pullup
          :pullup-config       = "pullupDefaultConfig"
            @on-pullup-loading = "loadMore"
          use-pulldown
          :pulldown-config       = "pulldownDefaultConfig"
            @on-pulldown-loading = "refresh"
        >
          <div class="record-list">
            <cell
              :title  = "'充电时间：'+formatTime2(item.rechargedate)"
                v-for = "(item,index) of  this.recordList.data"
              :key    = "item.rechargeid"
            >
              <div>
                <span class="cell-type">{{item.rechargetype|rechargetype}}金额: </span>
                <span class="cell-money">{{item.rechargevalue}}元</span>
              </div>
            </cell>
          </div>
        </scroller>
      </group>
    </div>
  </div>-->
  <div class="charge-record">
    <div class="position" @click="show()">
      <div class="position-left"></div>
      <div class="position-right">
        <img src="../../assets/选择时间段@2x.png">
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
        <div class="seleTime-intro">开始时间</div>
        <div class="seleTime-intro">结束时间</div>
      </div>
      <div class="search-btn" @click="searchRecord">
        <div @click="show()">搜索</div>
        <div v-transfer-dom>
          <confirm v-model="showInfo" title="提示" @on-confirm="onConfirm">
            <p class="text-center">结束日期要大于开始日期</p>
          </confirm>
        </div>
      </div>
    </div>
    <!-- <div class="scroller-wrap">
    <scroller lock-x ref="scrollerBottom" use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore" use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh">-->
    <div class="charge-list">
      <div class="charge-item listitem" v-for="(item,index) in chargeList.data" :key="index">
        <div class="newest">
          <div class="new-left">
            <p>{{item.month}}</p>
            <p>
              支出
              <span>￥{{item.paytotal}}</span>
              <span style="margin-left:0.52rem">收入￥{{item.incometotal}}</span>
            </p>
          </div>
          <div class="new-right"></div>
        </div>
        <div class="patern" v-for="(it,index) in item.detaillist" :key="index">
          <div class="patern-left">
            <div v-if="it.detailtype == 5">
              <img src="../../assets/tuifei.png">
            </div>
            <div v-if="it.detailtype == 4">
              <img src="../../assets/tuifei.png">
            </div>
            <div v-else-if="it.detailtype == 3">
              <img src="../../assets/shengyudianliang@2x.png">
            </div>
            <div v-else-if="it.detailtype == 2">
              <img src="../../assets/2@2x.png">
            </div>
            <div v-else-if="it.detailtype == 1">
              <img src="../../assets/yuev@2x.png">
            </div>
          </div>
          <div>
            <div class="patern-right">
              <div class="content-left">
                <p class="one" v-if="it.detailtype == 3">电表充值</p>
                <p class="one" v-if="it.detailtype == 4">电动车退费</p>
                <p class="one" v-if="it.detailtype == 5">wifi表退费清零</p>
                <p class="one" v-if="it.detailtype == 2">电动车充电</p>
                <p class="one" v-if="it.detailtype == 1">余额充值</p>
                <p>{{formatTime2(it.transactionsdate)}}</p>
              </div>
              <div class="content-right">
                <p>{{it.transactionsvalue}}</p>
              </div>
            </div>
            <hr>
          </div>
        </div>
      </div>
    </div>
    <!-- </scroller>
    </div>-->
  </div>
</template>
 <script>
// import { format } from "date-fns";
// import { Datetime, Group, Cell, Scroller } from "vux";
// import { mapState, mapGetters, mapMutations } from "vuex";
// import "@/tools/filter/filter.js";
// var   userItem              = JSON.parse(localStorage.getItem("userItem"));
// const pulldownDefaultConfig = {
//   content       : "下拉刷新",
//   height        : 40,
//   autoRefresh   : false,
//   downContent   : "下拉刷新",
//   upContent     : "释放后刷新",
//   loadingContent: "正在刷新...",
//   clsPrefix     : "xs-plugin-pulldown-"
// };
// const pullupDefaultConfig = {
//   content       : "上拉加载更多",
//   pullUpHeight  : 60,
//   height        : 40,
//   autoRefresh   : false,
//   downContent   : "释放后加载",
//   upContent     : "上拉加载更多",
//   loadingContent: "加载中...",
//   clsPrefix     : "xs-plugin-pullup-"
// };
// export default {
//   computed: {
//     ...mapState({
//       token: state => state.token
//     })
//   },
//   components: {
//     Datetime,
//     Group,
//     Cell,
//     Scroller
//   },
//   data: function() {
//     return {
//       pullupDefaultConfig  : pullupDefaultConfig,
//       pulldownDefaultConfig: pulldownDefaultConfig,
//       isEmpty              : true,
//       beginTime            : this.formatTime(new Date().setHours(-24 * 7)),
//       endTime              : this.formatTime(new Date()),
//       recordInfo           : {
//         chatid   : "",
//         begintime: "2018-6-19 00:00:00",
//         endtime  : "2018-6-19 23:59:59",
//         pageSize : 20,
//         pageNum  : 1
//       },
//       recordList: {
//         totalCount: 0,
//         data      : []
//       },
//       totalMoney: 0
//     };
//   },

//   mounted: function() {
//     if (this.$route.params.id) {
//       this.$route.params.rechargetype = 1;
//     }
//     this.recordInfo = {
//       chatid   : this.$route.params.id || userItem.openid,
//       begintime: this.beginTime + "00:00:00",
//       endtime  : this.endTime + "23:59:59",
//       pageSize : 20,
//       pageNum  : 1
//     };
//     this.$nextTick(() => {
//       this.$refs.scrollerBottom.reset({ top: 0 });
//     });
//     this.loadMore();
//   },
//   methods: {
//     searchRecord() {
//       this.recordInfo.pageNum = 1;
//       this.isEmpty            = true;
//       this.loadMore();
//     },
//     async getData(fn) {
//       const result = await this.$store
//         .dispatch("AC_RechargeRecord", this.recordInfo)
//         .then(res => {
//           this.$nextTick(() => {
//             this.$refs.scrollerBottom.reset();
//           });
//           this.recordList.totalCount = res.data.count;
//           if (this.recordInfo.pageNum > 1) {
//             this.recordList.data = this.recordList.data.concat(
//                 res.data.appRechargeRecordItems
//             );
//           } else {
//             this.recordList.data = res.data.appRechargeRecordItems;
//           }
//             if (this.recordList.data) {
//               if (this.recordInfo.pageNum == 1) {
//                 this.totalMoney = 0;
//               }
//               for (let item of res.data.transActionsRecordItems) {
//                 this.totalMoney = this.accAdd(
//                   this.totalMoney,
//                   item.rechargevalue
//                 );
//               }
//             } else {
//               this.totalMoney = 0;
//             }
//             this.totalMoney = Math.floor(Math.round(this.totalMoney * 100)) / 100;
//             fn();
//         });
//     },
//     accAdd(arg1, arg2) {
//       var r1, r2, m;
//       try {
//         r1 = arg1.toString().split(".")[1].length;
//       } catch (e) {
//         r1 = 0;
//       }
//       try {
//         r2 = arg2.toString().split(".")[1].length;
//       } catch (e) {
//         r2 = 0;
//       }
//       m = Math.pow(10, Math.max(r1, r2));
//       return (arg1 * m + arg2 * m) / m;
//     },
//     formatTime(val) {
//       return format(val, "YYYY-MM-DD ");
//     },
//     formatTime2(val) {
//       return format(val, "YYYY-MM-DD HH:mm:ss");
//     },
//     changeBeginTime(value) {
//       console.log("开始时间" + value);

//       this.recordInfo.dateFrom = value + " " + "00:00:00";
//     },
//     changeEndTime(value) {
//       console.log("结束时间" + value);

//       this.recordInfo.dateTo = value + " " + "23:59:59";
//     },

//     loadMore() {
//       if (this.isEmpty) {
//         this.isEmpty = false;
//       } else {
//         this.recordInfo.pageNum++;
//       }
//       this.getData(() => {
//         let index = this.recordInfo.pageSize * this.recordInfo.pageNum;

//         if (this.recordList.totalCount <= index) {
//           this.$refs.scrollerBottom.disablePullup();
//         }
//         this.$refs.scrollerBottom.donePullup();
//       });
//     },
//     refresh() {
//       this.recordInfo.pageNum = 1;
//       this.$refs.scrollerBottom.disablePullup();
//       this.getData(() => {
//         let index = this.recordInfo.pageNum * this.recordInfo.pageSize;
//         console.log(index);
//         console.log(this.recordList.totalCount);
//         if (this.recordList.totalCount > index) {
//           this.$refs.scrollerBottom.enablePullup();
//         }
//         this.$refs.scrollerBottom.donePulldown();
//       });
//     }
//   }
// };
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
    this.$store
      .dispatch("AC_getChatTransActionsDeafut", {
        chatid: userItem.openid
      })
      .then(res => {
        // console.log(res.data);
        this.chargeList.totalCount = res.data.total;
        if (this.chargingInfo.pageNum > 1) {
          this.chargeList.data = this.chargeList.data.concat(
            res.data.transActionsRecordItems
          );
        } else {
          this.chargeList.data = res.data.transActionsRecordItems;
        }
      });
    this.startDate = this.formatTime(
      new Date().setHours(-24 * 183),
      "YYYY-MM-DD "
    );
    this.endDate = this.formatTime(new Date().setHours(24 * 1), "YYYY-MM-DD ");
  },

  data: function() {
    return {
      startDate: "",
      endDate: "",
      showInfo: false,
      startime1: "",
      startime2: "",
      paymoney: "",
      isShow: false,
      pullupDefaultConfig: pullupDefaultConfig,
      pulldownDefaultConfig: pulldownDefaultConfig,
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
        this.isEmpty = true;
        this.chargingInfo.pageNum = 1;
        this.$store
          .dispatch("AC_GetChatTransActions", this.chargingInfo)
          .then(res => {
            this.chargeList.totalCount = res.data.total;
            if (this.chargingInfo.pageNum > 1) {
              this.chargeList.data = this.chargeList.data.concat(
                res.data.transActionsRecordItems
              );
            } else {
              this.chargeList.data = res.data.transActionsRecordItems;
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
      console.log("开始时间" + value);
      this.chargingInfo.begintime = value + " 00:00:00";
      this.startime1 = value;
    },
    changeEndTime(value) {
      console.log("结束时间" + value);
      this.chargingInfo.endtime = value + " 23:59:59";
      this.startime2 = value;
    },
    onConfirm() {}
  },
  watch: {}
};
</script>
// <style lang="less" scoped>
// @width75: 75rem;
// .total-money {
//   height       : 104 / @width75;
//   line-height  : 104 / @width75;
//   padding-left : 38 / @width75;
//   padding-right: 40 / @width75;
//   font-size    : 32 / @width75;
//   color        : #000000;
//   border-bottom: 1px solid rgba(0, 0, 0, 0.1);
//   .weui-cell {
//     padding: 0;
//     .weui-cell__ft {
//       font-size: 32 / @width75;
//       color    : #000000;
//     }
//   }
// }

// .recharge-list {
//   .cell-type {
//     display    : inline-block;
//     font-size  : 28 / @width75;
//     line-height: 40 / @width75;
//     color      : #000000;
//   }
//   .cell-money {
//     color      : #666666;
//     display    : inline-block;
//     font-size  : 28 / @width75;
//     line-height: 40 / @width75;
//     display    : inline-block;
//   }
// }

// .seletTime {
//   height       : 314 / @width75;
//   background   : #ffffff;
//   margin-bottom: 20 / @width75;
//   .seleTime-top {
//     padding-top: 32 / @width75;
//     height     : 66 / @width75;
//     display    : flex;
//     .time {
//       width          : 343 / @width75;
//       display        : flex;
//       justify-content: center;
//       align-items    : center;
//       font-size      : 36 / @width75;
//     }
//     img.turn {
//       display: block;
//       width  : 64 / @width75;
//     }
//   }
// }

// .seleTime-text {
//   height         : 65 / @width75;
//   display        : flex;
//   padding-left   : 55 / @width75;
//   padding-right  : 65 / @width75;
//   justify-content: space-between;
//   margin-bottom  : 20 / @width75;
//   .seleTime-intro {
//     width      : 220 / @width75;
//     height     : 64 / @width75;
//     line-height: 64 / @width75;
//     font-size  : 28 / @width75;
//     color      : #666666;
//     text-align : center;
//     border-top : 1px solid rgba(0, 0, 0, 0.1);
//   }
// }

// .search-btn {
//   width        : 672 / @width75;
//   height       : 88 / @width75;
//   text-align   : center;
//   line-height  : 88 / @width75;
//   background   : #35bab6;
//   border-radius: 44 / @width75;
//   font-size    : 34 / @width75;
//   color        : #ffffff;
//   margin       : 0 auto;
// }
//
</style>

// <style lang="less">
// @width75: 75rem;
// .time .weui-cell_access .weui-cell__ft: after {
//   display: none !important;
// }

// .time .vux-cell-value {
//   color: #000000;
// }
// .record-list {
//   .weui-cell {
//     width         : 670 / @width75;
//     margin        : 0 auto;
//     padding       : 20 / @width75 0;
//     flex-direction: column;
//     align-items   : flex-start;
//     border-bottom : none;
//     .vux-cell-primary {
//       .vux-label {
//         line-height  : 40 / @width75;
//         display      : block;
//         font-size    : 28 / @width75;
//         margin-bottom: 14 / @width75;
//       }
//     }
//   }
// }

// .dp-header {
//   height       : 90 / @width75 !important;
//   line-height  : 90 / @width75 !important;
//   border-bottom: 0.013333rem solid #c7c7c7;
//   background   : #fbf9fe;
// }

// .dp-header .dp-item {
//   font-size     : 36 / @width75 !important;
//   letter-spacing: 4 / @width75;
// }

// .scroller-component {
//   height: 6.346666rem !important;
// }

// .scroller-component .scroller-mask {
//   background-size: 100% 2.72rem !important;
// }

// .scroller-component .scroller-indicator {
//   height: 0.906666rem !important;
//   top   : 2.72rem !important;
// }

// .scroller-content .scroller-item {
//   font-size  : 0.426666rem !important;
//   height     : 0.906666rem !important;
//   line-height: 0.906666rem !important;
// }
//
</style>
<style lang="less" scoped>
.charge-record {
  background: #ffffff;
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
      width: 508 / @width75;
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
      width: 420 / @width75;
      padding: 10/@width75 0;
      p {
        margin-bottom: 10 / @width75;
      }
      .one {
        font-size: 28 / @width75;
        font-weight: bold;
      }
    }
    .content-right {
      width: 120 / @width75;
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
</style>


