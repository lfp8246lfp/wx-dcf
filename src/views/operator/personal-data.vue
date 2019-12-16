<template>
  <div class="personal-data">
    <group class="group1">
      <x-input title="登录账号" v-model="personInfo.accountid" readonly></x-input>
      <x-input title="创建时间" v-model="createdTime" readonly></x-input>
      <x-input title="昵称" v-model="personInfo.accountname"></x-input>
      <x-input title="电话" v-model="personInfo.phone"  type="tel" :max="13" is-type="china-mobile"></x-input>
    </group>

    <group title="性别" class="group1">
      <radio :options="sexList" v-model="personInfo.sex" :selected-label-style="{color: '#FF9900'}"></radio>
    </group>
    <div class="group2">
      <x-button @click.native="commit" :gradients="['#1D62F0', '#19D5FD']">提交</x-button>
    </div>
  </div>
</template>
<script>
import { XInput, Group, XButton, Checklist, Radio } from "vux";
import { format } from "date-fns";

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
      sexList: [
        {
          key  : "1",
          value: "男"
        },
        {
          key  : "0",
          value: "女"
        }
      ],

      personInfo: {}
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
    formatTime(val) {
      return format(val, "YYYY-MM-DD HH:mm:ss");
    },
    commit() {
      this.$store
        .dispatch("AC_UpdateAccountInfo", {
          item: {
            mainid     : this.personInfo.mainid,
            accountid  : this.personInfo.accountid,
            accountname: this.personInfo.accountname,
            status     : this.personInfo.status,
            createtime : this.createdTime,
            phone      : this.personInfo.phone,
            sex        : this.personInfo.sex
          }
        })
        .then(res => {
          console.log(res.data.returnResult);
          if (res.data.returnResult == 1) {
            this.$store.commit("UPDATE_TOAST", "修改成功");
            this.$router.go(-1);
          } else {
            this.$store.commit("UPDATE_TOAST", "修改失败");
          }
        });
    }
  },
  computed: {
    createdTime: {
      get: function() {
        return this.formatTime(this.personInfo.createtime);
      },
      set: function(newVal) {
        console.log(newVal);
      }
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.personal-data .group1 {
  .weui-cell {
    padding: 34 / @width75;
  }
}
</style>
<style lang="less">
@width75: 75rem;
.personal-data .group1 .weui-cells {
  //   margin-top: 0;
  .weui-label {
    color      : black;
    position   : relative;
    top        : 3 / @width75;
    font-weight: bold;
  }
  .weui-input {
    text-align: right;
    font-size : 28 / @width75;
    color     : rgb(102, 102, 102);
  }
}
.personal-data .group1 .weui-cells__title {
  padding: 16 / @width75 34 / @width75;
}
.personal-data .group1 .weui-cells_radio {
  padding: 0 19 / @width75;
}
.personal-data .group2 {
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

