<!-- 电量告警用户 -->
<template>
  <div class="alarmuser">
    <div class="userlist">
      <scroller
        lock-x
        ref="scroll"
        use-pullup
        :pullup-config="pullupDefaultConfig"
        @on-pullup-loading="loadMore"
      >
        <ul>
          <li v-for="(item, index) in alarmUserlist.data" :key="index">
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
                <div>
                  <h2>{{$t("barIndex.surplus")}}</h2>
                  <p>{{item.balancevlaue.toFixed(1)}} kWh</p>
                </div>
              </div>
            </div>
            <div class="recharge" @click="recharge(item)">{{$t("abchange.reminders")}}</div>
          </li>
        </ul>
        <div v-transfer-dom>
          <confirm v-model="shows" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm()">
            <p class="text-center">{{$t("abchange.rechargereminder")}}</p>
          </confirm>
        </div>
      </scroller>
    </div>
    <x-button @click.native="alarmuser()" class="alarmuser-btn">{{$t("abchange.allremind")}}</x-button>
  </div>
</template>

<script>
import { XButton, Scroller, TransferDom, Alert, Confirm } from "vux";
import api from "../../api/Piles.js";
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
  data() {
    return {
      chatid: "",
      alarmUserlist: { //数据
        total: 0,
        data: []
      },
      shows: false, //确定充电提醒
      pullupDefaultConfig: pullupDefaultConfig,
      alarmreq: { //用户参数
        accountid: id,
        pageNum: 1,
        pageSize: 6
      },
      isEmpty: true,
      sendObj:{}
    };
  },
  directives: {
    TransferDom
  },

  components: {
    XButton,
    Scroller,
    TransferDom,
    Alert,
    Confirm
  },

  computed: {},

  mounted() {
    this.$nextTick(() => {
      this.$refs.scroll.reset({ top: 0 });
    });
    this.loadMore();
  },

  methods: {
    async SendWaringMsg(item) {
      const result = await this.$store.dispatch("AC_SendWaringMsg", {
        title: "低电量提醒",
        datas: `您好:${item.metername} 电量剩余不足${item.alarmenergy}kWh\t${
          item.chatname
        }\t${item.commaddress}\t${
          item.balancevlaue
        }kWh\t 为了保证您的正常用电，请及时充值`,
        userOpenid: item.chatid,
        mpAccount: item.appid,
        jumpUrl: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
          item.appid
        }&redirect_uri=http%3a%2f%2fbee.statesky.cn%2fpowerh5%2f%23%2fremindCharge%2f${
          item.chatid
        }&response_type=code&scope=snsapi_base&state=1&conn`
      })
      return result;
    },
    recharge: function(item) {
      this.shows = true;
      this.chatid = item.chatid;
      this.sendObj=item
    },
    onConfirm() {
      this.SendWaringMsg(this.sendObj).then(res=>{
        if(res.code!=200){
          this.$vux.toast.text(this.$t("abchange.failsend"), 'center')
        }
        else if(res.data.returnCode=="success"){
          this.$vux.toast.text(this.$t("abchange.hassend"), 'center')
        }
      })
    },
    alarmuser() {
      var data = this.alarmUserlist.data;
      for (var i = 0; i < data.length; i++) {
        this.SendWaringMsg(data[i]);
      }
      this.$vux.toast.text(this.$t("abchange.hassend"), 'center')
    },
    //     获取数据
    getAlarmuser(fn) {
      api.GetAlarmEnergyRecord(this.alarmreq).then(res => {
        this.$nextTick(() => {
          this.$refs.scroll.reset();
        });
        this.alarmUserlist.total = res.data.total;
        if (this.alarmreq.pageNum > 1) {
          this.alarmUserlist.data = this.alarmUserlist.data.concat(
            res.data.listitem
          );
        } else {
          this.alarmUserlist.data = res.data.listitem;
        }
        fn();
      });
    },
    // 加载更多
    loadMore() {
      if (this.isEmpty) {
        this.isEmpty = false;
      } else {
        this.alarmreq.pageNum++;
      }
      this.getAlarmuser(() => {
        let index = this.alarmreq.pageSize * this.alarmreq.pageNum;
        if (this.alarmUserlist.total <= index) {
          this.$refs.scroll.disablePullup();
        }
        this.$refs.scroll.donePullup();
      });
    }
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.alarmuser {
  .userlist {
    border-top: 1px solid #f6f6f8;
    border-bottom: 1px solid #f6f6f8;
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
          justify-content: space-between;
          width: 450 / @width75;
          div {
            h2 {
              color: #a3a3a3;
              font-size: 20 / @width75;
            }
            p {
              font-weight: bold;
              margin-top: 10 / @width75;
            }
          }
        }
        .recharge {
          width: 180 / @width75;
          height: 58 / @width75;
          border: 2px solid #35bab6;
          text-align: center;
          line-height: 58 / @width75;
          border-radius: 29 / @width75;
          font-size: 28 / @width75;
          color: #35bab6;
        }
      }
    }
  }
}
.weui-btn {
  height: 88 / @width75;
  text-align: center;
  line-height: 88 / @width75;
  background: #35bab7;
  color: #fff;
  font-size: 36 / @width75 !important;
  position: fixed;
  bottom: 0;
}
</style>
<style lang="less">
@width75: 75rem;
.vux-x-dialog .weui-mask {
  z-index: 500 !important;
}

.weui-dialog {
  max-width    : 540 / @width75!important;
  border-radius: 20 / @width75!important;
  overflow     : hidden;
}
.weui-dialog__hd .weui-dialog__title {
  font-size     : 36 / @width75!important;
  letter-spacing: 4px;
  font-weight   : bolder;
}

.weui-dialog__bd .text-center {
  color      : #030303 !important;
  line-height: 40 / @width75;
  font-size  : 30 / @width75!important;
}

.weui-dialog__ft {
  line-height: 88 / @width75!important;
  height     : 88 / @width75!important;
}

.weui-dialog__ft .weui-dialog__btn {
  line-height: 88 / @width75!important;
  height     : 88 / @width75!important;
  font-size  : 34 / @width75!important;
  color      : #007aff;
}
</style>

