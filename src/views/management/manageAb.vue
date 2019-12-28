<!-- 异常告警 -->

<template>
<div>
    <div class = "aaa" style="position:fixed;top:0;z-index:9999; width: 100%;height: 40px;">
        <tab v-model="index01" prevent-default @on-before-index-change="switchTabItem" > 
          <tab-item >电表</tab-item>
          <tab-item>充电桩</tab-item>    
        </tab>
    </div>
    
  <scroller
      lock-x
      ref="scrollerBottom"
      :use-pullup="true"
      :pullup-config="pullupDefaultConfig"
      @on-pullup-loading="loadMore"
      style="margin-top:40px"
    >
    
    <!-- 电表   ================================================================= -->
      <div class="abnormal" v-if="switchPrice">
        <div class="search">
          <h1>{{$t("ab.type")}}</h1>
          <checker
            v-model="abtype"
            default-item-class="abtype-item"
            selected-item-class="abtype-item-selected"
          >
            <checker-item value="1">{{$t("ab.overvoltage")}}</checker-item>
            <checker-item value="12">{{$t("ab.undervoltage")}}</checker-item>
            <checker-item value="2" class="mar">{{$t("ab.overcurrent")}}</checker-item>
            <checker-item value="3">{{$t("ab.superpower")}}</checker-item>
            <checker-item value="35">{{$t("barIndex.surplus")}}</checker-item>
          </checker>
          <h1 class="bigtime">{{$t("ab.starttime")}}</h1>
          <div class="timeframe">
            <div class="flexla">
              <datetime v-model="beginTime" @on-confirm="changeBeginTime" :start-date="startDate"></datetime>
              <p>{{$t("ab.start")}}</p>
            </div>
            <img src="../../assets/icon/Section/turn.png" alt>
            <div class="flexla">
              <datetime
                v-model="endTime"
                @on-confirm="changeEndTime"
                :end-date="endDate"
                format="YYYY-MM-DD"
              ></datetime>
              <p>{{$t("ab.end")}}</p>
            </div>
          </div>
          <x-button @click.native="search" class="search-btn">{{$t("ab.find")}}</x-button>
        </div>
        <p class="datano" v-show="datano">
            <img src="../../assets/noData.png" alt="">
            <br>
            暂无数据
        </p>
        <div v-transfer-dom>
          <confirm v-model="showInfo" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
            <p class="text-center">{{$t("ab.greater")}}</p>
          </confirm>
        </div>

        <div class="address">
          <ul>
            <li v-for="(item,index) in alarmlist.data" :key="index">
              <div class="add-top">
                <h1>{{item.disc}}</h1>
                <div class="add-tip-right">
                  <p v-if="item.dealstatus==0">
                    <router-link :to="{path:'/manageAbchange',query:{eventObj:item}}">{{$t("ab.untreated")}}</router-link>
                  </p>
                  <p class="down" v-else-if="item.dealstatus==1">
                    <router-link :to="{path:'/manageAbchange',query:{eventObj:item}}">{{$t("ab.processed")}}</router-link>
                  </p>
                  <p v-else>
                    <router-link :to="{path:'/manageAbchange',query:{eventObj:item}}">{{$t("ab.unsolved")}}</router-link>
                  </p>
                  <img src="../../assets/icon/Section/arrow-right.png" alt>
                </div>
              </div>
              <div class="add-btn">
                <div class="add-btn-left">
                  <p class="alarmtime">{{$t("ab.alarmtime")}}: {{formatTime(item.eventtime)}}</p>
                  <p class="alarmtype">{{$t("ab.type")}}: {{changeAbtype(item.eventitemid)}}</p>
                </div>
                <div class="add-btn-right">
                  <p>{{item.commaddress}}</p>
                  <p>{{$t("ab.meternumber")}}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    
      <!-- 充电桩   ================================================================= -->
      <div class="abnormal" v-if="!switchPrice">
        <div class="search" v-if="!switchPrice">
          <h1>告警类型</h1>
          <checker
            v-model             = "abtype"
            default-item-class  = "abtype-item"
            selected-item-class = "abtype-item-selected"
          >
            <checker-item value="1">过压</checker-item>
            <checker-item value="12">欠压</checker-item>
            <checker-item value="2" class="mar">电流过大</checker-item>
            <checker-item value="3">超功率</checker-item>
            <checker-item value="4" class="mar">温度</checker-item>
          </checker>
          <h1 class="bigtime">起始时间</h1>
          <div class="timeframe">
            <div class="flexla">
              <datetime v-model="beginTime" @on-confirm="changeBeginTime" :start-date="startDate"></datetime>
              <p>开始时间</p>
            </div>
            <img src="../../assets/icon/Section/turn.png" alt>
            <div class="flexla">
              <datetime v-model="endTime" @on-confirm="changeEndTime" :end-date="endDate"></datetime>
              <p>结束时间</p>
            </div>
          </div>
          <x-button @click.native="search" class="search-btn">查找</x-button>
          <div v-transfer-dom>
          <confirm v-model="showInfo" title="提示" @on-confirm="onConfirm">
          <p class="text-center">结束日期要大于开始日期</p>
        </confirm>
      </div>
        </div>
        <div class="address">
          <ul>
            <li v-for="(item,index) in alarmlist.data" :key="index">
              <div class="add-top">
                <h1>{{item.commaddress}}</h1>
                <div class="add-tip-right">
                  <p v-if="item.dealstatus==0">
                    <router-link :to="{path:'/alarmChange',query:{eventObj:item}}">未处理</router-link>
                  </p>
                  <p class="down" v-else-if="item.dealstatus==1">
                    <router-link :to="{path:'/alarmChange',query:{eventObj:item}}">已处理</router-link>
                  </p>
                  <p v-else>
                    <router-link :to="{path:'/alarmChange',query:{eventObj:item}}">未解决</router-link>
                  </p>
                  <img src="../../assets/icon/Section/arrow-right.png" alt>
                </div>
              </div>
              <div class="add-btn">
                <div class="add-btn-left">
                  <p class="alarmtime">告警时间: {{formatTime(item.eventtime)}}</p>
                  <p class="alarmtype">告警类型: {{changeAbtype(item.eventitemid)}}</p>
                </div>
                <div class="add-btn-right">
                  <h1>{{item.tagno}}</h1>
                  <p>插座号</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroller>
</div>

  
</template>

<script>
import {
  Checker,
  CheckerItem,
  Datetime,
  XButton,
  Scroller,
  Confirm,
  TransferDom,
  Tab,
  TabItem,
  Sticky,
  Swiper, 
  SwiperItem,
  Divider
  
} from "vux";
import { format } from "date-fns";
import api from "../../api/Piles.js";
var id = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
const pullupDefaultConfig = {
  content       : "上拉加载更多",
  pullUpHeight  : 60,
  height        : 40,
  autoRefresh   : true,
  downContent   : "释放后加载",
  upContent     : "上拉加载更多",
  loadingContent: "加载中...",
  clsPrefix     : "xs-plugin-pullup-"
};
export default {
  components: {
    Checker,
    CheckerItem,
    Datetime,
    XButton,
    Scroller,
    Confirm,
    TransferDom,
    Tab,
    TabItem,
    Sticky,
    Swiper, 
    SwiperItem,
    Divider
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      index01: 0,
      switchPrice:true,
      startime1: "", //开始时间
      startime2: "", //结束时间
      startDate: "", //开始时间
      endDate: "", //结束时间
      showInfo: false, //时间提示框
      datano: false, //暂无数据提示
      abtype: 0, //异常类型
      beginTime: this.formatTime(new Date().setHours(-24 * 10)), //开始时间
      endTime: this.formatTime(new Date()), //结束时间
      alarmlist: { //告警数据
        total: 0,
        data: []
      }, //数据
      alarmCharging:{
        total: 0,
        data: []
      },
      pullupDefaultConfig: pullupDefaultConfig,
      alarmpara: {
        //传递的参数
        accountid: id,
        objid: 4,
        objtype: 98,
        treetype: 4,
        eventitemid: 0,
        dealstatus: -1,
        starttime: "",
        endtime: "",
        pageNum: 1,
        pageSize: 4
      },
      isEmpty: true
    };
  },

  computed: {},

  mounted() {
    this.alarmpara = {
      accountid: id,
      objid: 4,
      objtype: 98,
      treetype: 4,
      eventitemid: 0,
      dealstatus: -1,
      starttime: this.beginTime,
      endtime: this.endTime,
      pageNum: 1,
      pageSize: 4,
    };
    this.startDate = this.formatTime(new Date().setHours(-24 * 183));
    this.endDate = this.formatTime(new Date().setHours(24 * 1));
    this.$nextTick(() => {
      this.$refs.scrollerBottom.reset({ top: 0 });
    });
    this.loadMore();
  },

  methods: {
    switchTabItem (index) {
        this.$vux.loading.show({
          text: 'loading'
        })
        setTimeout(() => {
          this.$vux.loading.hide()
        }, 500)
        if(index==0){
          this.switchPrice = true;
        }else{
          this.switchPrice = false;
        }
        this.index01 = index;
        this.alarmlist.data = [];
        this.isEmpty = true;
        this.alarmpara.pageNum = 1;
        // this.loadMore()
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset({ top: 0 });
        });
        this.loadMore();

    },
    // 开始时间
    changeBeginTime(value) {
      this.alarmpara.starttime = value + " 00:00:00";
      this.startime1 = value;
    },
    // 结束时间
    changeEndTime(value) {
      this.alarmpara.endtime = value + " 23:59:59";
      this.startime2 = value;
    },
    // 日期格式化
    formatTime(val) {
      return format(val, "YYYY-MM-DD");
    },
    // 查找按钮
    search() {
      var t1 = this.startime1 || this.beginTime.slice(0, 10);
      var t2 = this.startime2 || this.endTime.slice(0, 10);
      var startTmp = t1.split("-");
      var endTmp = t2.split("-");
      var sd = new Date(startTmp[0], startTmp[1], startTmp[2]);
      var ed = new Date(endTmp[0], endTmp[1], endTmp[2]);
      if (sd.getTime() > ed.getTime()) {
        this.showInfo = true;
        return false;
      } else {
        if (this.abtype != "") {
          this.alarmpara.eventitemid = parseInt(this.abtype);
        } else {
          this.alarmpara.eventitemid = 0;
        }

        this.isEmpty = true;
        this.alarmpara.pageNum = 1;
        this.loadMore();
      }
    },
    onConfirm() {},
    // 获取异常告警数据
    getAlarm(fn) {
      this.alarmpara.starttime = this.beginTime + " 00:00:00";
      this.alarmpara.endtime = this.endTime + " 23:59:59";
      if(this.index01==0){
         api.GetAlarm(this.alarmpara).then(res => {
            this.$nextTick(() => {
              this.$refs.scrollerBottom.reset();
            });
            this.alarmlist.total = res.data.total;
            if (this.alarmpara.pageNum > 1) {
              this.alarmlist.data = this.alarmlist.data.concat(res.data.listitem);
            } else {
              this.alarmlist.data = res.data.listitem;
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
      }else{
         api.GetEventList(this.alarmpara).then(res => {
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset();
          });
          this.alarmlist.total = res.data.total;
          if (this.alarmpara.pageNum > 1) {
            this.alarmlist.data = this.alarmlist.data.concat(res.data.listitem);
          } else {
            this.alarmlist.data = res.data.listitem;
          }
         });
      }
     fn();
     
    },
    // 加载更多数据
    loadMore() {
      if (this.isEmpty) {
          this.isEmpty = false;
        } else {
          this.alarmpara.pageNum++;
        }
        this.getAlarm(() => {
          this.pullupDefaultConfig = pullupDefaultConfig;
          let index = this.alarmpara.pageSize * this.alarmpara.pageNum;
          if (this.alarmlist.total <= index) {
            this.$refs.scrollerBottom.disablePullup();
          } else {
            this.$refs.scrollerBottom.enablePullup();
          }
          this.$refs.scrollerBottom.donePullup();
       });
    },
    activated() {
      this.$refs.scrollerBottom.reset();
    },
    // 告警类型改变
    changeAbtype(item) {
      if (item == "1") {
        return this.$t("ab.overvoltage");
      } else if (item == "2") {
        return this.$t("ab.overcurrent");
      } else if (item == "3") {
        return this.$t("ab.superpower");
      } else if (item == "4") {
        return "温度";
      } else if (item == "12") {
        return this.$t("ab.undervoltage");
      } else if (item == "35") {
        return this.$t("barIndex.surplus");
      }
    }
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.abnormal{
  padding-bottom: 100/@width75;
}
.search{
  padding   : 30/@width75 38/@width75;
  background: #fff;
  h1{
    font-weight  : bold;
    font-size    : 36 /@width75;
    margin-bottom: 32/@width75;
    padding      : 10/@width75 0;
  }
  .bigtime{margin-top: 38/@width75;padding: 10/@width75 0;}
  .vux-checker-box{
    display  : flex;
    flex-wrap: wrap;
  }
  .abtype-item{
    width        : 210/@width75;
    height       : 60/@width75;
    line-height  : 60/@width75;
    text-align   : center;
    background   : #f6f6f6;
    margin       : 0 22/@width75  22/@width75 0;
    border-radius: 10px;
    font-size    : 30/@width75;
  }
  .mar{
    margin-right: 0;
  }
  .abtype-item-selected{
    background: #35bab7;
    color     : white;
  }
  .timeframe{
    width          : 100%;
    display        : flex;
    justify-content: space-between;
    text-align     : center;
    .vux-datetime{
      font-size    : 38/@width75;
      border-bottom: 1px solid #f3f3f3;
    }
    .weui-cell{padding:0 0 6/@width75 0;}
    p{margin-top: 16/@width75}
    img{
      width     : 42/@width75;
      height    : 42/@width75;
      margin-top: 10/@width75;
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
      margin: 50 / @width75 0 70 / @width75;
    }
  }
.address{
  padding: 20/@width75 38/@width75;
  li{
    background   : #fff;
    font-size    : 32/@width75;
    font-weight  : bold;
    margin-bottom: 20/@width75;
    .add-top{
      display        : flex;
      justify-content: space-between;
      padding        : 20/@width75 16/@width75;
      border-bottom  : 1px solid #f6f6f6;
      h1{
        font-size  : 32/@width75;
        font-weight: bold;
        padding    : 10 /@width75 0 7/@width75;
      }
      .add-tip-right{
        display: flex;
        p{
          color     : #fca256;
          font-size : 24/@width75;
          margin-top: 12/@width75;
        }
        a{
          color: #fca256;
        }
        .down{
          a{color:#35bab7;}
        }
        img{
          width : 14/@width75;
          height: 26/@width75;
          margin: 10/@width75 0 0 20/@width75;
        }
      }
    }
    .add-btn{
      padding        : 20/@width75 38/@width75 0 24/@width75 ;
      display        : flex;
      justify-content: space-between;
      .add-btn-left{
        p{
          margin-bottom: 20/@width75;
          font-size    : 28/@width75;
          font-weight  : normal;
        }
        .alarmtime{
          height      : 44/@width75;
          line-height : 44/@width75;
          padding-left: 57/@width75;
          background  : url("../../assets/icon/Section/time.png") left center no-repeat;
        }
        .alarmtype{
          height      : 44/@width75;
          line-height : 44/@width75;
          padding-left: 57/@width75;
          background  : url("../../assets/icon/Section/alarm2.png") left center no-repeat;
        }
      }
      .add-btn-right{
        text-align: center;
        h1{
          color    : #35bab7;
          font-size: 60/@width75;
        }
        p{
          margin-top : 14/@width75;
          font-weight: normal;
        }
      }
    }
  }
}
.weui-btn{
  background   : #35bab7;
  color        : white;
  border-radius: 44/@width75;
  height       : 88/@width75;
  line-height  : 88/@width75;
  margin-top   : 60/@width75;
  font-size    : 36/@width75 !important;
}
</style>
<style lang="less">
@width75: 75rem;
.timeframe {
  .vux-cell-value {
    color: #000;
  }
  .weui-cell_access .weui-cell__ft:after {
    display: none;
  }
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
// .xs-plugin-pullup-container{
//   margin-bottom: 100/@width75;
// }
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

</style>
