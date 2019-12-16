<template>
  <div id="app" style="height:100%;">
    <router-view></router-view>
    <!-- <tabbar v-if="!showBack"  style="background-color:white;">
      <tabbar-item :selected="$route.name === 'tab1'" @click.native="jump('tab1')">
        <img slot="icon" src="./assets/icon/Section/station-default@2x.png" v-if="$route.name !== 'tab1'">
        <img slot="icon" src="./assets/icon/Section/station-selected@2x.png" v-if="$route.name === 'tab1'">
        <span slot="label">充电站</span>
      </tabbar-item>
      <tabbar-item :selected="$route.name === 'qrCode'" @click.native="jump('qrCode')">
        <img slot="icon" src="./assets/icon/Section/sweep-default@2x.png" v-if="$route.name !== 'qrCode'">
        <img slot="icon" src="./assets/icon/Section/sweep-selected@2x.png" v-if="$route.name === 'qrCode'">
        <span slot="label">扫码充电</span>
      </tabbar-item>
      <tabbar-item :selected="$route.name === 'tab3'" @click.native="jump('tab3')">
        <img slot="icon" src="./assets/icon/Section/mine-default@2x.png" v-if="$route.name !== 'tab3'">
        <img slot="icon" src="./assets/icon/Section/mine-selected@2x.png" v-if="$route.name === 'tab3'">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar> -->
    <tabbar v-if="!showBack2">
      <tabbar-item :selected="$route.name === 'home'" @click.native="jump('home')">
         <img slot="icon" src="./assets/icon/Section/shouye2.png" v-if="$route.name !== 'home'">
        <img slot="icon" src="./assets/icon/Section/shouye.png" v-if="$route.name === 'home'">
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item :selected="$route.name === 'earnings'" @click.native="jump('earnings')">
       <img slot="icon" src="./assets/icon/statisticsDefault@2x.png" v-if="$route.name !== 'earnings'">
        <img slot="icon" src="./assets/icon/statistics @2x.png"  v-if="$route.name === 'earnings'">
        <span slot="label">统计</span>
      </tabbar-item>
      <tabbar-item :selected="$route.name === 'alarm'" @click.native="jump('alarm')">
        <img slot="icon" src="./assets/icon/Section/alarm.png" v-if="$route.name !== 'alarm'">
        <img slot="icon" src="./assets/icon/Section/alarmse.png" v-if="$route.name === 'alarm'">
        <span slot="label">异常</span>
      </tabbar-item>
      <tabbar-item :selected="$route.name === 'myCenter'" @click.native="jump('myCenter')">
        <img slot="icon" src="./assets/icon/Section/mine-default@2x.png" v-if="$route.name !== 'myCenter'">
        <img slot="icon" src="./assets/icon/Section/mine-selected@2x.png" v-if="$route.name === 'myCenter'">
        <span slot="label">我的</span>
      </tabbar-item>

    </tabbar>
  </div>
</template>

<script>
import { ViewBox, XHeader, Tabbar, TabbarItem } from "vux";
import { mapState, mapGetters } from "vuex";

export default {
  components: {
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      title: state => state.route.meta.title,
      path : state => state.route.path
    }),
    ...mapGetters(["user"]),
    // showBack() {
    //   return !(
    //     this.path.lastIndexOf("tab1") !== -1 ||
    //     this.path.lastIndexOf("qrCode") !== -1 ||
    //     this.path.lastIndexOf("tab3") !== -1
    //   );
    // },

    showBack2() {
      return !(
        this.path.lastIndexOf("home") !== -1 ||
        this.path.lastIndexOf("earnings") !== -1 ||
        this.path.lastIndexOf("alarm") !== -1 ||
        this.path.lastIndexOf("myCenter") !== -1
      );
    }
  },
  mounted() {
    // 程序入口调用，获取微信相关信息
    // this.$store.dispatch("AC_GetUserInfoFromWechat");
  },
  methods: {
    jump(age) {
      if (age == "tab1") {
        this.$router.replace({ path: "/tab1" });
      } else if (age == "qrCode") {
        this.$router.replace({ path: "/qrCode" });
      } else if (age == "tab3") {
        this.$router.replace({ path: "/tab3" });
      } else if (age == "home") {
        this.$router.replace({ path: "/home" });
      } else if (age == "earnings") {
        this.$router.replace({ path: "/earnings" });
      } else if (age == "alarm") {
        let alarmInfo = {
          starttime  : " ",
          endtime    : " ",
          eventitemid: 0
        };
        this.$store.commit("UPDATE_AlarmInfo", alarmInfo);
        this.$router.replace({ path: "/alarm" });
      } else if (age == "myCenter") {
        this.$router.replace({ path: "/myCenter" });
      }
    }
  },
  watch: {
    title(val) {
      document.title = val;
    }
  },
  created() {
    this.jump();
  }
};
</script>

<style lang="less">
@width75: 75rem;
@import "~vux/src/styles/reset.less";
@import "//at.alicdn.com/t/font_229788_4intjbljdizlg14i.css";
@import "~vux/src/styles/1px.less";
@import "~vux/src/styles/close.less";

@font-face {
  font-family: "iconfont";                                                      /* project id 229788 */
  src        : url("//at.alicdn.com/t/font_229788_yvxbdo3bpe6d2t9.eot");
  src        : url("//at.alicdn.com/t/font_229788_yvxbdo3bpe6d2t9.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_229788_yvxbdo3bpe6d2t9.woff") format("woff"),
    url("//at.alicdn.com/t/font_229788_yvxbdo3bpe6d2t9.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_229788_yvxbdo3bpe6d2t9.svg#iconfont")
      format("svg");
}
@font-face {
  font-family: "iconfont";                                                  /* project id 708800 */
  src        : url("//at.alicdn.com/t/font_708800_2u5rt5ezmbg.eot");
  src        : url("//at.alicdn.com/t/font_708800_2u5rt5ezmbg.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_708800_2u5rt5ezmbg.woff") format("woff"),
    url("//at.alicdn.com/t/font_708800_2u5rt5ezmbg.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_708800_2u5rt5ezmbg.svg#iconfont") format("svg");
}

.iconfont {
  font-family              : "iconfont" !important;
  font-size                : 16px;
  font-style               : normal;
  -webkit-font-smoothing   : antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing  : grayscale;
}
.weui-tabbar {
  height    : 125 / @width75;
  background: #f7f7fa !important;
}
.weui-tabbar__icon {
  width        : 45px !important;
  height       : 45px !important;
  margin-bottom: 8 / @width75;
  margin-top   : 15 / @width75;
}
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
  color: #000000 !important;
}
.swiper-pagination-bullet-active {
  background: #f8b62c !important;
}
.margin-bottom10 {
  margin-bottom: 10px;
}

.fl {
  float: left;
}

.fr {
  float: right;
}
.text-center {
  text-align: center;
}
.clearfix:after {
  content    : "";
  height     : 0;
  line-height: 0;
  display    : block;
  clear      : both;
  visibility : hidden;
}

.weui-tabbar__label,
.weui-cells,
.weui-search-bar__label span,
.weui-search-bar__box .weui-search-bar__input,
.weui-btn {
  font-size: 28px !important;
}
.vux-confirm .weui-dialog {
  max-width: 6rem;
  .weui-dialog__title,
  .weui-dialog__bd,
  .weui-dialog__ft a {
    font-size  : 32px;
    line-height: 60px;
  }
}
.vux-tab-wrap {
  padding-top: 80px !important;
  .vux-tab-container {
    height: 80px;
    .vux-tab {
      height: 70px;
      .vux-tab-item {
        font-size  : 32px;
        height     : 60px;
        line-height: 60px;
      }
    }
    .scrollable .vux-tab-item {
      flex: 1;
    }
  }
}
.vux-x-dialog {
  .weui-mask {
    z-index: 499;
  }
}
.weui-cell__bd .weui-select {
  width: 50%;
}
.battery-record .weui-cells,
.tab1-header .weui-cells,
.rechargeRecord .weui-cells,
.alarm .weui-cells,
.dev-manage .weui-cells {
  margin-top: 0;
}
</style>


