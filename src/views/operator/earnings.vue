<template>
  <div class="earnings">
    <div class="earnings-tab">
      <tab>
        <tab-item selected @on-item-click="onItemClick">全部</tab-item>
        <tab-item @on-item-click="onItemClick">今日</tab-item>
        <tab-item @on-item-click="onItemClick">昨日</tab-item>
        <tab-item @on-item-click="onItemClick">本月</tab-item>
        <tab-item @on-item-click="onItemClick">自定义</tab-item>
      </tab>
    </div>

    <!-- <div class="earings-footer-tab">
      <tab>
        <tab-item selected>
          <span>¥{{ChartData.totalMoney}}</span>
          <p>收入(元)</p>
        </tab-item>
      </tab>
    </div>-->
    <div class="earn-money">
      <p>收入（元）</p>
      <p class="money">¥{{ChartData.totalMoney}}</p>
    </div>

    <div class="charts">
      <div class="fr">
        <checker
          v-model             = "demo1"
          default-item-class  = "demo1-item"
          selected-item-class = "demo1-item-selected"
          radio-required
        >
          <checker-item value="1" @on-item-click="changeChart">
            <span class="iconfont icon">&#xe68f;</span>
          </checker-item>
          <checker-item value="2" @on-item-click="changeChart">
            <span class="iconfont icon">&#xe647;</span>
          </checker-item>
        </checker>
      </div>
      <div class="barChart" v-show="showChart==1">
        <canvas id="barChart" width="375" height="260"></canvas>
      </div>
      <div class="lineChart" v-show="showChart==0">
        <canvas id="lineChart" width="375" height="260" ref="lineChart"></canvas>
      </div>
    </div>

    <div v-transfer-dom>
      <confirm v-model="show" title="自定义时间" @on-confirm="onConfirm">
        <group>
          <calendar v-model="beginTime" title="开始时间" placeholder="请选择"></calendar>
          <calendar v-model="endTime" title="结束时间" placeholder="请选择"></calendar>
        </group>
      </confirm>
    </div>
  </div>
</template>
<script>
import {
  VChart,
  VTooltip,
  VLine,
  VScale,
  VArea,
  VLegend,
  VBar,
  Tab,
  TabItem,
  Confirm,
  TransferDomDirective as TransferDom,
  Calendar,
  Group,
  Checker,
  CheckerItem
} from "vux";
import { format } from "date-fns";
import F2 from "@antv/f2";

var operatorData = JSON.parse(localStorage.getItem("operatorUserItem"));

export default {
  directives: {
    TransferDom
  },
  components: {
    VChart,
    VTooltip,
    VLine,
    VScale,
    Tab,
    TabItem,
    Confirm,
    Calendar,
    Group,
    Checker,
    CheckerItem,
    VArea,
    VLegend,
    VBar
  },
  data() {
    return {
      demo1    : "2",
      show     : false,
      showChart: 1,
      beginTime: "",
      endTime  : "",
      ChartData: {
        totalMoney   : null,
        baseDataItems: []
      },

      chartInfo: {
        accountid: operatorData.accountid,
        fromDate : "",
        toDate   : ""
      }
    };
  },
  created() {},

  mounted() {
    this.totalIncomingData();
  },
  methods: {
    formatTime(val) {
      return format(val, "YYYY-MM-DD");
    },
    onItemClick(index) {
      if (index == 0) {
        this.totalIncomingData();
      }
      if (index == 1) {
        this.chartInfo.fromDate = 
          this.formatTime(new Date()) + " " + "00:00:00";
        this.chartInfo.toDate = this.formatTime(new Date()) + " " + "23:59:59";
        this.IncomingData();
      } else if (index == 2) {
        this.chartInfo.fromDate = 
          this.formatTime(new Date().getTime() - 24 * 60 * 60 * 1000) +
          " " +
          "00:00:00";
        this.chartInfo.toDate = 
          this.formatTime(new Date().getTime() - 24 * 60 * 60 * 1000) +
          " " +
          "23:59:59";
        this.IncomingData();
      } else if (index == 3) {
        this.chartInfo.fromDate = 
          this.formatTime(new Date().setDate(1)) + " " + "00:00:00";
        this.chartInfo.toDate = this.formatTime(new Date()) + " " + "23:59:59";
        this.IncomingData();
      } else if (index == 4) {
        this.show = true;
      }
    },

    onConfirm() {
      this.chartInfo.fromDate = this.beginTime + " " + "00:00:00";
      this.chartInfo.toDate   = this.endTime + " " + "23:59:59";
      this.IncomingData();
    },
    changeChart(value) {
      if (value == 1) {
        this.showChart = 0;
      } else {
        this.showChart = 1;
      }
    },
    initBarChart() {
      const chart = new F2.Chart({
        id        : "barChart",
        pixelRatio: window.devicePixelRatio
      });
      chart.source(this.ChartData.baseDataItems);
      chart.interval().position("lineDisc*totalMoney");
      chart.render();
    },
    initLineChart() {
                  this.$refs.lineChart.style.width  = "375px";
                  this.$refs.lineChart.style.height = "260px";
            const chart2                            = new F2.Chart({
        id        : "lineChart",
        pixelRatio: window.devicePixelRatio
      });
      chart2.source(this.ChartData.baseDataItems);
      chart2.line().position("lineDisc*totalMoney");
      chart2.render();
    },

    async IncomingData() {
      const result = await this.$store.dispatch(
        "AC_IncomingNewData",
        this.chartInfo
      );

      this.ChartData = result.data;

      this.initBarChart();
      this.initLineChart();
    },
    async totalIncomingData() {
      const result = await this.$store.dispatch("AC_IncomingNewData", {
        accountid: operatorData.accountid,
        allstatus: 1
      });
      this.ChartData = result.data;
      this.initBarChart();
      this.initLineChart();
    }
  }
};
</script>
<style scoped lang="less">
@width75: 75rem;
.icon {
  font-size: 36px;
  color    : skyblue;
}
.demo1-item {
  border : 1px solid #ececec;
  padding: 5px 15px;
}
.earn-money {
  margin-top: 45 / @width75;
  p {
    height     : 40 / @width75;
    line-height: 40 / @width75;
    text-align : center;
    height     : 40 / @width75;
    color      : rgb(153, 153, 153);
  }
  .money {
    font-size : 40 / @width75;
    color     : black;
    margin-top: 22 / @width75;
  }
}
.demo1-item-selected {
  background: skyblue;
  .icon {
    color: white;
  }
}
.charts {
  height    : 600px;
  background: white;
  .lineChart,
  .barChart {
    width : 100%;
    height: 520px;
  }
}
.earings-footer-tab {
  p {
    font-size: 28px;
  }
}
</style>
<style  lang="less">
.earings-footer-tab {
  .vux-tab-wrap {
    padding-top: 100px !important;
    .vux-tab-container {
      height: 100px;
      .vux-tab {
        height: 100px;
        .vux-tab-item {
          height     : 80px;
          line-height: 40px;
        }
      }
    }
  }
}
</style>



