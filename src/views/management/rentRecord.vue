<!-- 房租月收入统计  -->
<template>
  <div id="rentRecord">
    <img src="../../assets/icon/Section/selecttime.png" alt @click="show">
    <div class="time" v-if="timetf">
      <div class="timeframe">
        <div>
          <datetime v-model="beginTime" @on-confirm="changeBeginTime"></datetime>
          <p>{{$t("ab.start")}}</p>
        </div>
        <img src="../../assets/icon/Section/turn.png" alt>
        <div>
          <datetime v-model="endTime" @on-confirm="changeEndTime"></datetime>
          <p>{{$t("ab.end")}}</p>
        </div>
      </div>
      <x-button @click.native="search" class="search-btn">{{$t("ab.find")}}</x-button>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="showInfo"
        :title="$t('device.tips')"
        :confirm-text="$t('device.determine')"
        :cancel-text="$t('device.cancel')"
        @on-confirm="onConfirm"
      >
        <p class="text-center">{{$t("ab.greater")}}</p>
      </confirm>
    </div>
        <p class="datano" v-show="datano">
            <img src="../../assets/noData.png" alt="">
            <br>
            暂无数据
        </p>
    <ul>
      <li v-for="(item,month) in timer" :key="month">
        <div class="item">
            <h3>
              <img src="../../assets/yuev@2x.png" alt>
              {{item.chatname}}
            </h3>
            <p>
              {{formatTimes(item.chargingdate)}}
            </p>
            <p>
              <span>金额：</span>
              {{item.chargingmoney}}
            </p>
            <p>
              <span>明细：</span>
              {{item.notes}}
            </p>
          </div>
      </li>
    </ul>
  </div>
</template>

<script>
import api from "../../api/Piles.js";
import { Datetime, XButton, Confirm, TransferDom } from "vux";
import { format } from "date-fns";
var id = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
export default {
  data() {
    return {
      startDate: "",
      endDate: "",
      showInfo: false,
      startime1: "",
      startime2: "",
      datano: false,
      time: "", //时间范围
      today: this.formatTime(new Date()), //今天
      yesday: this.formatTime(new Date().setHours(-24 * 1)), //昨天
      timer: "", //数据
      para: "", //传递的参数
      num: 0,
      beginTime: this.formatTime(new Date().setHours(-24 * 10)), //开始时间
      endTime: this.formatTime(new Date()), //结束时间
      timetf: false,
      apptype:"8",//设备类型
    };
  },
  directives: {
    TransferDom
  },

  components: {
    Datetime,
    XButton,
    Confirm,
    TransferDom
  },


  mounted() {
    this.beginTime = this.formatTime(new Date(new Date().setDate(1)))
    this.endTime = this.formatTime(new Date())
    this.getRecord()
  },

  methods: {
    //   获取收入详情
    getRecord() {
      let obj = {
          accountid: id,
          dateFrom: this.formatTime(this.getCurrentMonthFirst()) + " 00:00:00",
          dateTo: this.formatTime(this.getCurrentMonthLast()) + " 23:59:59",
          apptype: this.apptype
      }
      api.GetRecordNewDetail(obj).then(res => {
        if (res.data.total > 0) {
          this.timer = res.data.chargingRecordDetailItems
          this.datano = false
        } else {
          this.datano = true;
        }
      })
    },
    formatTime(val) {
      return format(val, "YYYY-MM-DD");
    },
    formatTimes(val) {
      return format(val, "YYYY-MM-DD HH:mm:ss");
    },
    // 获取这个月的第一天
    getCurrentMonthFirst() {
      var date = new Date();
      date.setDate(1);
      return date;
    },
    // 获取这个月的最后一天
    getCurrentMonthLast() {
      var date = new Date();
      var currentMonth = date.getMonth();
      var nextMonth = ++currentMonth;
      var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
      var oneDay = 1000 * 60 * 60 * 24;
      return new Date(nextMonthFirstDay - oneDay);
    },
    // 图片显隐
    show() {
      if (this.timetf == false) {
        this.timetf = true;
      } else {
        this.timetf = false;
      }
    },
    // 查找
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
        api
          .GetRecordNewDetail({
            accountid: id,
            dateFrom: this.beginTime + " 00:00:00",
            dateTo: this.endTime + " 23:59:59",
            apptype:this.apptype,
          })
          .then(res => {
            this.timer = res.data.chargingRecordDetailItems;
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
      }
    },
    // 开始时间
    changeBeginTime(value) {
      this.beginTime = value;
      this.startime1 = value;
    },
    // 结束时间
    changeEndTime(value) {
      this.endTime = value;
      this.startime2 = value;
    },
    onConfirm() {

    }
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
#rentRecord{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(235,235,235);
    > img{
        position: absolute;
        right   : 39/@width75;
        top     : 27/@width75;
    }
}
ul {
  padding-top: 80 / @width75;
  li {
    margin: 10 / @width75;
    padding: 20 / @width75;
    border-radius: 30 / @width75;
    background-color: #fff;
  }
}
.item {
      h3 {
        font-size: 40 / @width75;
        height: 60 / @width75;
        line-height: 60 / @width75;
        img {
          width: 50 / @width75;
          height: 50 / @width75;
        }
      }
      p {
        height: 50 / @width75;
        line-height: 50 / @width75;
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
.time{
  padding   : 0 38/@width75;
  margin-top: 100/@width75;
}
.timeframe{
    width          : 100%;
    display        : flex;
    justify-content: space-between;
    text-align     : center;
    .vux-datetime {
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

