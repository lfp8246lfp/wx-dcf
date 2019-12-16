<!-- 升级运营商 -->
<template>
  <div class="upter">
    <img src="../assets/dlogo.png" alt>
    <img src="../assets/logoname.png" alt>
    <div class="register">
      <div class="box">
        <img src="../assets/mobile.png" alt>
        <input type="text" :placeholder="$t('up.account')" v-model="personInfo.phone" maxlength="11">
      </div>
      <div class="box">
        <img src="../assets/code.png" alt>
        <input type="text" :placeholder="$t('up.code')" v-model="personInfo.smscode" class="pass" maxlength="10">
        <button v-if="isCode" @click="sendCode">{{$t("up.pin")}}</button>
        <button v-else class="uncode">{{time}}s{{$t("up.resend")}}</button>
      </div>
    </div>
    <!-- <group class="group1">
      <x-input placeholder="请输入账号" v-model="personInfo.phone" label-width="70" type="tel" :max="13" is-type="china-mobile">
          <img src="../assets/mobile.png" slot="label" alt>
      </x-input>
       <x-input placeholder="请输入验证码" v-model="personInfo.smscode" label-width="70">
           <x-button slot="right" type="primary" mini  @click.native="sendCode" v-if="isCode">获取验证码</x-button>
          <x-button slot="right" type="primary" mini  v-else>{{time}}s之后重新发送</x-button>
          <img src="../assets/code.png" slot="label" alt>
       </x-input>
    </group>-->
    <div class="error" :class="{show:isError}">{{$t("up.error")}}</div>
    <div class="group2">
      <x-button @click.native="commit" :gradients="['#1D62F0', '#19D5FD']">{{$t("up.next")}}</x-button>
    </div>
  </div>
</template>
<script>
import { XButton, Toast } from "vux";
import { format } from "date-fns";
import api from "../api/Piles.js";
export default {
  components: {
    XButton,

    Toast
  },
  data() {
    return {
      personInfo: {
        phone: "",
        smscode: ""
      }, //传递的数据
      time: 60, //倒计时
      isCode: true, //验证码信息
      isError: false //验证码错误提示
    };
  },
  mounted() {},
  methods: {
    // 下一步事件
    commit() {
      if (this.personInfo.phone != "" && this.personInfo.smscode != "") {
        this.$router.push({
          path: "/nextRegister",
          query: {
            phone: this.personInfo.phone,
            smscode: this.personInfo.smscode
          }
        });
      } else {
        if (this.personInfo.phone == "") {
          this.$vux.toast.text(this.$t("up.phoneempty"), "middle");
        } else {
          this.$vux.toast.text(this.$t("up.codeempty"), "middle");
        }
      }
    },
    // 发送验证码
    sendCode() {
      api.sendMessageCode({ phone: this.personInfo.phone }).then(res => {
        if (res.data.returnCode == "0") {
          this.$vux.toast.text(this.$t("up.sms"), "middle");
          this.isCode = false;
          setInterval(() => {
            this.time--;
            if (this.time == 0) {
              this.isCode = true;
              this.time = 60;
            }
          }, 1000);
        } else {
          this.$vux.toast.text(res.data.returnMsg, "middle");
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.upter {
  padding: 92 / @width75 37 / @width75 0;
  > img {
    display: block;
    width: 161 / @width75;
    margin: 0 auto 20 / @width75;
  }
  .error {
    font-size: 24 / @width75;
    color: red;
    margin-top: 13 / @width75;
    opacity: 0;
  }
  .show {
    opacity: 1;
  }
  .register {
    .box {
      border-bottom: 1px solid rgb(226, 226, 226);
      padding: 20 / @width75 0;
      margin-top: 60 / @width75;
      img {
        width: 48 / @width75;
        margin-right: 20 / @width75;
      }
      input {
        width: 440/@width75;
        font-size: 28 / @width75;
        background: none;
      }
      .pass{
        width: 300/@width75;
      }
      button {
        width: 158 / @width75;
        height: 48 / @width75;
        background: #fff;
        color: rgb(53, 186, 182);
        border: 1px solid rgb(53, 186, 182);
        line-height: 1;
        border-radius: 24 / @width75;
        font-size: 24 / @width75;
        float: right;
      }
      .uncode {
        width: 200 / @width75;
        border: 1px solid #ccc;
        color: #ccc;
      }
    }
  }
}
.upter .group1 {
  .weui-cell {
    padding: 34 / @width75;
  }
}
</style>
<style lang="less">
@width75: 75rem;
.upter .group1 .weui-cells {
  //   margin-top: 0;
  .weui-label {
    width: 120 / @width75;
    text-align: right;
    color: black;
    position: relative;
    top: 3 / @width75;
    margin-right: 20 / @width75;
    // font-weight: bold;
  }
  .weui-input {
    font-size: 28 / @width75;
    color: rgb(102, 102, 102);
  }
  
}
.weui-toast__content{font-size:32/@width75;}
.upter .group1 .weui-cells__title {
  padding: 16 / @width75 34 / @width75;
}
// .personal-data .group1 .weui-cells_radio {
//   padding: 0 19 / @width75;
// }
.upter .group2 {
  margin: 101 / @width75 0 0;
  .weui-btn {
    border-radius: 44 / @width75;
    background: #35bab6 !important;
    width: 100%;
    height: 1.17333333rem;
    text-align: center;
    line-height: 1.17333333rem;
    background: #35bab9;
    color: #fff;
    border-radius: 0.58666667rem;
    font-size: 0.48rem !important;
  }
}
</style>


