<template>
  <div class="bind">
    <div class="Email">
      <div class="Start-blinding">
        <img src="../../assets/confirm.png">
      </div>
      <form action class="information">
        <p>{{$t("bind.meterID")}}</p>
        <input type="text" autocomplete="off" :placeholder="$t('bind.meterID')" v-model="meterno">
        <hr>
        <p>{{$t("bind.ammeterID")}}</p>
        <input type="text" :placeholder="$t('bind.meterID')" v-model="meterConfirm">
        <hr>
        <p>{{$t("bind.phonenumber")}}</p>
        <input type="text" :placeholder="$t('bind.phonenumber')" v-model="phone">
        <hr>
        <p>{{$t("bind.nickname")}}</p>
        <input type="text" :placeholder="$t('bind.enternickname')" v-model="chatname">
      </form>
      <x-button class="Bindingins-trument" @click.native="confirm">{{$t("device.determine")}}</x-button>
    </div>
    <div v-transfer-dom>
      <confirm v-model="show" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')">
        <p class="text-center">{{$t("bind.meternum")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="show2" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')">
        <p class="text-center">{{$t("bind.twometers")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="show3" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')">
        <p class="text-center">{{$t('bind.mobilephone')}}</p>
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
import wechat from "../../tools/wechat";
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
      show        : false, //提示
      show2       : false, //提示
      show3       : false, //提示
      meterno     : "", //电表id
      meterConfirm: "", //电表id
      phone       : "", //手机号
      chatname    : "" //昵称
    };
  },
  computed: {
  },
  mounted() {
    this.meterno=this.$route.params.value;
    this.meterConfirm=this.$route.params.value;
  },
  methods: {
    onHide() {
      console.log("on hide");
    },
    onShow() {
      console.log("on show");
    },
    confirm: function(event) {
      var _this        = this;
      var meterno      = this.meterno;
      var meterConfirm = this.meterConfirm;
      var phone        = this.phone;
      var chatname     = this.chatname;
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
            chatid  : userItem.openid,
            meterno : this.meterno,
            phone   : this.phone,
            chatname: this.chatname
          })
          .then(res => {
            console.log(res.data);
            if (res.data.returnCode == 0) {
              this.$vux.toast.text(this.$t("record.failbind"), 'center');
            } else if (res.data.returnCode == 4) {
              this.$vux.toast.text(this.$t("record.check"), 'center');
            } else if (res.data.returnCode == 6) {
              this.$vux.toast.text(this.$t("record.exist"), 'center');
              _this.$router.push({
                path: `/manageBind/${this.meterno}`
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
.bind {
  padding-top: 158 / @width75;
  .Email {
    .information {
      p {
        height     : 36 / @width75;
        line-height: 36 / @width75;
        margin     : 27 / @width75 39 / @width75;
        color      : rgb(53, 186, 182);
      }
      input {
        margin    : 0 39 / @width75;
        width     : 672 / @width75;
        background: #fafafa;
      }
      hr {
        margin: 16 / @width75 39 / @width75;
      }
    }
    .Start-blinding {
      text-align   : center;
      margin-bottom: 54 / @width75;
      img {
        width : 266 / @width75;
        height: 195 / @width75;
      }
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
      margin-top   : 75 / @width75;
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

}
</style>
<style lang="less" >
@width75: 75rem;
.bind{
  .weui-toast__content{
      height     : 150/@width75;
      line-height: 150/@width75;
      font-size  : 40/@width75;
  }
}
</style>
