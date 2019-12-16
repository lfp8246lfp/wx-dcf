<template>
  <div class="meter-base">
    <div class="scroller-wrap">
      <scroller
        lock-x
        ref="scrollerBottom"
        use-pullup
        :pullup-config="pullupDefaultConfig" 
        @on-pullup-loading="loadMore"
        use-pulldown
        :pulldown-config="pulldownDefaultConfig"
        @on-pulldown-loading="refresh"
      >
        <!-- <div>
          <div class="seletTime">
            <div class="seleTime-top">
              <div class="time">
                <datetime v-model="dateFrom" @on-confirm="changedateFrom" :start-date="startDate"></datetime>
              </div>
              <div class="space"></div>
              <div class="time">
                <datetime v-model="dateTo" @on-confirm="changedateTo" :end-date="endDate"></datetime>
              </div>
            </div>
            <div class="seleTime-text">
              <div class="seleTime-intro">开始时间</div>
              <div class="seleTime-intro">结束时间</div>
            </div>
            <div class="search-btn" @click="searchRecord">
              <div>搜索</div>
            </div>
          </div>

          <div v-transfer-dom>
            <confirm v-model="showInfo" title="提示" @on-confirm="onConfirm">
              <p class="text-center">结束日期要大于开始日期</p>
            </confirm>
          </div>
          
          <div class="charge-list">
            <div class="charge-item listitem" v-for="(item,index) in chargeList.data" :key="index">
              <div class="patern">
                <div class="patern-left">
                  <div v-if="item.withdrawtype == 1">
                    <img src="../../assets/cardBank.png">
                  </div>
                  <div v-else-if="item.withdrawtype == 2">
                    <img src="../../assets/chat.png">
                  </div>
                  <div v-else>
                    <img src="../../assets/zhiFuBao.png">
                  </div>
                </div>
                <div>
                  <div class="patern-right">
                    <div class="content-left">
                      <p class="one">
                        <span>提现账号：{{item.payid}}</span>
                        {{item.commaddress}}
                      </p>
                      <p>{{formatTime2(item.withdrawdate)}}</p>
                    </div>
                    <div class="content-right">
                      <p>{{item.rechargevalue.toFixed(1)}}</p>
                      <p class="statu" v-if="item.rechargetype ==1">提交待审核</p>
                      <p class="statu" v-else-if="item.rechargetype ==2">审核待发放</p>
                      <p class="statu" v-else-if="item.rechargetype ==3">已发放</p>
                      <p class="statu" v-else-if="item.rechargetype ==4">已完成</p>
                    </div>
                  </div>
                  <hr>
                </div>
              </div>
            </div>
          </div>
        </div> -->
        <p class="datano" v-show="datano">
            <img src="../../assets/noData.png" alt="">
            <br>
            暂无数据
        </p>
        <div class="meter-box" v-for="(item,index) in chargeList.data" :key="index">
          <router-link :to="{ name: 'putRecordDetail', params: { id: item.withdrawlogid }}">
            <div class="box-t">
              <p>{{$t('recharge.wechatcash')}}</p>
              <p>{{item.rechargevalue.toFixed(1)}}</p>
            </div>
            <div class="box-t">
              <span>{{item.payid}}</span>
              <span>{{formatTime2(item.withdrawdate)}}</span>
            </div>
          </router-link>
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
// var userItem = JSON.parse(localStorage.getItem("userItem"));
var id = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;

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
  autoRefresh: true,
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
      accountid: id,
      pageSize: 20,
      pageNum: 1
    };
    this.$nextTick(() => {
      this.$refs.scrollerBottom.reset({ top: 0 });
    });
    this.loadMore();
  },
  data: function() {
    return {
      datano: false, //暂无数据
      pullupDefaultConfig: pullupDefaultConfig,
      pulldownDefaultConfig: pulldownDefaultConfig,
      isEmpty: true,
      chargingInfo: { //传递的参数
        accountid: id,
        pageSize: 8,
        pageNum: 1
      },
      chargeList: { //数据
        totalCount: 0,
        data: []
      },
      content:""
    };
  },
  methods: {
    // //   搜索记录
    // searchRecord() {
    //   var t1 = this.startime1 || this.chargingInfo.dateFrom.slice(0, 10);
    //   var t2 = this.startime2 || this.chargingInfo.dateTo.slice(0, 10);
    //   var startTmp = t1.split("-");
    //   var endTmp = t2.split("-");
    //   var sd = new Date(startTmp[0], startTmp[1], startTmp[2]);
    //   var ed = new Date(endTmp[0], endTmp[1], endTmp[2]);
    //   if (sd.getTime() > ed.getTime()) {
    //     this.showInfo = true;
    //     return false;
    //   } else {
    //     this.isEmpty = true;
    //     this.chargingInfo.pageNum = 1;
    //     this.loadMore();
    //   }
    // },
    formatTime(val) {
      return format(val, "YYYY-MM-DD");
    },
    formatTime2(val) {
      return format(val, "YYYY-MM-DD HH:mm:ss");
    },
    async getData(fn) {
      const result = await this.$store
        .dispatch("AC_QueryAppWithdRawLog", this.chargingInfo)
        .then(res => {
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset();
          });
          this.chargeList.totalCount = res.data.total;
          if (this.chargingInfo.pageNum > 1) {
            this.chargeList.data = this.chargeList.data.concat(
              res.data.appWithdRawLogItems
            );
          } else {
            this.chargeList.data = res.data.appWithdRawLogItems;
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
    // 加载更多
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
        // this.$refs.scrollerBottom.donePullup();
        this.$refs.scrollerBottom.reset({ bottom: 0 });
      });
    },
    // 刷新
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
    // 确定事件（形式上的）
    onConfirm() {}
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.meter-base{
  background: #ffffff;
  .meter-box{
    padding: 34/@width75 39/@width75 20/@width75;
    border-bottom: 2px solid rgb(244, 244, 244);
    a{
      display: block;
      color: black;
    }
  }
  .box-t{
    display: flex;
    justify-content: space-between;
    margin-bottom: 14/@width75;
    p{
      font-size: 28/@width75;
    }
    span{
      font-size: 24/@width75;
      color: rgb(102, 102, 102)
    }
  }
}
.meter-base {
  background: #ffffff;
  .position {
    display: flex;
    overflow: hidden;
    margin: 10 / @width75 39 / @width75 0;
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
    // margin-bottom: 20 / @width75;
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
    margin: 26 / @width75 39 / @width75;
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
      p {
        margin-bottom: 10 / @width75;
      }
      .one {
        font-size: 28 / @width75;
        color: black;
        span {
          font-weight: bold;
        }
      }
    }
    .content-right {
      width: 120 / @width75;
      text-align: right;
      p {
        font-size: 32 / @width75;
        height: 36 / @width75;
        line-height: 36 / @width75;
        margin: 4 / @width75 0;
      }
      .statu {
        height: 27 / @width75;
        line-height: 27 / @width75;
        font-size: 22 / @width75;
        color: red;
      }
    }
  }
}

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
