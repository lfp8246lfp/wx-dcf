<template>
  <div class="my-center">
    <div class="header">
      <div>
        <img slot="icon" width="20" src="./../../assets/icon/Section/equipment @2x.png">
      </div>
      <div>
        <p class="one">{{personInfo.accountname}}</p>
        <p class="two">{{personInfo.phone}}</p>
      </div>
    </div>

    <div class="me-content">
      <group class="group1">
        <cell title="我的账号" :is-link="true" :link="{path:'/personalData'}">
          <img
            slot  = "icon"
            width = "20"
            style = "display:block;margin-right:5px;"
            src   = "./../../assets/icon/Section/wdzh@2x.png"
          >
        </cell>
        <cell title="区域管理" :is-link="true" :link="{path:'/areaManage'}">
          <img
            slot  = "icon"
            width = "20"
            style = "display:block;margin-right:5px;"
            src   = "./../../assets/icon/Section/qygl@2x.png"
          >
        </cell>
        <cell title="设备管理" :is-link="true" :link="{path:'/devManagage'}">
          <img
            slot  = "icon"
            width = "20"
            style = "display:block;margin-right:5px;"
            src   = "./../../assets/icon/Section/sbgl@2x.png"
          >
        </cell>
        <cell title="关于我们" :is-link="true" :link="{path:'/aboutUs'}">
          <img
            slot  = "icon"
            width = "20"
            style = "display:block;margin-right:5px;"
            src   = "./../../assets/icon/Section/about2X@2x.png"
          >
        </cell>
        <cell title="常见问题" :is-link="true" :link="{path:'/FAQ'}">
          <img
            slot  = "icon"
            width = "20"
            style = "display:block;margin-right:5px;"
            src   = "./../../assets/icon/Section/cjwt@2x.png"
          >
        </cell>
      </group>
    </div>
    <group>
      <router-link :to="{name: 'changePassword'}">
        <x-button @click.native="updatePassword" :gradients="['#1D62F0', '#19D5FD']">修改密码</x-button>
      </router-link>
    </group>
  </div>
</template>
<script>
import { Cell, Group, Blur, XButton } from "vux";
var operatorData = JSON.parse(localStorage.getItem("operatorUserItem"));
export default {
  components: {
    Cell,
    Group,
    Blur,
    XButton
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
  data: function() {
    return {
      imgUrl    : require("./../../assets/avatar.png"),
      personInfo: {}
    };
  },
  methods: {
    updatePassword() {}
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.my-center {
  margin: 0 39 / @width75;
  .header {
    height    : 335 / @width75;
    background: white;
    text-align: center;
    padding   : 20px;
    font-size : 28px;
    img {
      margin: 100 / @width75 0;
    }
    .one {
      font-size    : 32 / @width75;
      color        : black;
      font-weight  : bold;
      height       : 36 / @width75;
      margin-bottom: 13 / @width75;
    }
    .two {
      height   : 22 / @width75;
      font-size: 28 / @width75;
      color    : rgb(153, 153, 153);
    }
  }
  .center img {
    width        : 100px;
    height       : 100px;
    border-radius: 50%;
    border       : 4px solid #ececec;
  }
  .chongzhi {
    height: 100px;
    a {
      color      : greenyellow;
      display    : inline-block;
      height     : 100px;
      line-height: 100px;
      font-size  : 40px;
    }
    .icon {
      fill       : greenyellow;
      padding-top: 30px;
    }
  }

  .btn-group {
    margin-top: 50px;
    padding   : 0 40px;
  }
}
</style>
<style lang="less">
@width75: 75rem;
.group1 {
  .weui-cell {
    padding: 34 / @width75;
  }
  .weui-cell_access .weui-cell__ft:after {
    width : 16 / @width75;
    height: 16 / @width75;
  }
  // .weui-cells{
  //     border-bottom:1px solid #eeeeee;
  // }
}
</style>




