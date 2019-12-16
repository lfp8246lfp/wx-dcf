<!-- 管理端首页 -->
<template>
  <div class="management">
    <div class="scroller-wrap">
        <div>
          <!-- <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide bgimg">
                <div class="account">
                  <h4>{{$t("barIndex.incomemonth")}}</h4>
                  <p>
                    <router-link
                      :to="{path:'/manageRecord',query:{timerange:time,num:0}}"
                    >{{this.monthMoney}}</router-link>
                  </p>
                  <div class="monthin">
                    <div class="yesin">
                      <h5>{{$t("barIndex.yesterday")}}</h5>
                      <p>
                        <router-link
                          :to="{path:'/manageRecord',query:{timerange:time,num:1}}"
                        >{{this.yestodayMoney}}</router-link>
                      </p>
                    </div>
                    <div class="line"></div>
                    <div class="todayin">
                      <h5>{{$t("barIndex.today")}}</h5>
                      <p>
                        <router-link
                          :to="{path:'/manageRecord',query:{timerange:time,num:2}}"
                        >{{this.todayMoney}}</router-link>
                      </p>
                    </div>
                    <div class="line"></div>
                    <div class="list">
                      <h5>{{$t("barIndex.usernum")}}</h5>
                      <p>
                        <router-link to="/manageAccount">{{totalMoney.totalUsers}}</router-link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="swiper-slide bgimg">
                <div class="account">
                  <h4>{{$t("barIndex.accumulated")}}</h4>
                  <p>{{this.total}}</p>
                </div>
              </div>
            </div>
          </div> -->
          <scroller lock-y >
            <div class="box1">
              <div class="bgimg">
                <div class="account">
                  <h4>{{$t("barIndex.incomemonth")}}</h4>
                  <p>
                    <router-link
                      :to="{path:'/manageRecord',query:{timerange:time,num:0}}"
                    >{{this.monthMoney}}</router-link>
                  </p>
                  <div class="monthin">
                    <div class="yesin">
                      <h5>{{$t("barIndex.yesterday")}}</h5>
                      <p>
                        <router-link
                          :to="{path:'/manageRecord',query:{timerange:time,num:1}}"
                        >{{this.yestodayMoney}}</router-link>
                      </p>
                    </div>
                    <div class="line"></div>
                    <div class="todayin">
                      <h5>{{$t("barIndex.today")}}</h5>
                      <p>
                        <router-link
                          :to="{path:'/manageRecord',query:{timerange:time,num:2}}"
                        >{{this.todayMoney}}</router-link>
                      </p>
                    </div>
                    <div class="line"></div>
                    <div class="list">
                      <h5>{{$t("barIndex.usernum")}}</h5>
                      <p>
                        <router-link to="/manageAccount">{{totalMoney.totalUsers}}</router-link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bgimg">
                <div class="account">
                  <h4>{{$t("barIndex.accumulated")}}</h4>
                  <p>{{this.total}}</p>
                </div>
              </div>
            </div>   
          </scroller>
          <div class="devicenum">
            <div class="online">
              <h2>{{$t("barIndex.online")}}</h2>
              <p>
                <router-link to="/manageLine/1">{{totalMoney.onlineCount}}</router-link>
              </p>
            </div>
            <div class="line"></div>
            <div class="outline">
              <h2>{{$t("barIndex.unline")}}</h2>
              <p>
                <router-link to="/manageLine/0">{{totalMoney.offlineCount}}</router-link>
              </p>
            </div>
          </div>
          <scroller
            height="-316px"
            lock-x
            ref="scroll"
            :use-pullup="true"
            :pullup-config="pullupDefaultConfig"
            @on-pullup-loading="loadMore"
          >
            <div>
              <div class="warn" v-if="devUserslist.total!=0">
                <img src="../../assets/icon/Section/ab.png" alt>
                <p>{{$t("barIndex.userlist")}}</p>
              </div>
              <ul>
                <li v-for="(item,index) in devUserslist.data" :key="index">
                  <div>
                    <h1>{{item.chatname}}</h1>
                    <div class="usermess">
                      <div>
                        <h2>{{$t("barIndex.room")}}</h2>
                        <p>{{item.metername}}</p>
                      </div>
                      <div>
                        <h2>{{$t("barIndex.phone")}}</h2>
                        <p>{{item.phone}}</p>
                      </div>
                      <div class="position">
                        <h2>{{$t("barIndex.surplus")}}</h2>
                        <p>{{item.balancevlaue.toFixed(1)}} kWh</p>
                      </div>
                    </div>
                  </div>
                  <div class="recharge">
                    <router-link :to="{path:'/manageRecharge',query:{chargeitem:JSON.stringify(item)}}">{{$t("personal.button")}}</router-link>
                  </div>
                </li>
              </ul>
              <div class="positionline"></div>
            </div>
            </scroller>
        </div>
      
    </div>
  </div>
</template>

<script>
import { Cell, Tab, TabItem, Group, Scroller } from "vux";
import Swiper from "swiper";
import "../../assets/styles/swiper.min.css";
import api from "../../api/Piles.js";
import { format } from "date-fns";
var id = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
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
  components: {
    Cell,
    Tab,
    TabItem,
    Group,
    Scroller
  },
  data() {
    return {
      monthMoney: "", //本月收入
      yestodayMoney: "", //昨日收入
      todayMoney: "", //今日收入
      total: "", //累积收入
      pullupDefaultConfig: pullupDefaultConfig,
      totalMoney: "", //收入详情
      time: this.formatTime(new Date()), //今日，昨日，本月
      devUserslist: {
        total: 0,
        data: []
      }, //告警用户列表
      isEmpty: true,
      devalrmreq: {
        //告警用户参数
        accountid: id,
        pageSize: 5,
        pageNum: 1
      }
    };
  },

  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.$refs.scroll.reset({ top: 0 });
    });
    this.loadMore();
    this.getincome();
    this.initSwiper();
  },

  methods: {
    //   获取收入信息
    getincome() {
      api.GetCalNewProfit({ accountid: id }).then(res => {
        this.totalMoney = res.data;
        this.monthMoney = res.data.monthMoney.toFixed(1);
        this.yestodayMoney = res.data.yestodayMoney.toFixed(1);
        this.todayMoney = res.data.todayMoney.toFixed(1);
        this.total = res.data.totalMoney.toFixed(1);
      });
    },
    //   设置时间格式
    formatTime(val) {
      return format(val, "YYYY-MM-DD");
    },
    // 获取电量告警用户
    getAlarmrecord(fn) {
      api.GetAlarmEnergyRecord(this.devalrmreq).then(res => {
        this.$nextTick(() => {
          this.$refs.scroll.reset();
        });
        this.devUserslist.total = res.data.total;
        if (this.devalrmreq.pageNum > 1) {
          this.devUserslist.data = this.devUserslist.data.concat(
            res.data.listitem
          );
        } else {
          this.devUserslist.data = res.data.listitem;
        }
        fn();
      });
    },
    // 加载更多的数据
    loadMore() {
      if (this.isEmpty) {
        this.isEmpty = false;
      } else {
        this.devalrmreq.pageNum++;
      }
      this.getAlarmrecord(() => {
        let index = this.devalrmreq.pageSize * this.devalrmreq.pageNum;
        if (this.devUserslist.total <= index) {
          this.$refs.scroll.disablePullup();
        } else {
          //   this.$refs.scroller.enablePullup();
        }
        this.$refs.scroll.donePullup();
      });
    },
    // 轮播
    initSwiper() {
      var mySwiper = null;
      mySwiper = new Swiper(".swiper-container", {
        slidesPerView: "auto",
        spaceBetween: 10,
        centeredSlides: true,
        observer: true,
        observeParents: true
      });
    }
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.management {
  background: #fafafa;
  padding-bottom: 125 / @width75;

  .swiper-container {
    padding: 20 / @width75 0 20 / @width75 0;
  }
  .vux-slider > .vux-swiper {
    width: 648 / @width75;
  }
  .devicenum {
    border-top: 1px solid #f4f4f4;
    border-bottom: 1px solid #f4f4f4;
    background: #fff;
    display: flex;
    justify-content: space-between;
    padding: 20 / @width75 67 / @width75;
    text-align: center;
    .online {
      a {
        color: #35bab7;
      }
    }
    .outline {
      a {
        color: red;
      }
    }
    h2 {
      width: 240 / @width75;
      font-size: 28 / @width75;
      padding: 7 / @width75 0 8 / @width75;
      color: #999;
    }
    p {
      width: 240 / @width75;
      font-size: 48px;
      margin-top: 24 / @width75;
    }
    .line {
      height: 100 / @width75;
      width: 2px;
      background: #f5f5f5;
      margin-top: 4px;
    }
  }
  .box1{
    width: 1380px;
    padding: 20/@width75 0;
    &:after{
      content: "";
      display: block;
      clear: both;
    }
  }
  .bgimg {
    width: 644 / @width75 !important;
    height: 306 / @width75;
    text-align: center;
    border-radius: 10px;
    background: url("../../assets/icon/Section/bgimg.png") center center;
    background-size: 100%;
    float: left;
    margin-left: 30/@width75;
    .account {
      h4 {
        margin-top: 20 / @width75;
        margin-bottom: 40 / @width75;
        color: #aee2d8;
        font-size: 26 / @width75;
        padding: 8 / @width75 0 7 / @width75;
      }
      p {
        font-size: 72 / @width75;
        padding: 13 / @width75 12 / @width75;
        color: #fff;
      }
      a {
        color: #fff;
      }
      .monthin {
        display: flex;
        margin-top: 24 / @width75;
        // justify-content: space-between;
        p {
          font-size: 32 / @width75;
          margin-top: 14 / @width75;
          padding: 0;
        }
        .line {
          width: 2px;
          height: 52 / @width75;
          background: #7ad2dc;
          margin-top: 8 / @width75;
        }
        .todayin {
          width: 214 / @width75;
          height: 52 / @width75;
        }
        .yesin {
          width: 214 / @width75;
        }
        .list {
          width: 214 / @width75;
          a {
            color: #fff;
          }
        }
        h5 {
          color: #aee2d8;
        }
      }
    }
  }
  .warn {
    background: #fff;
    height: 110 / @width75;
    border-top: 1px solid #f6f6f8;
    border-bottom: 1px solid #f6f6f8;
    display: flex;
    padding-left: 36 / @width75;
    img {
      width: 50 / @width75;
      height: 50 / @width75;
      margin: 30 / @width75 20 / @width75 0 0;
    }
    p {
      font-size: 34 / @width75;
      font-weight: bold;
      line-height: 110 / @width75;
    }
  }
  .positionline {
    height: 2 / @width75;
    border-top: 0.013333rem solid #f6f6f6;
  }
  ul {
    background: #fff;
    li {
      display: flex;
      align-items: center;
      padding: 14 / @width75 38 / @width75;
      border-bottom: 1px solid #f6f6f6;
      justify-content: space-between;
      h1 {
        font-size: 32 / @width75;
        font-weight: bold;
        padding: 9 / @width75 0 8 / @width75 0;
      }
      .usermess {
        display: flex;
        margin-top: 14 / @width75;
        div {
          width: 175 / @width75;
          margin-right: 27 / @width75;
          h2 {
            color: #a3a3a3;
            font-size: 20 / @width75;
          }
          p {
            font-weight: bold;
            margin-top: 10 / @width75;
          }
        }
        .position {
          margin-right: 0;
        }
      }
      .recharge {
        width: 132 / @width75;
        height: 58 / @width75;
        border: 2px solid #4ac1bf;
        text-align: center;
        line-height: 58 / @width75;
        border-radius: 29 / @width75;
        font-size: 28 / @width75;
      }
    }
  }
}
[v-cloak] {
  display: none;
}
.weui-tabbar {
  height: 125 / @width75;
  background: #f7f7fa !important;
}
.weui-tabbar__icon {
  width: 45px !important;
  height: 45px !important;
  margin-bottom: 8 / @width75;
  margin-top: 15 / @width75;
}
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
  color: #000000 !important;
}
.vux-tab-wrap .vux-tab-container .vux-tab .vux-tab-item {
  font-size: 28 / @width75;
  color: #666;
}
</style>
<style lang="less">
@width75: 75rem;
.vux-no-group-title {
  margin-top: 0;
}
.weui-cell {
  padding: 32 / @width75;
  color: #999;
  .weui-cell__ft {
    color: #000;
    margin-right: 24 / @width75;
  }
}
.weui-cell_access .weui-cell__ft:after {
  width: 14 / @width75;
  height: 14 / @width75;
  right: -20 / @width75;
  top: 42%;
}
.vux-tab-wrap .vux-tab-container .vux-tab {
  height: 80 / @width75;
}
.weui-toast__content {
  height: 150 / @width75;
  line-height: 150 / @width75;
  font-size: 40 / @width75;
}
</style>


