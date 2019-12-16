<!-- 添加新的设备 -->
<template>
  <div class="eleedit">
    <group class="edit">
      <cell :title="$t('device.electricnumber')" :value="deviceData.devicecode" value-align="left"></cell>
      <cell :title="$t('scan.sn')" :value="deviceData.sncode" value-align="left"></cell>
    </group>
    <group class="edit">
      <x-input :title="$t('barIndex.room')" v-model="metername" :placeholder="$t('equip.room')"></x-input>
      <x-input :title="$t('equip.alarm')" v-model="alarmenergy" :placeholder="$t('equip.fillalarm')"></x-input>
      <!-- <cell title="选择电价" :value="elePrice" is-link @click.native="showPrice"></cell> -->
      <popup-radio :title="$t('equip.eleprice')" :options="radios" v-model="elePrice">
        <p slot="popup-header" class="vux-1px-b demo3-slot">{{$t("scan.choose")}}</p>
      </popup-radio>
    </group>
    <group class="edit">
      <cell
        :title="$t('scan.more')"
        is-link
        :border-intent="false"
        :arrow-direction="showMore ? 'up' : 'down'"
        @click.native="showMore = !showMore"
      ></cell>
      <p class="slide" :class="showMore?'animate':''">
        <group label-width="4.5em" label-margin-right="2em" label-align="right">
          <cell :title="$t('scan.manufacturer')"  value-align="left">{{deviceData.factorytype}}</cell>
          <cell :title="$t('scan.meter')"  value-align="left">{{deviceData.metertype}}</cell>
          <cell :title="$t('scan.voltage')"  value-align="left">{{deviceData.ratedvoltage}}V</cell>
          <cell :title="$t('scan.current')"  value-align="left">{{deviceData.ratedcurrent}}A</cell>
          <cell :title="$t('scan.maxicurrent')"  value-align="left">{{deviceData.maxcurrent}}A</cell>
          <cell :title="$t('scan.productime')"  value-align="left">{{deviceData.createdate}}</cell>
        </group>
      </p>
    </group>
    <button @click="transform()" class="Bindingins-trument">{{$t("device.determine")}}</button>
    <div v-if="showToast" class="dialog-demo">
        <div v-for="(item, index) in radios" :key="index" class="box">
            <input type="radio" :value="item.value"  @click="onCheck(item)" ><span style="margin-left:16px">{{item.value}}{{$t("record.yuank")}}</span>
        </div>
    </div>
    <div v-transfer-dom>
      <confirm v-model="meternameshow" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("equip.fillroom")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="alarmenergyshow" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("equip.fillalarm")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="priceshow" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("equip.chooseprice")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="exist" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("equip.exists")}}</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Group, XInput, Cell, Radio, TransferDom,Confirm,PopupRadio } from "vux";
import api from "../../api/Piles.js";
var id = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
export default {
  data() {
    return {
      radios: [], //电价
      commaddress:"", //电表编号
      alarmenergy: 20, //告警阀值
      metername: "", //房间号
      showMore: false,
      showToast:false,
      elePrice:1, //电价
      sgincode:'', //扫码参数
      deviceData:{},
      meternameshow:false, //提示框
      priceshow:false, //选择电价
      alarmenergyshow:false, //告警阀值提示
      exist:false //已存在提醒
    };
  },
  directives: {
    TransferDom
  },
  components: {
    Group,
    XInput,
    Cell,
    Radio,
    TransferDom,
    Confirm,
    PopupRadio
  },

  computed: {},

  mounted() {
    this.sgincode=this.$route.params.id;
    this.getPricelist();
    this.getBeeQrcodeInfo()
  },

  methods: {
    //   获取全部电价
    getPricelist() {
      api.GetPriceList({ accountid: id }).then(res => {
        this.priceList = res.data.listitem;
        this.priceList.forEach((val, key) => {
          this.radios.push(val.pricevalue);
        });
      });
    },
    // 通过参数获取电表信息
    getBeeQrcodeInfo(){
        api.getBeeQrcodeInfo({sgincode:this.sgincode}).then(res=>{
            this.deviceData=res.data.item
            this.commaddress=this.deviceData.devicecode;
        })
    },
    // 确定事件
    transform: function(event) {
      var _this = this;
      var metername = this.metername;
      var commaddress = this.commaddress;
      var alarmenergy = this.alarmenergy;
      var radioData = this.elePrice;
      //    判断只能是8位数字的正则表达式
      console.log(radioData)
      var re1 = /^\d{8}$/;
      if (metername == "") {
        this.meternameshow = true;
      } else if (commaddress == "" || !re1.test(commaddress)) {
        this.commaddressshow = true;
      } else if (alarmenergy == "") {
        this.alarmenergyshow = true;
      } else if (radioData == 0) {
        this.priceshow = true;
      } else {
        this.$store
          .dispatch("AC_addDevInfo", {
            accountid: id,
            commaddress: this.commaddress,
            metername: this.metername,
            alarmenergy: this.alarmenergy,
            priceid: this.elePrice
          })
          .then(res => {
            if (res.data.returncode == 1) {
              this.$router.push({ path: "/manageDevice" });
            } else if (res.data.returncode == 4) {
              this.exist = true;
            }
          });
      }
    },
    // 确定事件（只是个形式）
    onConfirm() {},
    // 选择电价
    showPrice(){
        this.showToast=true;
    },
    // 选择电价
    onCheck(item) {
        this.elePrice = item.value;
        this.showToast=false;
    },
    onChange (val) {
      console.log('val change', val)
    },
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.eleedit {
  .slide {
    //   padding: 0 20px;
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
  }
  .animate {
    max-height: 9999px;
    transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    transition-delay: 0s;
  }
  .Bindingins-trument {
    display: block;
    width: 672 / @width75;
    height: 75 / @width75;
    text-align: center;
    line-height: 75 / @width75;
    background: #35bab6;
    border-radius: 44 / @width75;
    font-size: 34 / @width75 !important;
    color: #ffffff;
    margin: 75 / @width75 auto 0;
  }
  .dialog-demo{
      width: 100%;
      height:100%;
      position: fixed;
      z-index: 999;
      top:0;
      left:0;
      background:rgba(0, 0, 0, .6);
      display: flex;
      justify-content: center;
      align-items:center;
      .box{
          width: 300/@width75;
          background: #fff;
          padding: 30/@width75;
          font-size: 30/@width75;
      }
  }
}
.demo3-slot {
  text-align: center;
  padding: 26/@width75 0;
  font-size: 30/@width75;
  color: #888;
}
</style>
<style lang="less" >
@width75: 75rem;
.weui-check__label{
  padding:20/@width75 10/@width75 !important;
  font-size:34/@width75;
}
.edit {
  .weui-cells__title {
    height: 68 / @width75;
    line-height: 68 / @width75;
    padding: 7 / @width75 0 6 / @width75;
    padding-left: 10 / @width75;
    margin: 0;
  }
  .weui-cell {
    padding: 24 / @width75 38 / @width75;
    font-size: 28 / @width75;
  }
  .vux-label {
    width: 200 / @width75;
    font-size: 32 / @width75;
    // margin-right: 40 / @width75;
  }
  .weui-cell__ft {
    color: #000;
    font-size: 32 / @width75;
  }
  .weui-label {
    font-size: 32 / @width75;
    width: 200 / @width75 !important;
  }
  .weui-input {
    font-size: 32 / @width75;
    padding-left: 0;
  }
  .weui-cell__hd {
    label {
      color: black;
    }
  }
}
.slide {
  .weui-cells {
    margin-top: 0;
  }
  .vux-label {
    text-align: left !important;
  }
}
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
</style>
