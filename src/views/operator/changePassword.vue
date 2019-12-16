<template>
  <div class="change-password">
    <group class="group1">
      <x-input title="原密码" placeholder="填写原密码" type="password" v-model="oldPassword"></x-input>
      <x-input title="新密码" placeholder="填写新密码" type="password" v-model="password"></x-input>
      <x-input title="确认密码" placeholder="再次填写确认" type="password" v-model=" confirmPassword" :equal-with="password"></x-input>

    </group>
    <div class="group2">
      <x-button @click.native="commit" :gradients="['#1D62F0', '#19D5FD']">提交</x-button>
    </div>


  </div>
</template>

<script>
import { XInput, Group, XButton, Checklist, Radio } from "vux";
var operatorData = JSON.parse(localStorage.getItem("operatorUserItem"));
export default {
  components: {
    XInput,
    Group,
    XButton,
    Checklist,
    Radio
  },
  data() {
    return {
      oldPassword    : null,
      password       : null,
      confirmPassword: null,
      personInfo     : {}
    };
  },
  mounted() {
    this.$store
      .dispatch("AC_ManageAccountInfo", {
        accountid: operatorData.accountid
      })
      .then(res => {
        this.personInfo = res.data.item;
      });
  },
  methods: {
    commit() {
      this.$store
        .dispatch("AC_UpdatePassword", {
          item: {
            mainid     : this.personInfo.mainid,
            password   : this.oldPassword,
            newpassword: this.password
          }
        })
        .then(res => {
          if (res.data.returnResult == 1) {
            this.$store.commit("UPDATE_TOAST", "修改成功");
            this.$router.go(-1);
          } else if (res.data.returnResult == 2) {
            this.$store.commit("UPDATE_TOAST", "原密码错误");
          } else {
            this.$store.commit("UPDATE_TOAST", "修改失败");
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.group1 {
  .weui-cell {
    padding: 34 / @width75;
    input {
      position: relative;
      top     : 3 / @width75;
    }
  }

  .weui-cell_access .weui-cell__ft:after {
    width : 16 / @width75;
    height: 16 / @width75;
  }
}
.group2 {
  margin: 99 / @width75 39 / @width75;
  .weui-btn {
    border-radius: 44 / @width75;
    background   : #35bab6 !important;
    width        : 8.98666667rem;
    height       : 1.17333333rem;
    text-align   : center;
    line-height  : 1.17333333rem;
    background   : #35bab9;
    color        : #fff;
    border-radius: 0.58666667rem;
    font-size    : 0.48rem !important;
  }
}
</style>
<style lang="less">
@width75: 75rem;
.change-password .group1 .weui-cells {
  //   margin-top: 0;
  .weui-label {
    color      : black;
    position   : relative;
    top        : 3 / @width75;
    font-weight: bold;
  }
  .weui-input {
    text-align: left;
    font-size : 28 / @width75;
    color     : rgb(102, 102, 102);
  }
}
</style>


