<template>
    <div class="nebattery-record">
        <div class="charge-list">
            <div class="charge-item">
                <cell
                    class = "charge-title"
                    :title = "this.chargeList.data.disc"
                    :isLink="true"
                    :link="{path:`/tab4/${this.chargeList.data.pmeterid}`}"
                ></cell>
                <div class="clearfix">
                    <div class="left fl">
                    <p>
                        充电开始时间:
                        <span>{{formatTime2(this.chargeList.data.chargingdate)}}</span>
                    </p>
                    <p>
                        消费金额:
                        <span>{{this.chargeList.data.chargingmoney}}元</span>
                    </p>
                    </div>
                    <div class="right fr">
                    <div class="num">{{this.chargeList.data.tagno}}</div>
                    <p class="name">插座号</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import "@/tools/filter/filter.js";
import { Datetime, Group, Cell, Scroller } from "vux";
import { format } from "date-fns";
import { mapState, mapGetters, mapMutations } from "vuex";
var userItem = JSON.parse(localStorage.getItem("userItem"));

export default {
  components: {
    Datetime,
    Group,
    Cell
  },
  computed: {
    ...mapState({
      token: state => state.token
    })
  },
  data: function() {
    return {
      beginTime   : this.formatTime(new Date().setHours(-24 * 7)),
      endTime     : this.formatTime(new Date()),
      chargingInfo: {
        chargingid  : "",
        chargingdate: ""
      },

      chargeList: {
        totalCount: 0,
        data      : []
      }
    };
  },
  mounted() {
    this.$store
      .dispatch("AC_GetBatteryChargingRd", {
        chargingid  : this.$route.params.id || userItem.openid,
        chargingdate: this.$route.params.time
      })
      .then(res => {
        this.chargeList.data = res.data.userBtChargingItem;
        console.log(res);
      });
  },
  methods: {
    formatTime(val) {
      return format(val, "YYYY-MM-DD ");
    },
    formatTime2(val) {
      return format(val, "YYYY-MM-DD HH:mm:ss");
    }
    // async GetBatteryChargingRd() {
    //   const result = await this.$store
    //     .dispatch("AC_GetBatteryChargingRd", this.chargingInfo)
    //     .then(res => {
    //       this.chargeList.data = res.data.appBatteryChargingRdItems;
    //     });
    // }
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;

  .charge-list {
    .charge-item {
      width        : 710 / @width75;
      margin       : 20 / @width75 auto 0 auto;
      border-radius: 5 / @width75;
      background   : #ffffff;
      .charge-title {
        height       : 84 / @width75!important;
        line-height  : 84 / @width75!important;
        font-size    : 32 / @width75!important;
        font-weight  : bolder;
        border-bottom: 4 / @width75 #fafafa solid;
        .weui-cell__ft {
          font-size : 26 / @width75!important;
          color     : #64a618 !important;
          background: green !important;
        }
      }
      .left {
        padding-top   : 30 / @width75;
        padding-bottom: 30 / @width75;
        p {
          line-height : 40 / @width75;
          padding-left: 18 / @width75;
          font-size   : 28 / @width75;
          color       : #000000;
          span {
            display     : inline-block;
            color       : #666666;
            padding-left: 8 / @width75;
          }
        }
      }
      .right {
        .num {
          margin-right : 48 / @width75;
          margin-top   : 18 / @width75;
          width        : 80 / @width75;
          line-height  : 80 / @width75;
          height       : 80 / @width75;
          background   : #35bab6;
          overflow     : hidden;
          border-radius: 50%;
          font-size    : 28 / @width75;
          color        : #ffffff;
          text-align   : center;
        }
        .name {
          padding-top   : 6 / @width75;
          padding-bottom: 14 / @width75;
          line-height   : 40 / @width75;
          font-size     : 28 / @width75;
        }
      }
    }
  }


</style>

<style lang="less">
@width75: 75rem;
// .time .weui-cell_access .weui-cell__ft: after {
//   display: none !important;
// }

.time .vux-cell-value {
  color: #000000;
}

.dp-header {
  height       : 90 / @width75 !important;
  line-height  : 90 / @width75 !important;
  border-bottom: 0.013333rem solid #c7c7c7;
  background   : #fbf9fe;
}

.dp-header .dp-item {
  font-size     : 36 / @width75 !important;
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
  top   : 2.72rem !important;
}

.scroller-content .scroller-item {
  font-size  : 0.426666rem !important;
  height     : 0.906666rem !important;
  line-height: 0.906666rem !important;
}
</style>
