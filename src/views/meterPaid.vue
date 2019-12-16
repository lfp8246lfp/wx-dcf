<template>
<!-- <scroller lock-x ref="scrollerBottom" :use-pullup="true" :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore" >
  <div class="abnormal">
    <div class="search">
      <h1>告警类型</h1>
      <checker v-model="abtype" default-item-class="abtype-item" selected-item-class="abtype-item-selected" >
        <checker-item value="1">过压</checker-item>
        <checker-item value="12">欠压</checker-item>
        <checker-item value="2" class="mar">电流过大</checker-item>
        <checker-item value="3">超功率</checker-item>
        <checker-item value="35">剩余电量</checker-item>
        <checker-item value="4" class="mar">温度</checker-item>
      </checker>
      <h1 class="bigtime">起始时间</h1>
      <div class="timeframe">
          <div class="flexla">
            <datetime v-model="beginTime" @on-confirm="changeBeginTime"></datetime>
            <p>开始时间</p>
          </div>
          <img src="../../assets/icon/Section/turn.png" alt="">
          <div class="flexla">
            <datetime v-model="endTime" @on-confirm="changeEndTime"></datetime>
            <p>结束时间</p>
          </div>
      </div>
      <x-button @click.native="search" class="search-btn">查找</x-button>
    </div>
    <div class="address">
          <ul>
            <li v-for="(item,index) in alarmlist.data" :key="index">
              <div class="add-top">
                <h1>{{item.disc}}</h1>
                <div class="add-tip-right">
                  <p v-if="item.dealstatus==0"><router-link :to="{path:'/manageAbchange',query:{eventObj:item}}">未处理</router-link></p>
                  <p class="down" v-else-if="item.dealstatus==1"><router-link :to="{path:'/manageAbchange',query:{eventObj:item}}">已处理</router-link></p>
                  <p v-else><router-link :to="{path:'/manageAbchange',query:{eventObj:item}}">未解决</router-link></p>
                  <img src="../../assets/icon/Section/arrow-right.png" alt="">
                </div>
              </div>
              <div class="add-btn">
                <div class="add-btn-left">
                  <p class="alarmtime">告警时间: {{formatTime(item.eventtime)}}</p>
                  <p class="alarmtype">告警类型: {{changeAbtype(item.eventitemid)}}</p>
                </div>
                <div class="add-btn-right">
                  <h1 v-if="index<9">{{"0"+(index+1)}}</h1>
                  <h1 v-else>{{index+1}}</h1>
                  <p>插座号</p>
                </div>
              </div>
            </li>
          </ul>
    </div>
  </div>
</scroller> -->
  <div class="alarm">
    <group>
      <calendar v-model="beginTime" title="开始时间" placeholder="请选择"></calendar>
      <calendar v-model="endTime" title="结束时间" placeholder="请选择"></calendar>
      <selector title="异常类型" :options="list" v-model="value" placeholder="请选择"></selector>
      <selector title="解决状态" :options="list2" v-model="value2" placeholder="请选择"></selector>
    </group>
    <div style="padding:15px;">
      <x-button @click.native="search" :gradients="['#1D62F0', '#19D5FD']">查找</x-button>
    </div>

    <group title="告警列表" class="list">
      <scroller lock-x ref="scrollerBottom" use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore" use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh">
        <div class="charge-list">
          <div class="charge-item" v-for="(item,index) of  eventList.eventPointItems" :key='index'>
            <cell :title="item.devicename" :value="item.dealstatus|dealstatus" class="charge-title" :link="{path:'/alarmDetail'}" @click.native="jump(item)"></cell>
            <div class="clearfix ">
              <div class="left fl">
                <p>
                  <span class="iconfont icon">&#xe626;</span>
                  <span>告警时间:{{formatTime2(item.eventtime)}}</span>
                </p>
                <p>
                  <span class="iconfont icon">&#xe60a;</span>
                  <span>告警类型：{{item.discname}}</span>
                </p>
              </div>
              <div class="right fr">{{item.tagno}}号</div>
            </div>

          </div>
          <div class="charge-bottom" v-show="showBottom"></div>

        </div>
      </scroller>
    </group>

  </div>
</template>
<script>
import "@/tools/filter/filter.js";
import { format } from "date-fns";
import { Selector, Group, Calendar, Cell, Scroller, XButton } from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";
var operatorData = JSON.parse(localStorage.getItem("operatorData"));
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
  components: {
    Selector,
    Group,
    Calendar,
    Cell,
    Scroller,
    XButton
  },
  computed: {
    ...mapGetters(["alarmInfo"])
  },

  mounted() {
    this.$store.dispatch("AC_GetEventTypeList").then(res => {
      for (let item of res.data.eventDetailItems) {
        let Item = {
          key: item.eventitemid,
          value: item.discname
        };
        this.list.push(Item);
      }
      this.list.unshift({
        key: 0,
        value: "全部"
      });
      console.log(this.list);
    });
    this.$nextTick(() => {
      this.$refs.scrollerBottom.reset({ top: 0 });
    });
    if (this.alarmInfo.eventitemid != 0) {
      this.beginTime = this.alarmInfo.starttime;
      this.endTime = this.alarmInfo.endtime;
      this.value = this.alarmInfo.eventitemid;
      this.eventInfo.eventitemid = this.alarmInfo.eventitemid;
    }
    this.eventInfo.starttime = this.beginTime + " " + "00:00:00";
    this.eventInfo.endtime = this.endTime + " " + "23:59:59";
    this.loadMore();
  },
  data() {
    return {
      pullupDefaultConfig: pullupDefaultConfig,
      pulldownDefaultConfig: pulldownDefaultConfig,
      isEmpty: true,
      beginTime: this.formatTime(new Date().setHours(-24 * 7)),
      endTime: this.formatTime(new Date()),
      list: [],
      list2: [
        { key: -1, value: "全部" },
        { key: 0, value: "未处理" },
        { key: 1, value: "已处理" },
        { key: 2, value: "未解决" }
      ],
      value: 0,
      value2: -1,
      eventInfo: {
        accountid: operatorData.accountid,
        objid: 3,
        objtype: 30,
        treetype: 4,
        pageNum: 1,
        pageSize: 6,
        starttime: "",
        endtime: "",
        eventitemid: 0,
        dealstatus: -1
      },
      eventList: {
        totalCount: null,
        eventPointItems: []
      },
      showBottom: false
    };
  },
  methods: {
    jump(item) {
      this.$store.commit("UPDATE_SelectAlarmItem", item);
    },
    formatTime(val) {
      return format(val, "YYYY-MM-DD ");
    },
    formatTime2(val) {
      return format(val, "YYYY-MM-DD HH:mm:ss");
    },
    async getData(fn) {
      const result = await this.$store
        .dispatch("AC_GetEventList", this.eventInfo)
        .then(res => {
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset();
          });
          this.eventList.totalCount = res.data.total;
          if (this.eventInfo.pageNum > 1) {
            this.eventList.eventPointItems = this.eventList.eventPointItems.concat(
              res.data.listitem
            );
          } else {
            this.eventList.eventPointItems = res.data.listitem;
          }
          fn();
        });
    },
    loadMore() {
      if (this.isEmpty) {
        this.isEmpty = false;
      } else {
        this.eventInfo.pageNum++;
      }
      this.getData(() => {
        let index = this.eventInfo.pageSize * this.eventInfo.pageNum;

        if (this.eventList.totalCount <= index) {
          this.showBottom = true;

          this.$refs.scrollerBottom.disablePullup();
        }
        this.$refs.scrollerBottom.donePullup();
      });
    },
    refresh() {
      this.showBottom = false;
      this.bounce = true;
      this.eventInfo.pageNum = 1;
      this.$refs.scrollerBottom.disablePullup();
      this.getData(() => {
        let index = this.eventInfo.pageSize * this.eventInfo.pageNum;
        if (this.eventList.totalCount > index) {
          this.$refs.scrollerBottom.enablePullup();
        }

        this.$refs.scrollerBottom.donePulldown();
      });
    },
    search() {
      this.eventInfo.eventitemid = this.value;
      this.eventInfo.dealstatus = this.value2;
      this.eventInfo.starttime = this.beginTime + " " + "00:00:00";
      this.eventInfo.endtime = this.endTime + " " + "23:59:59";
      this.eventInfo.pageNum = 1;
      this.isEmpty = true;
      this.loadMore();
    }
  }
};
</script>
<style lang="less" scoped>
.list {
  position: absolute;
  left: 0;
  right: 0;
  overflow: hidden;
  top: 300px;
  bottom: 96px;
  .charge-list {
    padding: 20px;

    .charge-item {
      padding: 10px;
      background: white;
      margin-bottom: 20px;
      .charge-title {
        font-size: 32px;
      }
      .left {
        p {
          line-height: 60px;
          color: #666;
          font-size: 28px;
        }
        .icon {
          height: 60px;
          line-height: 60px;
          font-size: 32px;
          vertical-align: top;
        }
      }
      .right {
        color: green;
        line-height: 120px;
        font-size: 60px;
        padding-right: 20px;
      }
    }
    .charge-bottom {
      height: 550px;
    }
  }
}
</style>
<style lang="less">
.alarm {
  .weui-cell__hd .weui-label {
    width: 150px;
  }
  .weui-cell_access .weui-cell__ft:after {
    right: -5px;
    top: 16px;
    width: 20px;
    height: 20px;
  }
}
</style>



