<template>
  <div>
    <div v-transfer-dom>
      <confirm
        v-model="isunbound"
        :title="$t('device.tips')"
        :confirm-text="$t('device.determine')"
        :cancel-text="$t('device.cancel')"
        @on-confirm="onBound"
      >
        <p class="text-center">{{$t("up.unbound")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="ismeter"
        :title="$t('device.tips')"
        :confirm-text="$t('device.determine')"
        :cancel-text="$t('device.cancel')"
        @on-confirm="onMeter"
      >
        <p class="text-center">{{$t("up.nometer")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="isdevice"
        :title="$t('device.tips')"
        :confirm-text="$t('device.determine')"
        :cancel-text="$t('device.cancel')"
        @on-confirm="onDevice"
      >
        <p class="text-center">{{$t("up.device")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="isadd"
        :title="$t('device.tips')"
        :confirm-text="$t('device.determine')"
        :cancel-text="$t('device.cancel')"
        @on-confirm="onConfirm"
      >
        <p class="text-center">{{$t("up.noadd")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="isbmeter"
        :title="$t('device.tips')"
        :confirm-text="$t('device.determine')"
        :cancel-text="$t('device.cancel')"
        @on-confirm="onBmeter"
      >
        <p class="text-center">{{$t("up.unbmeter")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="isuser"
        :title="$t('device.tips')"
        :confirm-text="$t('device.determine')"
        :cancel-text="$t('device.cancel')"
        @on-confirm="onUser"
      >
        <p class="text-center">{{$t("up.home")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="isbmeterT"
        :title="$t('device.tips')"
        :confirm-text="$t('device.determine')"
        :cancel-text="$t('device.cancel')"
        @on-confirm="onBmeterT"
      >
        <p class="text-center">{{$t("up.unbmeter")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="isabnormal"
        :title="$t('device.tips')"
        :confirm-text="$t('device.determine')"
        :cancel-text="$t('device.cancel')"
        @on-confirm="onAbnormal"
      >
        <p class="text-center">{{$t("up.unbmeter")}}</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import {
  Confirm,
  TransferDom
} from "vux";
import api from "../api/Piles.js";
import wechat from "../tools/wechat";
var userItem = JSON.parse(localStorage.getItem("userItem"));
  export default {
    data () {
      return {
        sgincode:"",
        type:"",
        data:{}, //用户信息数据
        isunbound:false, //房东未绑定管理凭条
        ismeter:false, //房东未添加该电表
        isdevice:false, //跳转到设备管理
        isadd:false,  //用户未减价电表，联系房东添加
        isbmeter:false, //用户为绑定过电表
        isbmeterT:false, //用户为添加电表
        isuser:false, //用户首页
        isabnormal:false
      }
    },
    beforeCreate() {
      // 是否关注
      if (userItem != null) {
        var user = wechat.getSubscribe(userItem.appid, userItem.openid);  //获取返回值
        //promsie里压根就读不到this，也就是说取不到全局变量，这就是作用域问题了
        //我们在promise外面定义let _this =this ，然后在promise里使用_this就好了
        let _this = this;  
        user.then(function(userInfo) {
          if (userInfo.subscribe == 0) {
            _this.$router.push("/aboutpublic");
          }
        });
      } else {
        this.$router.push("/loginBlank");
      }
      
    },
    mounted(){
      this.sgincode=this.$route.params.code;
      this.type=this.$route.params.type;
      this.getChatBandInfo();
      if (userItem == null) {
        wechat.wxAuthJumpblank();
      }else{
        setTimeout(() => {
          this.getQroceStatus();
        }, 1000);
      }
    },
    components: {
      Confirm
    },
    directives: {
      TransferDom
    },
    methods:{
      getQroceStatus(){
        api.getQroceStatus({
          sgincode:this.sgincode,
          qrcodetype:this.type,
          chatid:userItem.openid
        }).then(res=>{
          if(this.type==1){
            if(res.data.qrcodeManageStatus==1){
              this.isunbound=true;
            }else if(res.data.qrcodeManageStatus==2){
              this.ismeter=true;
            }else if(res.data.qrcodeManageStatus==3){
              this.isdevice=true;
            }else if(res.data.qrcodeManageStatus==0){
              this.isabnormal=true;
            }
          }else if(this.type==2){
            if(res.data.qrcodeStatus==1){
              this.isadd=true;
            }else if(res.data.qrcodeStatus==2){
              this.isbmeter=true;
            }else if(res.data.qrcodeStatus==3){
              this.isuser=true;
            }else if(res.data.qrcodeStatus==4){
              this.isbmeterT=true;
            }else if(res.data.qrcodeStatus==0){
              this.isabnormal=true;
            }
          }
        })
      },
      onConfirm(){},
      // 未绑定去注册
      onBound(){
        this.$router.push("/upOpreator")
      },
      // 未添加该电表
      onMeter(){
        this.$router.push(`/scanAdd/${this.sgincode}`)
      },
      // 去设备页
      onDevice(){
        this.$router.push("/manageDevice")
      },
      // 去绑定电表
      onBmeter(){
        this.$router.push("/instrument")
      },
      // 跳转用户首页
      onUser(){
        this.$router.push("/meterLow")
      },
      // 去绑定电表
      onBmeterT(){
        this.$router.push({ 
          path: "/manageinstr" ,
          query:{
            chatname:JSON.stringify(this.data.chatname),
            phone:JSON.stringify(this.data.phone)
          }
        });
      },
      onAbnormal(){
        this.$router.push("/abnormal")
      },
      // 获取信息
      getChatBandInfo(){
        api.GetChatBandInfo({chatid: userItem.openid}).then(res=>{
          this.data=res.data;
        })
      }
    },
  }
</script>

<style lang='less'>
@width75: 75rem;
.weui-dialog {
  max-width: 540 / @width75!important;
  border-radius: 20 / @width75!important;
  overflow: hidden;
}
.weui-dialog__hd .weui-dialog__title {
  font-size: 36 / @width75!important;
  letter-spacing: 4px;
  font-weight: bolder;
}
.weui-dialog__bd .text-center {
  color: #030303 !important;
  line-height: 40 / @width75;
  font-size: 30 / @width75!important;
}

.weui-dialog__ft {
  line-height: 88 / @width75!important;
  height: 88 / @width75!important;
}

.weui-dialog__ft .weui-dialog__btn {
  line-height: 88 / @width75!important;
  height: 88 / @width75!important;
  font-size: 34 / @width75!important;
  color: #007aff;
}

.weui-dialog .vux-label {
  padding-top: 36 / @width75;
  line-height: 50 / @width75;
  height: 50 / @width75;
  font-size: 36 / @width75;
}

.weui-dialog .weui-cell:before {
  display: none;
}

.weui-dialog .weui-progress__bar {
  height: 10 / @width75!important;
}

.weui-dialog .vux-close {
  width: 120 / @width75!important;
  height: 40 / @width75!important;
  display: inline-block;
  line-height: 40 / @width75!important;
  font-size: 36 / @width75!important;
  letter-spacing: 4px;
  color: #007aff;
  margin-bottom: 40 / @width75!important;
}
.weui-toast__content {
  height: 150 / @width75;
  line-height: 150 / @width75;
  font-size: 40 / @width75;
}
</style>
