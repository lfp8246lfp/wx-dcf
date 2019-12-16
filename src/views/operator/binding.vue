<!-- 绑定账号 -->
<template>
  <div class="login-wrap">
    <img src="../../assets/dlogo.png" alt="">
    <div class="register">
        <div class="box">
            <img src="../../assets/icon/Section/name.png" alt="">
            <input type="text" placeholder="请输入账号" v-model="username">
        </div>
        <div class="box">
            <img src="../../assets/icon/Section/password.png" alt="">
            <input type="password" placeholder="请输入密码" v-model="password">
        </div>
    </div>
    <!-- <div class="login-content">
      <group>
        <x-input placeholder="请输入账号" v-model="username">
          <img src="../../assets/icon/Section/name.png" slot="label" alt>
        </x-input>
        <x-input placeholder="请输入密码" type="password" v-model="password">
          <img src="../../assets/icon/Section/password.png" slot="label" alt>
        </x-input>
      </group>
    </div> -->
    <div class="login-btn">
      <x-button @click.native="bangding">绑定</x-button>
    </div>
  </div>
</template>
<script>
import { XInput, Group, XButton,Toast } from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";
var userItem = JSON.parse(localStorage.getItem("userItem"));
export default {
  components: {
    XInput,
    Group,
    XButton,
    Toast
  },
  computed: {
    username: {
      get() {
        return this.$store.state.operator.operatorUserItem.accountid;
      },
      set(value) {
        this.$store.commit("UPDATE_OperatorUserItem", {
          accountid: value,
          password : this.password
        });
      }
    },
    password: {
      get() {
        return this.$store.state.operator.operatorUserItem.password;
      },
      set(value) {
        this.$store.commit("UPDATE_OperatorUserItem", {
          accountid: this.username,
          password : value
        });
      }
    }
  },
  data() {
    return {};
  },
  mounted() {},

  methods: {
    bangding() {
      this.$store
        .dispatch("AC_OperatorLoginChange", {
          accountid: this.username,
          password : this.password
        })
        .then(res => {
          if (res.data.success == "1") {
            this.$store
              .dispatch("AC_BandAccountInfo", {
                chatid   : userItem.openid,
                accountid: this.username,
                password : this.password
              })
              .then(res => {
                if (res.data.returnCode == 1) {
                  this.$router.push("/manageBar");
                } else if (res.data.returnCode == 4) {
                  this.$vux.toast.text("当前账号已经被其他微信号码绑定",'middle')
                }
              });
          }
        });
    }
  }
};
</script>
<style scoped lang="less">
@width75: 75rem;
.login-wrap {
  padding: 92 / @width75 37 / @width75 0;
  > img {
    display: block;
    width: 161 / @width75;
    margin: 0 auto 20 / @width75;
  }
  background: white;
  .login-btn {
    margin: 101 / @width75 0 0;
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
        font-size: 28 / @width75;
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
      .uncode {
        width: 200 / @width75;
        border: 1px solid #ccc;
        color: #ccc;
      }
    }
  }
}
.weui-btn {
  width        : 100%;
  height       : 88px;
  background   : #35bab5;
  color        : #fff;
  border-radius: 44px;
  font-size    : 36px !important;
}
</style>
<style lang="less">
@width75: 75rem;
.login-content {
  .vux-x-input {
    height   : 65px;
    font-size: 28px;
    .weui-cell__hd {
      padding-right: 30px;
    }
  }
  .weui-cell {
    padding: 0px 0 0px 35px;
  }
  .weui-cell:before {
    display: none;
  }
  .weui-cells:before {
    display: none;
  }
  .vux-no-group-title {
    margin-top: 46px;
  }
}
  .weui-toast__content {
    height: 150 / @width75;
    line-height:60/@width75;
    font-size: 36 / @width75;
  }
</style>


