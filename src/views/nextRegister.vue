<!-- 升级运营商 -->
<template>
  <div class="nextregister">
    <img src="../assets/dlogo.png" alt="">
    <img src="../assets/logoname.png" alt="">
    <div class="register">
      <div class="box">
        <img src="../assets/pass.png" alt>
        <input type="password" :placeholder="$t('up.password')" v-model="personInfo.password">
      </div>
      <div class="box">
        <img src="../assets/pass.png" alt>
        <input type="password" :placeholder="$t('up.passworda')" v-model="passwords">
      </div>
    </div>
    <div class="error" :class="{show:isError}">{{$t("up.diff")}}</div>
    <div class="group2">
      <x-button @click.native="commit" :gradients="['#1D62F0', '#19D5FD']">{{$t("up.register")}}</x-button>
    </div>
    <loading :show="show" text></loading>
  </div>
</template>
<script>
import { XButton, Toast, Loading } from "vux";
import { format } from "date-fns";
import api from "../api/Piles.js";
var userItem = JSON.parse(localStorage.getItem("userItem"));
export default {
  components: {
    XButton,
    Loading,
    Toast
  },
  data() {
    return {
      personInfo: {
          password:''
      }, //传递的数据
      passwords: "",
      show: false,
      isError:false,
    };
  },
  mounted() {
    this.personInfo.phone = this.$route.query.phone;
    this.personInfo.smscode = this.$route.query.smscode;
  },
  methods: {
    // 注册
    commit() {
        if(this.personInfo.password!=""&&this.passwords!=""){
            if (this.personInfo.password == this.passwords) {
                this.personInfo.openid = userItem.openid;
                this.isError=false;
                this.show = true;
                api.registerWebChat(this.personInfo).then(res => {
                if (res.data.returnCode == "0") {
                    this.show = false;
                    this.$router.push("/landlord");
                } else {
                    this.$vux.toast.text(res.data.returnMsg, "middle");
                }
                });
            }else{
                this.isError=true;
            }
        }else{
            this.$vux.toast.text(this.$t("up.passempty"), "middle");
            this.isError=false;
        }
    }
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.nextregister {
  padding: 92 / @width75 37 / @width75 0;
  >img{
        display: block;
        width: 161/@width75;
        margin: 0 auto 20/@width75 ;
    }
  .error {
    font-size: 24 / @width75;
    color: red;
    margin-top: 13 / @width75;
    opacity: 0;
  }
  .show{
      opacity: 1;
  }
  .register {
    .box {
      border-bottom: 1px solid rgb(226, 226, 226);
      padding: 20 / @width75 0;
      margin-top: 60 / @width75;
      img {
        width: 48 / @width75;
        margin-right: 20/@width75;
      }
      input {
        font-size: 28 / @width75;
        width: 440/@width75;
        background: none;
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
    }
  }
}
.nextregister .group1 {
  .weui-cell {
    padding: 34 / @width75;
  }
}
</style>
<style lang="less">
@width75: 75rem;
.nextregister .group1 .weui-cells {
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
.nextregister .group1 .weui-cells__title {
  padding: 16 / @width75 34 / @width75;
}
// .nextregister .group1 .weui-cells_radio {
//   padding: 0 19 / @width75;
// }
.weui-toast__content{font-size:32/@width75;}
.nextregister .group2 {
  margin: 101 / @width75 0;
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


