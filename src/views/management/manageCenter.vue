<!-- 个人中心 -->
<template>
  <div class="center">
    <div class="center-top">
      <div class="centeruser">
        <div class="img">
          <img src="../../assets/icon/Section/touixiang.png" alt>
        </div>
        <div>
          <h1>{{$t("barIndex.phone")}}</h1>
          <p>{{mycal.phoneNo}}</p>
        </div>
      </div>
      <div class="money">
        <router-link :to="{path:'/managePut'}">{{$t("barCenter.withdrawal")}}</router-link>
      </div>
      <h2>{{$t("personal.balance")}}</h2>
      <h3>
        <!-- <router-link to="/manageBalance" v-if="mycal.hasOwnProperty('restMoney')">{{mycal.restMoney}}</router-link>
        <router-link to="/manageBalance" v-else>0</router-link>-->
        <p v-if="mycal.hasOwnProperty('restMoney')">{{mycal.restMoney}}</p>
        <p v-else>0</p>
      </h3>
      <div class="usernum">
        <div>
          <h1>{{$t("barIndex.usernum")}}</h1>
          <p>
            <router-link to="/manageAccount">{{mycal.totalUsers}}</router-link>
          </p>
        </div>
        <div>
          <h1>{{$t("barCenter.normal")}}</h1>
          <p>
            <router-link to="/manageAccount/1">{{mycal.nomalUsers}}</router-link>
          </p>
        </div>
        <div>
          <h1>{{$t("barCenter.abnormal")}}</h1>
          <p>
            <router-link to="/manageAlarmuser">{{mycal.unusualUsers}}</router-link>
          </p>
        </div>
      </div>
    </div>
    <div class="center-btn">
      <group class="group1">
        <cell :title="$t('barCenter.device')" :is-link="true" @click.native="showType">
          <img
            slot="icon"
            width="16"
            style="display:block;margin-right:5px;"
            src="../../assets/icon/Section/device.png"
          >
        </cell>
        <cell :title="$t('barCenter.electriprice')" :is-link="true" :link="{path:'/manageEleprice'}">
          <img
            slot="icon"
            width="16"
            style="display:block;margin-right:5px;"
            src="../../assets/icon/Section/dianjiaguanli.png"
          >
        </cell>
        <cell :title="$t('barCenter.unbind')" @click.native="unbundling()" :is-link="true">
          <img
            slot="icon"
            width="16"
            style="display:block;margin-right:5px;"
            src="../../assets/unbundling@2x.png"
          >
        </cell>
      </group>
    </div>
    <div v-transfer-dom>
      <confirm v-model="unbundlingshow" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("barCenter.unbindcnt")}}</p>
      </confirm>
    </div>
    
      <x-dialog v-model="isShowType" class="dialog-demo" :dialog-style="{'background-color': '#F5F5F5',}">
          <img src="../../assets/muliti.png" class="close-image" @click="isShowType=false">
          <h1>选择档案类型</h1>
          <!-- <div class="itemdiv">
              <cell title="电表" :is-link="true" :link="{path:'/manageDevice'}">
                <img
                  slot="icon"
                  width="30"
                  style="display:block;margin-right:0px;"
                  src="../../assets/charging-wifi.png"
                >
              </cell>
          </div> -->
         <div class="itemdiv">
              <cell title="电瓶车充电桩" :is-link="true" :link="{path:'/chargeCar'}">
                <img
                  slot="icon"
                  width="30"
                  style="display:block;margin-right:0px;"
                  src="../../assets/charging-car.png"
                >
              </cell>
         </div>
         <div class="itemdiv">
            <cell title="房间" :is-link="true" :link="{path:'/manageRoom'}">
              <img
                slot="icon"
                width="30"
                style="display:block;margin-right:0px;"
                src="../../assets/room.png"
              >
            </cell>
         </div>
      </x-dialog>
  </div>
</template>

<script>
import { Cell, TransferDom, Confirm, Group, XDialog, XButton } from "vux";
import api from "../../api/Piles.js";
import wechat from "@/tools/wechat";
var id = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
var userItem = JSON.parse(localStorage.getItem("userItem"));
export default {
  data() {
    return {
      mycal: "", //数据
      unbundlingshow: false, //提示
      isShowType:false
    };
  },
  components: {
    Cell,
    TransferDom,
    Confirm,
    Group,
    XDialog,
    XButton
  },
  directives: {
    TransferDom
  },

  computed: {},

  mounted() {
    this.getMyCal();
  },

  methods: {
    //   获取用户信息
    getMyCal() {
      api.GetMyCalData({ accountid: id }).then(res => {
        this.mycal = res.data;
        if (this.mycal.restMoney == null) {
          this.mycal.restMoney = 0;
        }
        sessionStorage.setItem(
          "restMoney",
          JSON.stringify(this.mycal.restMoney)
        );
      });
    },
    // 确定事件
    onConfirm() {
      this.$store
        .dispatch("AC_unbandAccountInfo", { chatid: userItem.openid })
        .then(res => {
          if (res.returnCode !== 0) {
            this.$router.push("/personal");
          } else {
            //  console.log("1")
          }
        });
    },
    unbundling() {
      this.unbundlingshow = true;
    },
    showType(){
      this.isShowType=true;
    },
    
    goCharging:function(event){
      this.$router.push({ path: "devManagage" });
    },
    goWifi:function(event){
      this.$router.push({ path: "/manageDevice" });
    },
    refund() {

    },
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.dialog-demo {
  .close-image{
    float: right;
    margin-top: 34 / @width75;
    margin-right: 34 / @width75;
  }
  h1{
    padding-top: 0.48rem;
    line-height: 0.66666667rem;
    height: 0.66666667rem;
    font-size: 0.48rem;
  }
  .weui-cell {
    padding: 34 / @width75;
  }
  .weui-cell_access .weui-cell__ft:after {
    width: 16 / @width75;
    height: 16 / @width75;
  }
}
 .itemdiv{
    background-color: white;
    width: 90%;
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 20px;
  }
.center {
  background: #fafafa;
  padding-bottom: 125 / @width75;
}
.center-top {
  background: url("../../assets/icon/Section/bgimg.png");
  background-size: cover;
  background-color: #26c19f;
  padding: 36 / @width75 38 / @width75 50 / @width75;
  .money {
    width: 174 / @width75;
    height: 80 / @width75;
    text-align: center;
    line-height: 80 / @width75;
    background: #fff;
    color: #06a5bd;
    border-radius: 40 / @width75 0 0 40 / @width75;
    position: absolute;
    top: 36 / @width75;
    right: 0;
    font-size: 32 / @width75;
    // font-weight: bold;
  }
  .centeruser {
    display: flex;
    .img {
      padding: 2px;
      border: 6px solid #2dc0a3;
      border-radius: 50%;
      margin-right: 30 / @width75;
      margin-top: -12px;
      img {
        width: 60 / @width75;
        height: 60 / @width75;
        padding: 2px;
        border: 6px solid #41c0ad;
        border-radius: 50%;
      }
    }

    h1 {
      padding: 6 / @width75 0 7 / @width75;
      color: #b5efe6;
    }
    p {
      padding: 7 / @width75 0;
      color: rgba(180, 234, 222, 0.5);
    }
  }
  h2 {
    font-size: 26 / @width75;
    padding: 8 / @width75 0 7 / @width75;
    color: #aee2d8;
    margin-top: 20 / @width75;
  }
  h3 {
    font-size: 72 / @width75;
    // font-weight: bold;
    color: #fff;
    padding: 13 / @width75 0 12 / @width75;
    margin-top: 4 / @width75;
    a {
      color: #fff;
    }
  }
  .usernum {
    display: flex;
    margin-top: 38 / @width75;
    div {
      width: 224 / @width75;
      h1 {
        color: #aee2d8;
        padding: 9 / @width75 0 8 / @width75;
        margin-bottom: 4 / @width75;
      }
      p {
        font-size: 32 / @width75;
        padding: 8 / @width75 0;
        a {
          color: #fff;
        }
      }
    }
  }
}
</style>
<style lang="less" >
@width75: 75rem;
.group1 {
  .weui-cell {
    padding: 34 / @width75;
  }
  .weui-cell_access .weui-cell__ft:after {
    width: 16 / @width75;
    height: 16 / @width75;
  }
  .vux-cell-bd p{
    color: rgb(51, 51, 51);
  }
}
</style>
