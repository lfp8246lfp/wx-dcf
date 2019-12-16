<template>
  <div class="mine-wrap" ref="wrapper">
    <div>
      <div class="mine-header">
        <div class="face-wrap-wrap">
          <div class="face-wrap">
            <img :src="imgUrl" class="fl">
          </div>
        </div>
        <div class="mine-header-middle">
          <!-- <p>180度</p> -->
        </div>
        <div class="mine-header-right">
          <router-link to="/balanceRecharge">
            <div class="go-pay-money">充值</div>
          </router-link>
        </div>
      </div>
      <div class="my-wallet">
        <h4>我的钱包</h4>
        <div class="my-wallet-bottom">
          <div class="my-wallet-content">
            <h4 v-if="userInfos.balancevlaue != undefined">{{userInfos.balancevlaue}}</h4>
            <h4 v-else>0</h4>
            <p>平台余额(元)</p>
          </div>
          <div class="my-wallet-line"></div>
          <div class="my-wallet-content">
            <h4>--</h4>
            <p>红包(元)</p>
          </div>
        </div>
      </div>
      <div class="me-content">
        <group class="group1">
          <cell title="正在充电" value="正在充电的插头" :is-link="true" :link="{path:'/Charging'}">
            <img
              slot="icon"
              width="10"
              style="display:block;margin-right:5px;"
              src="../assets/icon/Section/battery@2x.png"
            >
          </cell>
          <cell title=" 充电记录" :is-link="true" :link="{path:'/batteryRecord'}">
            <img
              slot="icon"
              width="11"
              style="display:block;margin-right:5px;"
              src="../assets/icon/Section/notes@2x.png"
            >
          </cell>
          <!-- <cell title="账单记录" :is-link="true" :link="{path:`/rechargeRecord`}">
            <img
              slot="icon"
              width="14"
              style="display:block;margin-right:5px;"
              src="../assets/icon/Section/record@2x.png"
            >
          </cell>
          <cell title="管理平台" :is-link="true" :link="{path:'/loginCharge'}">
            <img
              slot="icon"
              width="14"
              style="display:block;margin-right:5px;"
              src="../assets/icon/Section/manage@2x.png"
            >
          </cell> -->
          <cell title="关于我们" :is-link="true" :link="{path:'/aboutUs'}">
            <img
              slot="icon"
              width="14"
              style="display:block;margin-right:5px;"
              src="../assets/icon/Section/about@2x.png"
            >
          </cell>
          <cell title="常见问题" :is-link="true" :link="{path:'/FAQ'}">
            <img
              slot="icon"
              width="14"
              style="display:block;margin-right:5px;"
              src="../assets/icon/Section/question@2x.png"
            >
          </cell>
        </group>
        <div class="tc"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { Cell, Group, Blur } from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";
import Bscroll from "better-scroll";
var userItem = JSON.parse(localStorage.getItem("userItem"));

export default {
  computed: {
    ...mapState({
      token: state => state.token
    }),
    ...mapGetters(["userInfos"])
  },
  components: {
    Cell,
    Group,
    Blur
  },
  mounted() {
    this.$store.dispatch("AC_GetUserInfomation", {
      chatid: userItem.openid
    });

    this.scroll = new Bscroll(this.$refs.wrapper, { click: true });
  },
  data: function() {
    return {
      imgUrl: require("./../assets/avatar.png")
    };
  },
  methods: {}
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
  bottom: 140 / @width75;
  overflow: hidden;
}

.mine-header {
  width: 750 / @width75;
  height: 300 / @width75;
  background: url(../assets/icon/Section/bd.png) no-repeat #ffffff;
  background-size: 750 / @width75 300 / @width75;
  display: flex;
  .face-wrap-wrap {
    width: 250 / @width75;
    height: 146 / @width75;
    border: 14 / @width75 solid rgba(255, 255, 255, 0.06);
    border-radius: 50%;
    overflow: hidden;
    // margin-left: 70 / @width75;
    margin-top: 50 / @width75;
    margin-right: 30 / @width75;
    .face-wrap {
      margin: 0 auto;
      width: 118 / @width75;
      height: 118 / @width75;
      border: 14 / @width75 solid rgba(255, 255, 255, 0.07);
      border-radius: 50%;
      overflow: hidden;
      img {
        display: inline-block;
        width: 118 / @width75;
        height: 118 / @width75;
      }
    }
  }
  .mine-header-middle {
    width: 250 / @width75;
    overflow: hidden;
    text-align: center;
    p {
      line-height: 40 / @width75;
      height: 40 / @width75;
      font-size: 32 / @width75;
      color: #ffffff;
      margin-top: 124 / @width75;
      //   width: 274 / @width75;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .mine-header-right {
    width: 250 / @width75;
    overflow: hidden;
    .go-pay-money {
      width: 160 / @width75;
      height: 66 / @width75;
      text-align: center;
      line-height: 66 / @width75;
      font-size: 26 / @width75;
      color: #ffffff;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 33 / @width75;
      margin-top: 112 / @width75;
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
  .weui-cell {
    width: 638 / @width75;
    padding: 0 32 / @width75 0 0;
    margin-left: 40 / @width75;
    height: 112 / @width75;
    line-height: 112 / @width75;
    background: url(../assets/icon/Section/arrow-right.png) no-repeat 646 /
      @width75 center;
    background-size: 16 / @width75 26 / @width75;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .weui-cell:before {
    display: none;
  }
  .tc {
    width: 100%;
    height: 50 / @width75;
    background: #ffffff;
  }
}
</style>
<style lang="less">
.me-content .group1 .weui-cells {
  margin-top: 0;
}

.me-content .weui-cell_access .weui-cell__ft:after {
  display: none !important;
}
</style>
