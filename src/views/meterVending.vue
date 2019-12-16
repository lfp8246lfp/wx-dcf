<template>
  <div class="about-us">
    <div class="Email">
      <div class="Start-blinding">
        <img src="../assets/blinding.png">
      </div>
      <p>您还未绑定电表</p>
      <p>请点击下面按钮绑定电表</p>
      <x-button
        type="primary"
        :is-link="true"
        :link="{path:'/instrument'}"
        class="Bindingins-trument"
      >绑定电表</x-button>
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
  },
  mounted() {
    // this.$store
    //   .dispatch("AC_checkBandStatus", { chatid: userItem.openid })
    //   .then(res => {
    //     if (res.data.returnCode == 0) {
    //       this.$router.push("/meterVending");
    //     } else {
    //       this.$router.push("/meterLow");
    //     }
    //   });
    }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.about-us {
  padding-top: 158 / @width75;
  .tel,
  .Email,
  .Email {
    .Start-blinding {
      text-align: center;
      img {
        width: 416 / @width75;
        height: 261 / @width75;
      }
    }
    p {
      height: 44 / @width75;
      line-height: 44 / @width75;
      font-size: 28 / @width75;
      color: #666666;
      text-align: center;
    }
    .Bindingins-trument {
      width: 672 / @width75;
      height: 75 / @width75;
      text-align: center;
      line-height: 75 / @width75;
      background: #35bab6;
      border-radius: 44 / @width75;
      font-size: 34 / @width75 !important;
      color: #ffffff;
      margin: 0 auto;
      margin-top: 75 / @width75;
    }
  }
  .Address {
    margin-bottom: 70 / @width75;
    h4 {
      height: 44 / @width75;
      font-size: 28 / @width75;
      color: #000000;
      line-height: 44 / @width75;
      text-align: center;
      font-weight: normal;
      margin-bottom: 8 / @width75;
    }
    p {
      height: 44 / @width75;
      line-height: 44 / @width75;
      font-size: 28 / @width75;
      color: #666666;
      text-align: center;
    }
  }

  .footer {
    width: 100%;
    position: fixed;
    text-align: center;
    height: 44 / @width75;
    line-height: 44 / @width75;
    font-size: 28 / @width75;
    color: #666666;
    bottom: 80 / @width75;
  }
}
</style>
