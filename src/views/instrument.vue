<template>
  <div class="about-us">
    <div class="Email">
      <div class="Start-blinding">
        <img src="../assets/confirm.png">
      </div>
      <form action class="information">
        <p>请输入电表ID</p>
        <input type autocomplete="off" placeholder="请输入电表ID" v-model="meterno">
        <hr>
        <p>确认电表ID</p>
        <input type placeholder="请确认电表ID" v-model="meterConfirm">
        <hr>
        <p>手机号</p>
        <input type="text" placeholder="请输入手机号" v-model="phone">
        <hr>
        <p>昵称</p>
        <input type="text" placeholder="请输入昵称" v-model="chatname">
        <hr>
      </form>
      <x-button class="Bindingins-trument" @click.native="confirm">确定</x-button>
    </div>
    <div v-transfer-dom>
      <confirm v-model="show" title="温馨提示">
        <p class="text-center">请输入正确的八位电表号</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="show2" title="提示">
        <p class="text-center">两次电表ID不一致</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="show3" title="提示">
        <p class="text-center">请输入11位手机号</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import {
  Cell,
  Group,
  XButton,
  Qrcode,
  XImg,
  AlertModule,
  Alert,
  TransferDom,
  Confirm
} from "vux";
import wx from "weixin-js-sdk";
import wechat from "../tools/wechat";
import api from "@/api/Piles";
import { mapState, mapGetters } from "vuex";
var userItem = JSON.parse(localStorage.getItem("userItem"));

export default {
  directives: {
    TransferDom
  },
  components: {
    Alert,
    Cell,
    Group,
    XButton,
    Qrcode,
    XImg,
    Confirm
  },
  data: function() {
    return {
      show: false,
      show2: false,
      show3: false,
      meterno: "",
      meterConfirm: "",
      phone: "",
      chatname: ""
    };
  },
  computed: {
    ...mapState({
      title: state => state.route.meta.title,
      path: state => state.route.path
    }),
    ...mapGetters(["user"])
  },
  methods: {
    onHide() {
      console.log("on hide");
    },
    onShow() {
      console.log("on show");
    },
    confirm: function(event) {
      var _this = this;
      var meterno = this.meterno;
      var meterConfirm = this.meterConfirm;
      var phone = this.phone;
      var chatname = this.chatname;
      //   手机号11位正则;
      //   var re2 = /^1\d{10}$/;
      var re2 = /^(13[0-9]|14[0-9]|15[0-9]|166|17[0-9]|18[0-9]|19[8|9])\d{8}$/;
      var re1 = /^\d{8}$/;
      if (meterno == "" && !re1.test(meterno)) {
        // alert("电表名称不能为空");
        this.show = true;
      } else if (meterno !== meterConfirm) {
        this.show2 = true;
        // alert("电表名称输入不一致");
      } else if (!re2.test(phone)) {
        this.show3 = true;
        // alert("请输入11位手机号");
      } else {
        this.$store
          .dispatch("AC_bandDeviceInfo", {
            chatid: userItem.openid,
            meterno: this.meterno,
            phone: this.phone,
            chatname: this.chatname
          })
          .then(res => {
            console.log(res.data);
            if (res.data.returnCode == 0) {
              alert("绑定失败");
            } else if (res.data.returnCode == 4) {
              alert("已绑定过，请检查");
            } else if (res.data.returnCode == 6) {
              alert("表地址不存在");
              _this.$router.push({
                path: "/instrument"
              });
            } else {
              _this.$router.push({
                path: "/meterLow"
              });
            }
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@width75: 75rem;
.about-us {
  padding-top: 52 / @width75;
  .Email {
    .information {
      p {
        height: 36 / @width75;
        line-height: 36 / @width75;
        margin: 34 / @width75 39 / @width75;
        color: rgb(53, 186, 182);
        font-size: 28 / @width75;
      }
      input {
        margin: 0 39 / @width75;
        width: 672 / @width75;
        background: #fafafa;
        font-size: 32 / @width75;
      }
      input::-webkit-input-placeholder {
        color: rgb(204, 204, 204);
      }
      input::-moz-placeholder {
        color: rgb(204, 204, 204);
      }
      hr {
        margin: 20 / @width75 39 / @width75 15/@width75;
        background: rgb(242, 242, 242);
        height: 2 / @width75;
        border: none;
      }
    }
    .Start-blinding {
      text-align: center;
      margin-bottom: 54 / @width75;
      img {
        width: 266 / @width75;
        height: 195 / @width75;
      }
    }
    .Bindingins-trument {
      width: 672 / @width75;
      height: 88 / @width75;
      text-align: center;
      line-height: 88 / @width75;
      background: #35bab6;
      border-radius: 44 / @width75;
      font-size: 36 / @width75 !important;
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
}
</style>
<style lang="less" >
@width75: 75rem;
.about-us {
  .weui-toast__content {
    height: 150 / @width75;
    line-height: 150 / @width75;
    font-size: 40 / @width75;
  }
}
</style>
