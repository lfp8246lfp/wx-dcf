<template>
  <div id="payment">
    <div class="select">
      <group>
        <cell :title="$t('scan.select')"></cell>
        <div class="flexbox">
          <checker
            v-model="selectMoney"
            default-item-class="demo5-item"
            selected-item-class="demo5-item-selected"
            class="checkbox"
          >
            <checker-item
              v-for="i in [10,20,50,100,200,300,500,800,1000]"
              :key="i"
              :value="i"
              class="check-item"
              @on-item-click="selectAmount"
            >
              <h3>¥{{i}}</h3>
              <p>{{$t('scan.price')}}：¥{{i}}</p>
            </checker-item>
          </checker>
        </div>
        <div class="customRecharge">
          <input
            type="text"
            autocomplete="off"
            placeholder="请输入充值金额"
            v-model="customRecharge"
            @input="inputAmount"
          >
        </div>
      <div class="balance">
        <div class="balance-icon">
          <img src="../../assets/icon/Section/sum.png" alt="">
        </div>
        <span>我的余额 {{balance}}（元）</span>
      </div>
      </group>
    </div>
    <div class="payWay">
      <group>
        <p class="title">{{$t('scan.paymethod')}}</p>
        <checklist disabled label-position="left" :options="commonList" v-model="checklist"></checklist>
      </group>
    </div>
    <div class="btn-box">
      <box>
        <x-button class="btn" @click.native="charging">{{$t('scan.immed')}}</x-button>
      </box>
    </div>
  </div>
</template>
<script>
import wx from "weixin-js-sdk";
import { mapState, mapGetters, mapMutations } from "vuex";
import { format } from "date-fns";
import wechat from "@/tools/wechat";
var userItem = JSON.parse(localStorage.getItem("userItem"));
import {
  XButton,
  Box,
  Group,
  Cell,
  Checklist,
  Checker,
  CheckerItem,
  Flexbox,
  FlexboxItem
} from "vux";
import { futimes } from "fs";
export default {
  components: {
    XButton,
    Box,
    Group,
    Cell,
    Checklist,
    Checker,
    CheckerItem,
    Flexbox,
    FlexboxItem
  },
  mounted() {},
  computed: {
    ...mapState({
      token: state => state.token,
      balance: state => state.balance
    }),
    ...mapGetters(["userInfos", "orderNum"])
  },
  data: function() {
    return {
        // 支付方式的值和选项
      checklist: [this.$t("recharge.wechatpay")],
      commonList: [this.$t("recharge.wechatpay")],
        // 选择面额的值
      selectMoney: 10,

      chargingInfo: {
        chatid: "",
        rechargevalue: 10
      },
      payInfo: {
        appid: userItem.appid,
        openid: userItem.openid,
        price: 10,
        orderNum: ""
      },
      failNum: false,
      resultMsg: "",
        // 输入金额
      customRecharge: ''
    };
  },
  methods: {
    formatTime(val) {
      return format(val, "YYYYMMDDHHmmss");
    },
    formatTime2(val) {
      return format(val, "YYYY-MM-DD HH:mm:ss");
    },
      //创建随机的orderNum
    createNum() {
      let Num = "";
      for (var i = 0; i < 6; i++) {
        Num += String(Math.floor(Math.random() * 10));
      }
      return Num;
    },
      //充值按钮
    charging() {
      if (userItem == null) {
        wechat.wxAuthJump();
      } else {
        let Num;
        if (this.failNum) {
          Num = this.orderNum;
        } else {
          Num = this.formatTime(new Date()) + this.createNum();
          this.$store.commit(
            "UPDATE_orderNum",
            this.formatTime(new Date()) + this.createNum()
          );
        }
        this.$store
          .dispatch("AC_PrePay", {
            appid: userItem.appid,
            openid: userItem.openid,
            price: this.payInfo.price,
            orderNum: Num
          })
          .then(res => {
            if (
              res.data.return_code == "SUCCESS" &&
              res.data.return_msg == "OK"
            ) {
              this.callWXPay(res.data);
            }
          });
      }
    },
    // 支付
    // charging里调用
    callWXPay(params) {
      var _this = this;
      return new Promise((resolve, reject) => {
        params.success = res => {
          resolve(res);
        };
        params.fail = err => {
          reject(err);
        };

        wx.chooseWXPay({
          timestamp: params.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: params.nonce_str, // 支付签名随机串，不长于 32 位
          package: `prepay_id=${params.prepay_id}`, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: "MD5", // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: params.paySign, /// 支付签名
          success: function(res) {
            // 支付成功后的回调函数
            if (res.errMsg == "chooseWXPay:ok") {
              //   _this.beginCharging();
              //   _this.UpdateUserInfo();
              _this.AddAppWxChatRecharge();
              _this.SendWaringMsg();
              // _this.GetUserInfomation();
              _this.failNum = false;
            } else {
              _this.failNum = true;
            }
          },
          cancel: function() {
            _this.commit("UPDATE_TOAST", "取消充值");
            _this.failNum = false;
          },
          error: function(res) {
            _this.commit("UPDATE_TOAST", "充值失败");
            _this.failNum = true;
          }
        });
      }).then(res => {});
    },
    // 选择金额
    selectAmount(itemValue) {
      this.customRecharge = ''
      console.log(itemValue)
      this.payInfo.price = itemValue
      this.chargingInfo.rechargevalue = itemValue
    },
    // 输入金额
    inputAmount() {
      this.selectMoney = ''
      console.log(this.customRecharge)
      this.payInfo.price = this.customRecharge
      this.chargingInfo.rechargevalue = this.customRecharge
    },
    // async GetUserInfomation() {
    //   this.$store
    //     .dispatch("AC_GetUserInfomation", {
    //       chatid: userItem.openid
    //     })
    //     .then(() => {
    //       this.$router.go(-1);
    //     });
    // },
    async AddAppWxChatRecharge() {
      // 微信充值改变个人账户金钱更新
      const result = await this.$store.dispatch("AC_AddAppWxChatRecharge", {
        chatid: userItem.openid,
        rechargevalue: this.chargingInfo.rechargevalue
      });
    },
    async beginCharging() {
      const result = await this.$store.dispatch("AC_AddRecharge", {
        chatid: userItem.openid,
        rechargevalue: this.chargingInfo.rechargevalue,
        rechargetype: 1
      });
    },

    // callWXPay里调用
    async SendWaringMsg() {
      const result = await this.$store.dispatch("AC_SendWaringMsg", {
        title: "充值成功通知",
        datas:
          "您已经成功充值到账户余额\t" +
          this.payInfo.price +
          "元\t" +
          this.formatTime2(new Date()) +
          "\t" +
          "充值余额仅能做充电使用",
        userOpenid: userItem.openid,
        mpAccount: userItem.appid,
        jumpUrl: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
          userItem.appid
        }&redirect_uri=http%3a%2f%2fbee.statesky.cn%2fpowerh5%2f%23%2frechargeRecord&response_type=code&scope=snsapi_base&state=1&conn`
      });
    }

    // async UpdateUserInfo() {
    //   const result = await this.$store.dispatch("AC_UpdateUserInfo", {
    //     chatid      : userItem.openid,
    //     balancevlaue: this.userInfos.balancevlaue + this.payInfo.price,
    //     // phone: "",        // chatname: "",

    //     status: 1
    //   });
    // },
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
#payment {
  position: relative;
  height: 100%;
  .flexbox {
    display: flex;
    .check-item {
      overflow: hidden;
      border-radius: 16 / @width75;
      margin: 36 / @width75 0 0 28 / @width75;
      width: 210 / @width75;
      box-sizing: border-box;
      height: 132 / @width75;
      font-size: 40 / @width75;
      h3 {
        margin-top: 24 / @width75;
        line-height: 44 / @width75;
        font-size: 40 / @width75;
        margin-bottom: 4 / @width75;
        text-align: center;
      }
      p {
        line-height: 40 / @width75;
        font-size: 22 / @width75;
        text-align: center;
      }
    }
  }
  .customRecharge {
    background: #ffffff;
    padding: 20 / @width75 30 / @width75;
    input {
      padding-left: 19 / @width75;
      border-radius: 16 / @width75;
      border: 2 / @width75 solid rgb(232, 232, 232);
      height: 68 / @width75;
      line-height: 68 / @width75;
      font-size: 28 / @width75;
    }
  }
  .balance {
    display: flex;
    height: 100 / @width75;
    padding: 20 / @width75 30 / @width75;
    background-color: #fff;
    font-size: 30 / @width75;
    .balance-icon {
      width: 60 / @width75;
      height: 60 / @width75;
      img {
        // width: 40 / @width75;
        // height: 40 / @width75;
        margin-top: -10 / @width75;
      }
    }
    span {
      height: 40 / @width75;
      line-height: 40 / @width75;
      padding-left: 10 / @width75;
    }
  }

  .demo5-item {
    background: #f6f6f6;
    color: #000000;
  }
  .demo5-item-selected {
    background: #35bab6;
    color: #ffffff;
  }
}

.payWay {
  .weui-cells {
    margin-top: 0;
  }
  p.title {
    border: none;
    color: #666666;
    line-height: 104 / @width75;
    padding-left: 38 / @width75;
    font-size: 28 / @width75;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}

.btn-box {
  width: 672 / @width75;
  height: 88 / @width75;
  margin: 40 / @width75 auto;
  border: none;
  border-radius: 44 / @width75;
  overflow: hidden;
  //   .weui-btn    : after{
  //   	display: none;
  //   }
  .btn {
    height: 88 / @width75;
    line-height: 88 / @width75;
    font-size: 40px;
    background: #35bab6;
    color: #ffffff;
    font-size: 34 / @width75;
  }
}
</style>
<style lang="less">
@width75: 75rem;
.flexbox .vux-checker-box {
  width: 100%;
  padding-bottom: 36 / @width75;
}

.select {
  .weui-cells {
    margin-top: 0;
    .weui-cell {
      padding: 0;
      line-height: 104 / @width75;
      padding-left: 38 / @width75;
      font-size: 28 / @width75;
      color: #666666;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
}

.payWay {
  .weui-cells {
    margin-top: 20 / @width75;
  }
  .weui-cells:before {
    display: none;
  }
  .weui-cell {
    padding: 0;
  }
  .weui-cells_checkbox {
    line-height: 128 / @width75;
    height: 128 / @width75;
    // .weui-cells: before{
    // 	display: none;
    // }
    .weui-cell__bd {
      p {
        padding-left: 102 / @width75;
        background: url(../../assets/icon/Section/wechat@2x.png) no-repeat 38 /
          @width75 center;
        background-size: 40 / @width75 40 / @width75;
      }
    }
  }
}
</style>



