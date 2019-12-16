<template>
  <div class="Charging">
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
      <div class="charge-list">
        <div
          class="charge-item"
          v-for="item of this.userChargingList.data"
          :key="item.tagno"
        >
          <cell
            :title="item.disc"
            class="charge-title"
            :isLink="true"
            :link="{path:`/tab2/${item.pmeterid}`}"
          ></cell>
          <div class="clearfix">
            <div class="left fl">
              <p>
                充电开始时间：
                <span>{{item.chargingdate|date}}</span>
              </p>
              <p>
                充电剩余时间：
                <span>
                  <clocker :time="item.leaveTime" format="%H : %M : %S"></clocker>
                </span>
              </p>
              <p>
                充电进度：
                <span>{{item.speed}}%</span>
              </p>
              <p>
                功率：
                <span>{{item.currentpower*1000}}瓦</span>
              </p>
            </div>
            <div class="right fr">
              <div class="number">{{item.tagno}}</div>
              <div class="name">插座号</div>
            </div>
          </div>
        </div>
      </div>
      <p class="datano" v-show="datano">暂无数据</p>
    </scroller>
    
  </div>
</template>
<script>
import { format } from "date-fns";
import "@/tools/filter/filter.js";
import { timeDif, formatDate } from "@/tools/commonJs/common";
import { Datetime, Group, Cell, Scroller, LoadMore, Clocker } from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";

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

var userItem = JSON.parse(localStorage.getItem("userItem"));
export default {
  computed: {
    ...mapState({
      token: state => state.token
    })
  },
  components: {
    Datetime,
    Group,
    Cell,
    Scroller,
    LoadMore,
    Clocker
  },
  data: function() {
    return {
      timers: [],
      pullupDefaultConfig: pullupDefaultConfig,
      pulldownDefaultConfig: pulldownDefaultConfig,
      isEmpty: true,
      userChargingList: {
        totalCount: 0,
        data: []
      },
      userChargingInfo: {
        chatid: "",
        pageSize: 5,
        pageNum: 1
      },
      datano: false
    };
  },

  mounted: function() {
    this.$nextTick(() => {
      this.$refs.scrollerBottom.reset({ top: 0 });
    });
    this.loadMore();
  },
  beforeDestroy() {
    if (this.timers.length > 0) {
      for (let item of this.timers) {
        clearInterval(item);
      }
    }
  },
  methods: {
    async getData(fn) {
      const result = await this.$store
        // .dispatch("AC_GetUserCharging",
        .dispatch("AC_QueryUserBtCharging", {
          chatid: this.$route.params.id || userItem.openid,
          pageSize: 5,
          pageNum: this.userChargingInfo.pageNum
        })
        .then(res => {
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset();
          });
          if (res.data.count == 0) {
            this.datano = true;
            console.log(123);
          } else {
            this.datano = false;
          }
          if (res.data.userBtChargingItems) {
            for (let item of res.data.userBtChargingItems) {
              item.leaveTime = this.formatTime(
                new Date(item.chargingdate).getTime() +
                  60 * 60 * 1000 * item.chargingduration
              );
              item.speed =
                100 -
                timeDif(
                  new Date(),
                  new Date(item.chargingdate),
                  item.chargingduration
                ).speeds;
            }
          }
          this.userChargingList.totalCount = res.data.count;
          if (this.userChargingInfo.pageNum > 1) {
            this.userChargingList.data = this.userChargingList.data.concat(
              //   res.data.userChargingItems
              res.data.userBtChargingItems
            );
          } else {
            // this.userChargingList.data = res.data.userChargingItems;
            this.userChargingList.data = res.data.userBtChargingItems;
          }
          this.timer();
          fn();
        });
    },
    refresh() {
      this.$refs.scrollerBottom.disablePullup();
      this.userChargingInfo.pageNum = 1;
      this.getData(() => {
        let index =
          this.userChargingInfo.pageSize * this.userChargingInfo.pageNum;
        if (this.userChargingList.totalCount < index) {
          this.$refs.scrollerBottom.enablePullup();
        }

        this.$refs.scrollerBottom.donePulldown();
      });
    },
    loadMore() {
      if (this.isEmpty) {
        this.isEmpty = false;
      } else {
        this.userChargingInfo.pageNum++;
      }
      this.getData(() => {
        let index =
          this.userChargingInfo.pageSize * this.userChargingInfo.pageNum;

        if (this.userChargingList.totalCount <= index) {
          this.$refs.scrollerBottom.disablePullup();
        }
        this.$refs.scrollerBottom.donePullup();
      });
    },
    formatTime(val) {
      return format(val, "YYYY-MM-DD HH:mm:ss");
    },
    timer() {
      if (this.userChargingList.data) {
        var timer = setInterval(() => {
          for (var i in this.userChargingList.data) {
            let speed =
              100 -
              timeDif(
                new Date(),
                new Date(this.userChargingList.data[i].chargingdate),
                this.userChargingList.data[i].chargingduration
              ).speeds;
            let temp = this.userChargingList.data[i];
            temp.speed = speed;
            this.$set(this.userChargingList.data, i, temp);
          }
        }, 1000);
        this.timers.push(timer);
      }
    }
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.Charging {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow: hidden;
  .datano {
    text-align: center;
    font-size: 32 / @width75;
    margin: 0 32 / @width75;
    padding-bottom: 32 / @width75;
  }
  .charge-list {
    padding: 20 / @width75 18 / @width75;
    .charge-item {
      background: white;
      .charge-title {
        font-size: 32 / @width75;
        line-height: 104 / @width75;
        padding: 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      .left {
        padding-top: 16 / @width75;
        p {
          line-height: 42 / @width75;
          height: 42 / @width75;
          color: #666;
          font-size: 28 / @width75;
          padding-left: 20 / @width75;
          color: #000000;
          margin-bottom: 18 / @width75;
          span {
            color: #666666;
            margin-left: 5 / @width75;
          }
        }
      }
      .right {
        margin-top: 66 / @width75;
        margin-right: 52 / @width75;
        .number {
          width: 88 / @width75;
          height: 88 / @width75;
          line-height: 88 / @width75;
          text-align: center;
          background: #35bab6;
          border-radius: 44 / @width75;
          font-size: 32 / @width75;
          color: #ffffff;
          margin-bottom: 12 / @width75;
        }
        .name {
          height: 34 / @width75;
          line-height: 34 / @width75;
          font-size: 24 / @width75;
          color: #000000;
        }
      }
    }
  }
}
</style>

<style lang="less">
@width75: 75rem;
.charge-title {
  .vux-cell-primary {
    p {
      padding-left: 20 / @width75;
      font-weight: bolder;
      background: url(../../assets/icon/Section/more_03.jpg) no-repeat 646 /
        @width75 center;
      background-size: 16 / @width75 24 / @width75;
    }
  }
  .weui-cell__ft {
    display: none;
  }
}
</style>
