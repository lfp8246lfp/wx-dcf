<template>
  <div class="login-wrap">
    <div class="login-header">
      <img class="logo" src="../../assets/icon/Section/logo.jpg">
      <h3>欢迎登录运营平台</h3>
    </div>
    <div class="login-content">
      <group>
        <x-input placeholder="请输入账号" v-model="username">
          <img src="../../assets/icon/Section/name.png" slot="label" alt>
        </x-input>
        <x-input placeholder="请输入密码" type="password" v-model="password">
          <img src="../../assets/icon/Section/password.png" slot="label" alt>
        </x-input>
      </group>
    </div>
    <div class="login-btn">
      <x-button @click.native="login">登录</x-button>
    </div>
  </div>
</template>
<script>
import { XInput, Group, XButton } from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";
var userItem = JSON.parse(localStorage.getItem("userItem"));
export default {
  components: {
    XInput,
    Group,
    XButton
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
    login() {
      this.$store
        .dispatch("AC_OperatorLogin", {
          accountid: this.username,
          password : this.password
        })
        .then(res => {
          if (res.data.success == "1") {
            this.$router.push("/manageBar");
          }
        });
    }
  }
};
</script>
<style scoped lang="less">
.login-wrap {
  background: white;
  height    : 100vh;
  padding   : 0 38px;
  .login-content,
  .login-btn {
    margin-top: 20px;
  }
  .login-header {
    padding-top: 100px;
    text-align : center;
    // span {
    //   font-size: 90px;
    // }
    .logo {
      width : 120px;
      height: 120px;
    }
    h3 {
      font-size : 32px;
      margin-top: 39px;
    }
  }
  .login-content {
    .vux-x-input {
      margin-bottom: 20px;
      border       : 1px solid #e2e2e2;
      border-radius: 70px;
      height       : 88px;
      .weui-cell__hd {
        .iconfont {
          font-size: 28px;
          display  : inline-block;
        }
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
</style>


