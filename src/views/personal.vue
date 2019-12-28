<template>
  <div class="mine-wrap" ref="wrapper">
    <div>
      <div class="mine-header">
        <div class="face-wrap-wrap">
          <div class="face-wrap">
            <img :src="imgUrl" class="fl">
          </div>
          <div class="mess">
            <p>{{info.chatname}}</p>
            <p>{{info.phone}}</p>
          </div>
        </div>
        <div class="mine-header-middle">
          <p class="balance">{{$t("personal.balance")}}</p>
          <p class="price">{{balance}}</p>
        </div>
        <div class="mine-header-right">
          <router-link to="/balanceRecharge">
            <div class="go-pay-money">{{$t("personal.button")}}</div>
          </router-link>
        </div>
      </div>
      <div class="me-content">
        <div class="item" @click="btn('/billingRecords')">
          <img src="../assets/icon/personal/billRecord.png" alt="">
          <h3>账单记录</h3>
        </div>
        <div class="item" @click="btn('/Charging')">
          <img src="../assets/icon/personal/charging.png" alt="">
          <h3>正在充电</h3>
        </div>
        <div class="item" @click="btn('/batteryRecord')">
          <img src="../assets/icon/personal/chargeRecord.png" alt="">
          <h3>充电记录</h3>
        </div>
        <div class="item" @click="btn('/payRent')">
          <img src="../assets/icon/personal/payRent.png" alt="">
          <h3>缴纳房租</h3>
        </div>
        <div class="item" @click="skip">
          <img src="../assets/icon/personal/manage.png" alt="">
          <h3>管理平台</h3>
        </div>
        <div class="item" @click="isRegister">
          <img src="../assets/icon/personal/register.png" alt="">
          <h3>注册物业-房东</h3>
        </div>
        <div class="item" @click="btn('https://wj.qq.com/s/2230221/67bd')">
          <img src="../assets/icon/personal/agentJoin.png" alt="">
          <h3>代理加盟</h3>
        </div>
        <div class="item" @click="btn('/aboutUs')">
          <img src="../assets/icon/personal/aboutUs.png" alt="">
          <h3>关于我们</h3>
        </div>
        <div class="item" @click="btn('/FAQ')">
          <img src="../assets/icon/personal/question.png" alt="">
          <h3>常见问题</h3>
        </div>
        <div class="item" @click="btn('https://wj.qq.com/s/2230193/7c7d')">
          <img src="../assets/icon/personal/faultFeedback.png" alt="">
          <h3>故障反馈</h3>
        </div>
        <div class="item"></div>
        <div class="item"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { Cell, Group, Blur, Toast } from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";
import api from "../api/Piles.js";
import tools from "../tools/wechat/index";
import wechat from "../tools/wechat";
var userItem = JSON.parse(localStorage.getItem("userItem"));

export default {
  computed: {
    ...mapState({
      token: state => state.token,
      balance: state => state.balance
    }),
    ...mapGetters(["userInfos"])
  },
  components: {
    Cell,
    Group,
    Blur,
    Toast
  },
  mounted() {
    if (userItem != null) {
      this.$store.dispatch("AC_GetUserInfomation", {
        chatid: userItem.openid
      });

      this.getInfo();
    } else {
      wechat.wxAuthJumpperson();
    }
  },
  data: function() {
    return {
      accountid: "",
      password: "",
      imgUrl: require("./../assets/avatar.png"),
      info: "",
      // link: 'https://wj.qq.com/s/2230193/7c7d'
    };
  },
  methods: {
    getInfo() {
      api
        .GetChatBandInfo({
          chatid: userItem.openid
        })
        .then(res => {
          console.log(res.data, '获取首页信息')
          if (res.data.returnCode == 1) {
            this.info = res.data;
            this.$store.commit('balanceChange', res.data.balancevalue)
          } else {
            wechat.wxAuthJumpperson();
          }
        });
    },
    skip() {
      
      api.CheckAdminBandStatus({
          chatid: userItem.openid
        })
        .then(res => {
          console.log('管理平台', res)
          if (res.data.returnCode == 0) {
            this.$router.push("/skip");
          } else {
            // 解码
            var t = tools.fnc(res.data.item);
            var x = t.indexOf("@");
            var u = x + 1;
            var y = t.slice(0, x);
            var z = t.slice(u);
            // 账号密码
            this.accountid = y;
            this.password = z;
            this.$store
              .dispatch("AC_OperatorLogin", {
                accountid: this.accountid,
                password: this.password
              })
              .then(res => {
                if (res.data.success == "1") {
                  this.$router.push("/manageBar/manageIndexV1");
                } else if (res.data.success == "2") {
                  this.$router.push('/binding')
                }
              });
          }
        });
    },
    isRegister() {
      api
        .registerStatus({
          openid: userItem.openid
        })
        .then(res => {
          if (res.data.returnCode == "0") {
            this.$router.push("/upOpreator");
          } else {
            this.$store.commit("UPDATE_TOAST", res.data.returnMsg);
          }
        });
    },
    btn(path) {
      if (path.startsWith('/')) {
        if (path === '/payRent') {
          this.$router.push({
            name: 'payRent',
            params: {
              balance: this.balance
            }
          })
        }
        this.$router.push(path)
      } else {
        window.location.href = path
      }
    }
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;

.mine-wrap {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgb(245,245,245);
}

.mine-header {
  width: 750 / @width75;
  height: 420 / @width75;
  background: url(../assets/4back@2x.png) no-repeat #1bbbb3;
  background-size: 750 / @width75 440 / @width75;
  padding-top: 20 / @width75;
  // display: flex;
  .face-wrap-wrap {
    width: 250 / @width75;
    overflow: hidden;
    margin-left: 20 / @width75;
    display: flex;
    .face-wrap {
      width: 60 / @width75;
      height: 60 / @width75;
      border: 6px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      overflow: hidden;
      img {
        border-radius: 50%;
        display: inline-block;
        width: 60 / @width75;
        height: 60 / @width75;
      }
    }
    .mess {
      p {
        margin-top: 14 / @width75;
        margin-left: 14 / @width75;
        color: #ffffff;
      }
    }
  }
  .mine-header-middle {
    width: 400 / @width75;
    overflow: hidden;
    text-align: center;
    margin: 0 auto;
    p {
      font-size: 32 / @width75;
      color: #ffffff;
      margin-top: 28 / @width75;
      //   width: 274 / @width75;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .balance {
      font-size: 28 / @width75;
      padding: 4 / @width75;
    }
    .price {
      font-size: 80 / @width75;
      margin-top: 20 / @width75;
    }
  }

  .mine-header-right {
    margin: 0 auto;
    width: 250 / @width75;
    overflow: hidden;
    .go-pay-money {
      width: 250 / @width75;
      height: 60 / @width75;
      text-align: center;
      line-height: 60 / @width75;
      font-size: 30 / @width75;
      font-weight: bold;
      color: #15be9d;
      background: rgba(255, 255, 255, 1);
      border-radius: 33 / @width75;
      margin-top: 56 / @width75;
    }
  }
}

.my-wallet {
  width: 750 / @width75;
  height: 176 / @width75;
  padding-top: 20 / @width75;
  background: #ffffff;
  margin-bottom: 20 / @width75;
  h4 {
    text-align: center;
    height: 36 / @width75;
    line-height: 36 / @width75;
    text-align: center;
    font-size: 30 / @width75;
    color: #000000;
    letter-spacing: 2px;
    font-weight: bolder;
  }
  .my-wallet-bottom {
    height: 120 / @width75;
    overflow: hidden;
    display: flex;
    align-items: center;
    .my-wallet-content {
      width: 373 / @width75;
      h4 {
        height: 42 / @width75;
        line-height: 42 / @width75;
        font-size: 38 / @width75;
        margin-top: 26 / @width75;
        margin-bottom: 14 / @width75;
        font-weight: normal;
        text-align: center;
      }
      p {
        font-size: 26 / @width75;
        height: 36 / @width75;
        line-height: 36 / @width75;
        text-align: center;
        color: #999999;
      }
    }
    .my-wallet-line {
      width: 4 / @width75;
      height: 66 / @width75;
      background: #dcdcdc;
    }
  }
}

.me-content {
  background-color: transparent;
  // .weui-cell {
  //   color: rgb(51, 51, 51);
  //   width: 638 / @width75;
  //   padding: 0 32 / @width75 0 0;
  //   margin-left: 40 / @width75;
  //   height: 112 / @width75;
  //   line-height: 112 / @width75;
  //   background: url(../assets/icon/Section/arrow-right.png) no-repeat 646 /
  //     @width75 center;
  //   background-size: 16 / @width75 26 / @width75;
  //   border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  // }
  // .weui-cell:before {
  //   display: none;
  // }
  // .tc {
  //   width: 100%;
  //   height: 50 / @width75;
  //   background: #ffffff;
  // }
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  .item {
    width: 33.3333%;
    height: 162 / @width75;
    border: 1px solid rgb(245,245,245);
    background-color: #fff;
    box-sizing: border-box;
    &:nth-child(-n + 9) {
      border-bottom: 0;
    }
    &:nth-child(3n + 1), &:nth-child(3n + 2) {
      border-right: 0;
    }
    img {
      width: 40 / @width75;
      height: 40 / @width75;
      margin: 40 / @width75 0 10 / @width75;
    }
    h3 {
      font-size: 28 / @width75;
      color: rgb(102,102,102);
    }
  }
}
</style>
<style lang="less">
@width75: 75rem;
.me-content .group1 .weui-cells {
  margin-top: 0;
}

.me-content .weui-cell_access .weui-cell__ft:after {
  display: none !important;
}
.weui-toast__content {
  height: 150 / @width75;
  line-height: 150 / @width75;
  font-size: 40 / @width75;
}
</style>
