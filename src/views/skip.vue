<template>
  <div class="about-us">
    <div class="Email">
      <div class="Start-blinding">
        <img src="../assets/5@2x.png">
      </div>
      <p></p>
      <p>{{$t("up.bindaccount")}}</p>
      <x-button
          type   = "primary"
        :is-link = "true"
        :link    = "{path:'/binding'}"
          class  = "Bindingins-trument"
      >{{$t("up.de")}}</x-button>
    </div>
  </div>
</template>
<script>
import { Cell, Group, XButton, Qrcode, XImg } from "vux";
import wx from "weixin-js-sdk";
import wechat from "../tools/wechat";
import api from "@/api/Piles";
import { mapState, mapGetters } from "vuex";
var userItem = JSON.parse(localStorage.getItem("userItem"));
export default {
  components: {
    Cell,
    Group,
    XButton,
    Qrcode,
    XImg
  },
  data: function() {
    return {
      chatid: userItem.openid
    };
  },
  computed: {
    ...mapState({
      title: state => state.route.meta.title,
      path : state => state.route.path
    }),
    ...mapGetters(["user"])
  }

  //   beforeCreate() {
  //     var _this = this;
  //     if (userItem != null) {
  //       var user = wechat.getSubscribe(userItem.appid, userItem.openid);
  //       user.then(function(userInfo) {
  //         if (userInfo.subscribe == 0) {
  //           _this.$router.push("/aboutpublic");
  //         } else {
  //           _this.$store
  //             .dispatch("AC_checkBandStatus", { chatid: userItem.openid })
  //             .then(function(response) {
  //               if (response.data.returnCode == 0) {
  //                 _this.$router.push("/loginPlatform");
  //               } else {
  //                 _this.$router.push("/manageIndex");
  //               }
  //             });
  //         }
  //       });
  //     } else {
  //       this.$router.push("/login");
  //     }
  //   }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.about-us {
  padding-top: 260 / @width75;
  .tel,
  .Email,
  .Email {
    .Start-blinding {
      text-align: center;
      img {
        width : 240 / @width75;
        height: 198 / @width75;
      }
    }
    p {
      margin-top : 110 / @width75;
      height     : 44 / @width75;
      line-height: 44 / @width75;
      font-size  : 28 / @width75;
      color      : #666666;
      text-align : center;
    }
    .Bindingins-trument {
      width        : 672 / @width75;
      height       : 75 / @width75;
      text-align   : center;
      line-height  : 75 / @width75;
      background   : #35bab6;
      border-radius: 44 / @width75;
      font-size    : 34 / @width75 !important;
      color        : #ffffff;
      margin       : 0 auto;
      margin-top   : 65 / @width75;
    }
  }
  .Address {
    margin-bottom: 70 / @width75;
    h4 {
      height       : 44 / @width75;
      font-size    : 28 / @width75;
      color        : #000000;
      line-height  : 44 / @width75;
      text-align   : center;
      font-weight  : normal;
      margin-bottom: 8 / @width75;
    }
    p {
      height     : 44 / @width75;
      line-height: 44 / @width75;
      font-size  : 28 / @width75;
      color      : #666666;
      text-align : center;
    }
  }

  .footer {
    width      : 100%;
    position   : fixed;
    text-align : center;
    height     : 44 / @width75;
    line-height: 44 / @width75;
    font-size  : 28 / @width75;
    color      : #666666;
    bottom     : 80 / @width75;
  }
}
</style>
