<!-- 充电记录  -->
<template>
  <div class="chargerecord">
    <img src="../../assets/icon/Section/selecttime.png" alt @click="show">
    <div class="time" v-if="timetf">
      <div class="timeframe">
        <div>
          <datetime v-model="beginTime" @on-confirm="changeBeginTime" :start-date="startDate"></datetime>
          <p>{{$t("ab.start")}}</p>
        </div>
        <img src="../../assets/icon/Section/turn.png" alt>
        <div>
          <datetime v-model="endTime" @on-confirm="changeEndTime" :end-date="endDate"></datetime>
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
        <div class="record-top">
          <h1>{{item.month}}</h1>
          <!-- <p>收入 ￥{{all(item)}}元</p> -->
          <p style="color:red;">{{$t("record.tips")}}</p>
        </div>
        <div class="record-box">
          <div class="record-list" v-for="(list,index) in item.detaillist" :key="index">
            <div class="rlist-left">
              <img v-if="apptype==3" src="../../assets/shengyudianliang@2x.png" alt>
              <img v-if="apptype==1" src="../../assets/chargingsalary.png" alt>
              <div class="elesur">
                <div>
                  <h1 v-if="apptype==3">{{$t("device.electricnumber")}}: {{list.devicetag}}</h1>
                   <h1 v-if="apptype==1">充电桩号: {{list.devicetag}}</h1>
                  <p>{{formatTimes(list.chargingdate)}}</p>
                  <p>{{list.notes}}</p>
                </div>
                
                <p><span v-if="list.notes=='超时不用自动退款'">-</span>{{list.chargingmoney.toFixed(1)}} {{$t("record.yuan")}}</p>
              </div>
            </div>
          </div>
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
      apptype:"",//设备类型
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

  computed: {},

  mounted() {
    this.time = this.$route.query.timerange;
    this.apptype = this.$route.query.apptype;
    this.getRecord();
    this.startDate = this.formatTime(new Date().setHours(-24 * 183));
    this.endDate = this.formatTime(new Date().setHours(24 * 1));
  },

  methods: {
    //   获取收入详情
    getRecord() {
      // 本月收入
      if (this.$route.query.num == 0) {
        this.para = {
          accountid: id,
          dateFrom: this.formatTime(this.getCurrentMonthFirst()) + " 00:00:00",
          dateTo: this.formatTime(this.getCurrentMonthLast()) + " 23:59:59",
          apptype:this.apptype
        };
      }
      // 昨天收入
      else if (this.$route.query.num == 1) {
        this.para = {
          accountid: id,
          dateFrom: this.yesday + " 00:00:00",
          dateTo: this.yesday + " 23:59:59",
        };
      }
      // 今日收入
      else if (this.$route.query.num == 2) {
        this.para = {
          accountid: id,
          dateFrom: this.time + " 00:00:00",
          dateTo: this.today + " 23:59:59",
        };
      }
      //   api.GetRecordDetail(this.para).then(res => {
      //     this.timer = res.data.chargingRecordDetailItems;
      //   });

      api.GetRecordNewDetail(this.para).then(res => {
        this.timer = res.data.chargingRecordDetailItems;
        if (res.data.total == 0) {
          this.datano = true;
        }
      });
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
    // 收入
    all(value) {
      let i = 0;
      value.detaillist.forEach(item => {
        i = i + parseInt(item.chargingmoney);
      });
      return i;
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
      //   api.GetRecordDetail({
      //     accountid:id,
      //     dateFrom: this.beginTime+" 00:00:00",
      //     dateTo:this.endTime+" 23:59:59"
      //   }).then(res => {
      //     this.timer = res.data.chargingRecordDetailItems;
      //   });
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
    // 确定事件（只是形式上）
    onConfirm() {}
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.chargerecord{
    > img{
        position: absolute;
        right   : 39/@width75;
        top     : 27/@width75;
    }
}
.record-top{
    padding: 16/@width75 32/@width75 10/@width75 38/@width75;
    h1{
        font-size: 28/@width75;
        color    : #666666;
        padding  : 8/@width75 0;
    }
    p{
        margin-top: 4/@width75;
        color     : #999999;
        padding   : 7/@width75 0 6/@width75;
    }

}
.record-box{
    background   : #fff;
    padding      : 0 38/@width75;
    border-top   : 1px solid #f4f4f4;
    border-bottom: 1px solid #f4f4f4;
    .record-list{
        display        : flex;
        justify-content: space-between;
        padding        : 26/@width75 0 0 ;

        .rlist-left{
            display: flex;
            .elesur{
                width          : 564/@width75;
                border-bottom  : 1px solid #f4f4f4;
                padding-bottom : 30/@width75;
                display        : flex;
                justify-content: space-between;
                h1{font-weight: bold;font-size: 28  /@width75;padding: 8/@width75 0 7/@width75}
                p{
                    // margin-top:10/@width75;
                    color  : #999999;
                    padding: 9/@width75 0 8/@width75;
                }
                >p{
                    color      : #000;
                    font-size  : 32/@width75;
                    font-weight: bold;
                }
            }
            img{
                margin-right: 30/@width75;
                width       : 80/@width75;
                height      : 80/@width75;
            }

        }
        >p{
            font-weight: bold;
            font-size  : 32 /@width75;
        }
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

