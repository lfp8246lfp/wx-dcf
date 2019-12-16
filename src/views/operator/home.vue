<template>
  <div class="home-warp">
    <div class="home-header">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide bgimg">
            <div class="account">
              <h4>总收入(元)</h4>
              <p>{{homeData.baseDataItems[2].totalMoney}}</p>
              <div class="monthin">
                <div class="yesin">
                  <h5>昨日收入</h5>
                  <p>{{homeData.baseDataItems[1].totalMoney}}</p>
                </div>
                <div class="line"></div>
                <div class="todayin">
                  <h5>今日收入</h5>
                  <p>{{homeData.baseDataItems[0].totalMoney}}</p>
                </div>
                <div class="line"></div>
                <div class="onLine">
                  <h5>在线设备</h5>
                  <p>{{homeData.onlineNum}}</p>
                </div>
                <div class="line"></div>
                <div class="outLine">
                  <h5>离线设备</h5>
                  <p>{{homeData.offlineNum}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="home-content">
      <!-- <div class="contet-list">
        <div class="list-title">
          今日数据
          <span>实时更新</span>
          <span> 当天订单还未结束，收益实时变动中</span>

        </div>
        <div class="list-detail">
          <flexbox>
            <flexbox-item >
              <div class="flex-demo text-center">
                <span>{{homeData.baseDataItems[0].totalMoney}}</span>
                <p>设备收入(元)</p>
              </div>
            </flexbox-item>

          </flexbox>
        </div>

      </div>

      <div class="contet-list">
        <div class="list-title">
          昨日数据

        </div>
        <div class="list-detail">
          <flexbox>
            <flexbox-item >
              <div class="flex-demo text-center">
                <span>
                  {{homeData.baseDataItems[1].totalMoney}}
                  </span>
                <p>设备收入(元)</p>
              </div>
            </flexbox-item>

          </flexbox>
        </div>

      </div>

      <div class="flexbox">
        <div class="list-title ">
          在线数量：
          <span>{{homeData.onlineNum}}</span>

        </div>
        <div class="list-title">
          离线数量：
          <span>{{homeData.offlineNum}}</span>

        </div>
      </div >-->
      <div class="contet-list">
        <div class="position">
          <div class="list-title today" @click="today" v-bind:class="{addclass:isAddClass}">今日异常
            <!-- <span>次数:{{eventData.count}}</span> -->
          </div>
          <div class="list-title yestoday" @click="yestoday" v-bind:class="{active:isActive}">昨天异常
            <!-- <span>次数:{{eventData2.count}}</span> -->
          </div>
        </div>
        <hr>
        <div style="padding:0 10px" v-show="todayData">
          <div class="list-detail scroller clearfix" ref="scrollerBox1">
            <div
                  class  = "flex-demo vux-1px-b"
                  v-for  = "(item,index ) of eventData.eventPointCalItems"
                :key     = "index"
                  @click = "jump(0,item.eventDetailItem.eventitemid)"
            >
              <div class="fl data-list">{{item.eventDetailItem.discname}}</div>
              <div class="fr data-account">
                {{item.count}}次
                <span>
                  <img src="../../assets/icon/arrowRight@2x.png">
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="contet-list">
        <div style="padding:0 10px" v-show="yestodayData">
          <div class="list-detail scroller clearfix" ref="scrollerBox2">
            <div
                  class  = "flex-demo scroller1Item vux-1px-b"
                  v-for  = "(item,index ) of eventData2.eventPointCalItems"
                :key     = "index"
                  @click = "jump(1,item.eventDetailItem.eventitemid)"
            >
              <div class="fl data-list">{{item.eventDetailItem.discname}}</div>
              <!-- <div class="fl"><img src="./../../assets/icon/warn.png">{{item.eventDetailItem.discname}}</div> -->
              <!-- <x-icon type="ios-arrow-right" size="25" class="fr icon-right"></x-icon> -->
              <div class="fr data-account">
                {{item.count}}次
                <span>
                  <img src="../../assets/icon/arrowRight@2x.png">
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { format } from "date-fns";
import { Grid, GridItem, Flexbox, FlexboxItem, Scroller } from "vux";

var operatorData = JSON.parse(localStorage.getItem("operatorUserItem"));
export default {
  components: {
    Grid,
    GridItem,
    Flexbox,
    FlexboxItem,
    Scroller
  },
  computed: {
    totalRrofit() {
      let arr = [];
      for (let item of this.homeData.baseDataItems) {
        if (item.totalMoney == null) {
          item.totalMoney = 0;
        }
        if (item.realMoney == null) {
          item.realMoney = 0;
        }
        arr.push(item.totalMoney - item.realMoney);
      }
      return arr;
    }
  },
  data() {
    return {
      todayData   : true,
      yestodayData: false,
      isAddClass  : true,
      isActive    : false,
      homeData    : {
        baseDataItems: [{}, {}, { totalMoney: 0 }],
        offlineNum   : 0,
        onlineNum    : 0
      },
      eventData: {
        eventPointCalItems: [],
        count             : 0
      },
      eventData2: {
        eventPointCalItems: [],
        count             : 0
      },
      widthData : "0px",
      widthData2: "0px",
      alarmInfo : {
        starttime  : "",
        endtime    : "",
        eventitemid: 0
      }
    };
  },
  mounted() {
    this.$store
      .dispatch("AC_GetHomeNewData", {
        accountid: operatorData.accountid
      })
      .then(res => {
        this.homeData = res.data;
        if (!this.homeData.baseDataItems[0].totalMoney) {
          this.homeData.baseDataItems[0].totalMoney = 0;
        }
        if (!this.homeData.baseDataItems[1].totalMoney) {
          this.homeData.baseDataItems[1].totalMoney = 0;
        }
      });
    this.$store
      .dispatch("AC_GetHomeEvent", {
        accountid: operatorData.accountid,
        fromDate : this.formatTime(new Date()) + " " + "00:00:00",
        toDate   : this.formatTime(new Date()) + " " + "23:59:59"
      })
      .then(res => {
        this.eventData       = res.data;
        this.eventData.count = 0;
        for (let item of this.eventData.eventPointCalItems) {
          this.eventData.count += item.count;
        }
      });
    this.$store
      .dispatch("AC_GetHomeEvent", {
        accountid: operatorData.accountid,
        fromDate : 
          this.formatTime(new Date().getTime() - 24 * 60 * 60 * 1000) +
          " " +
          "00:00:00",
        toDate: 
          this.formatTime(new Date().getTime() - 24 * 60 * 60 * 1000) +
          " " +
          "23:59:59"
      })
      .then(res => {
        this.eventData2       = res.data;
        this.eventData2.count = 0;
        for (let item of this.eventData2.eventPointCalItems) {
          this.eventData2.count += item.count;
        }
      });
  },
  methods: {
    jump(day, id) {
      if (day == 0) {
        this.alarmInfo = {
          starttime  : this.formatTime(new Date()),
          endtime    : this.formatTime(new Date()),
          eventitemid: id
        };
      } else {
        this.alarmInfo = {
          starttime: this.formatTime(
            new Date().getTime() - 24 * 60 * 60 * 1000
          ),

          endtime: this.formatTime(new Date().getTime() - 24 * 60 * 60 * 1000),

          eventitemid: id
        };
      }
      this.$store.commit("UPDATE_AlarmInfo", this.alarmInfo);

      this.$router.push("/alarm");
    },
    formatTime(val) {
      return format(val, "YYYY-MM-DD");
    },
    today: function() {
      this.isAddClass   = true;
      this.isActive     = false;
      this.todayData    = true;
      this.yestodayData = false;
    },
    yestoday: function() {
      this.isAddClass   = false;
      this.isActive     = true;
      this.yestodayData = true;
      this.todayData    = false;
    }
  }
};
</script>
<style scoped lang="less">
@width75: 75rem;
.home-warp {
  background    : white;
  padding-bottom: 100px;

  .home-header {
    color     : white;
    height    : 364 / @width75;
    background: #fafafa;
    .title {
      text-align : center;
      font-size  : 32px;
      line-height: 80px;
      .icon {
        fill          : white;
        height        : 80px;
        line-height   : 80px;
        vertical-align: top;
      }
    }
    .left-box {
      padding: 20px;
      span {
        font-size: 40px;
      }
    }
    .right-box {
      width  : 260px;
      padding: 20px;
      .detail-box {
        border       : 2px solid white;
        height       : 70px;
        line-height  : 70px;
        border-radius: 10px;
        text-align   : center;
        margin-right : 10px;
      }
    }
    .vux-slider > .vux-swiper {
      width: 648 / @width75;
    }
    .bgimg {
      height    : 344 / @width75;
      text-align: center;
      //   border-radius: 10px;
      background     : url("../../assets/4@2x.png") center center;
      background-size: 100%;
      .account {
        h4 {
          //   margin-top: 20 / @width75;
          margin-bottom: 40 / @width75;
          color        : #aee2d8;
          font-size    : 26 / @width75;
          padding      : 48 / @width75 0 7 / @width75;
        }
        p {
          font-size: 72 / @width75;
          padding  : 13 / @width75 12 / @width75;
          color    : #fff;
        }
        a {
          color: #fff;
        }
        .monthin {
          display   : flex;
          margin-top: 24 / @width75;
          p {
            font-size : 32 / @width75;
            margin-top: 14 / @width75;
            padding   : 0;
          }
          .line {
            width     : 2px;
            height    : 52 / @width75;
            background: #7ad2dc;
            margin-top: 8 / @width75;
          }
          .todayin {
            width : 214 / @width75;
            height: 52 / @width75;
          }
          .yesin {
            width: 214 / @width75;
          }
          .outLine {
            width : 214 / @width75;
            height: 52 / @width75;
            a {
              color: #ffffff;
            }
          }
          .onLine {
            width: 214 / @width75;
            a {
              color: #ffffff;
            }
          }
          h5 {
            color: #aee2d8;
          }
        }
      }
    }
  }
  .home-content {
    margin: 0 39 / @width75;
    .position {
      display : flex;
      overflow: hidden;
      .addclass {
        color: #35bab6;
      }
      .active {
        color: #35bab6;
      }
      .list-title {
        margin-bottom: 20 / @width75;
        hr {
          background: red;
          height    : 4 / @width75;
        }
      }
      hr {
        width     : 2 / @width75;
        background: #fafafa;
      }
    }
    .contet-list {
      //   border-bottom: 2px solid #ccc;

      .list-title {
        width         : 336 / @width75;
        font-size     : 32px;
        padding       : 20px;
        padding-bottom: 5px;
        text-align    : center;
        // span          : nth-of-type(1) {
        //   font-size    : 24px;
        //   color        : red;
        //   display      : inline-block;
        //   border       : 1px solid red;
        //   border-radius: 10px;
        //   font-size    : 28px;
        //   margin-left  : 10px;
        //   padding      : 0 10px;
        // }
        span:nth-of-type(2) {
          font-size: 24px;
        }
      }
      .list-detail {
        padding    : 20px;
        padding-top: 5px;
        span {
          font-size: 32px;
          margin   : 0 0 0 10 / @width75;
        }
        p {
          color: #999;
        }
      }
      .scroller {
        position     : relative;
        overflow     : hidden;
        padding-left : 0;
        padding-right: 0;
        .flex-demo {
          display    : inline-block;
          width      : 100%;
          height     : 90 / @width75;
          line-height: 90 / @width75;
          .data-list {
            font-size: 28 / @width75;
            color    : rgb(153, 153, 153);
          }
          .data-account {
            font-size: 28 / @width75;
            color    : black;
            img {
              width : 14 / @width75;
              height: 26 / @width75;
            }
          }
          div:first-child {
            img {
              width         : 50px;
              height        : 50px;
              margin-right  : 10px;
              vertical-align: top;
            }
          }
          .icon-right {
            fill: green;
          }
        }
      }
    }
    .flexbox {
      display      : flex;
      border-bottom: 2px solid #ccc;
      .list-title {
        flex: 1;

        font-size     : 32px;
        padding       : 20px;
        padding-bottom: 5px;
        span {
          color: #999;
        }
      }
    }
  }
}
</style>
<style lang='less' >
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
  color: #35bab6 !important;
}
.weui-tabbar {
  position: fixed;
  bottom  : 0;
}
</style>
