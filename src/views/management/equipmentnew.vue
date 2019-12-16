<!-- 添加新的设备 -->
<template>
  <div class="eleedit">
    <group class="edit">
      <div @click="toPickMeter" id="toPickMeter">
        选择已有的电表
        <i>></i>
      </div>
      <x-input :title="$t('barIndex.room')" v-model="metername" :placeholder="$t('equip.room')"></x-input>
      <x-input :title="$t('device.electricnumber')" v-model="commaddress" :placeholder="$t('equip.meter')"></x-input>
      <x-input title="状态" v-model="existing" disabled></x-input>
      <!-- 告警阀值 -->
      <x-input :title="$t('equip.alarm')" v-model="alarmenergy" disabled></x-input>
    </group>
    <group :title="$t('equip.eleprice')" class="edit new">
      <radio :options="radio001" v-model="radioData"></radio>
    </group>
    <x-button @click.native="eleedit" class="eleedit-btn">{{$t("device.determine")}}</x-button>
    <div v-transfer-dom>
      <confirm v-model="meternameshow" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("equip.fillroom")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="commaddressshow" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("equip.fillmeter")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="alarmenergyshow" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("equip.alarm")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="exist" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("equip.exists")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="priceshow" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("equip.chooseprice")}}</p>
      </confirm>
    </div>
    <toast v-model="showToast" type="text" :time="800" is-show-mask :text="toastText" width="20em"></toast>
  </div>
</template>

<script>
import { Group, XButton, XInput, Cell, Radio, TransferDom, Confirm, Toast } from "vux";

import api from "../../api/Piles.js";
const accountid = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
export default {
  data() {
    return {
      meternameshow: false, //房间号提示
      commaddressshow: false, //电表编号提示
      alarmenergyshow: false, //告警阀值提示
      priceshow: false, //电价图示
      exist: false, //存在提示
      radio001: [],
      radioData: "",
      commaddress: "", //电表编号
      metername: "", //房间号
      alarmenergy: 20,
    //   elePrice: "",
      show: "", //按钮切换
      items: "", //传递过来的数据
      isExisting: null,
      existing: '新增',
      toastText: '',
      showToast: false,
    };
  },
  directives: {
    TransferDom
  },

  components: {
    Group,
    XButton,
    XInput,
    Cell,
    Radio,
    Confirm,
    TransferDom,
    Toast
  },

  watch: {
    isExisting(val) {
      this.existing = val === 1 ? '新增' : '已存在'
    }
  },

  mounted() {
    // if (Object.keys(this.$route.params).length != 0) {
    //   this.commaddress = this.$route.params.id;
    // } else {
    //   this.commaddress = "";
    // }
    this.getPricelist()

    // 选择已存在电表后
    let meter = this.$route.params
    console.log(meter, 'meter')
    if (meter.commAddress) {
      this.metername = meter.disc
      this.commaddress = meter.commAddress
      this.isExisting = 1
      this.radioData = meter.priceId
    } else {
      this.isExisting = null
    }
  },

  methods: {
    //   获取全部电价
    getPricelist() {
      api.GetPriceList({ accountid }).then(res => {
        console.log(res, '电价')
        this.priceList = res.data.listitem;
        this.priceList.forEach((val, key) => {
          this.radio001.push({
            value: val.pricevalue,
            key: val.priceid
          });
        });
      });
    },
    // 确定事件
    eleedit: function(event) {
      // var _this = this;
      // var metername = this.metername;
      // var commaddress = this.commaddress;
      // var alarmenergy = this.alarmenergy;
      // var radioData = this.radioData;
      // //    判断只能是8位数字的正则表达式
      // var re1 = /^\d{8}$/;
      // if (metername == "") {
      //   this.meternameshow = true;
      // } else if (commaddress == "" || !re1.test(commaddress)) {
      //   this.commaddressshow = true;
      // } else if (alarmenergy == "") {
      //   this.alarmenergyshow = true;
      // } else if (this.radioData == "") {
      //   this.priceshow = true;
      // } else {
      //   this.$store
      //     .dispatch("AC_addDevInfo", {
      //       accountid: id,
      //       commaddress: this.commaddress,
      //       metername: this.metername,
      //       alarmenergy: this.alarmenergy,
      //       priceid: this.radioData
      //     })
      //     .then(res => {
      //       if (res.data.returncode == 1) {
      //         this.$router.push({ path: "/manageDevice" });
      //       } else if (res.data.returncode == 4) {
      //         this.exist = true;
      //       }
      //     });
      // }
      let id = this.$route.params.roomid
      let obj = {
	      id,
	      accountid,
	      metername: this.metername,
	      commaddress: this.commaddress,
	      priceid: this.radioData,
        alarmenergy: this.alarmenergy,
        isExisting: this.isExisting
      }
      api.addWifiDevInfo(obj).then(res => {
        console.log(res, '新增wifi表')
        this.toastText = "添加成功"
        this.showToast = true
        this.$router.push({
          name: 'manageDevice',
          params: {id}
        })
      })
    },
    toPickMeter() {
      let roomid = this.$route.params.roomid
      console.log(roomid, 'roomid')
      this.$router.push({
        name: 'pickMeter',
        params: {roomid}
        // 当前房间的id
      })
    },
    // 确定事件（只是个形式）
    onConfirm() {}
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.eleedit {
  .eleedit-btn {
    width: 674 / @width75;
    height: 88 / @width75;
    line-height: 88 / @width75;
    background: #35bab7;
    color: #fff;
    text-align: center;
    margin: 60 / @width75 auto;
    border-radius: 44 / @width75;
    font-size: 36 / @width75 !important;
  }
}
</style>
<style lang="less" >
@width75: 75rem;
.edit {
  .weui-cells {
    margin-top: 0;
  }
  .weui-cells__title {
    height: 68 / @width75;
    line-height: 68 / @width75;
    padding: 7 / @width75 0 6 / @width75;
    padding-left: 38 / @width75;
    margin: 0;
  }
  .weui-cell {
    padding: 24 / @width75 38 / @width75;
    font-size: 28 / @width75;
  }
  .vux-label {
    width: 200 / @width75;
    font-size: 32 / @width75;
    margin-right: 40 / @width75;
  }
  .weui-cell__ft {
    color: #000;
    font-size: 32 / @width75;
  }
  .weui-label {
    font-size: 32 / @width75;
    width: 275 / @width75 !important;
    margin-right: 40 / @width75;
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
.new {
  .weui-cells__title {
    height: 48 / @width75;
    line-height: 48 / @width75;
    padding: 7 / @width75 0 6 / @width75;
    padding-left: 38 / @width75;
    margin: 0;
    font-size: 32 / @width75;
  }
}
.vux-x-dialog .weui-mask {
  z-index: 500 !important;
}

.weui-dialog {
  max-width    : 540 / @width75!important;
  border-radius: 20 / @width75!important;
  overflow     : hidden;
}
.weui-dialog__hd .weui-dialog__title {
  font-size     : 36 / @width75!important;
  letter-spacing: 4px;
  font-weight   : bolder;
}

.weui-dialog__bd .text-center {
  color      : #030303 !important;
  line-height: 40 / @width75;
  font-size  : 30 / @width75!important;
}

.weui-dialog__ft {
  line-height: 88 / @width75!important;
  height     : 88 / @width75!important;
}

.weui-dialog__ft .weui-dialog__btn {
  line-height: 88 / @width75!important;
  height     : 88 / @width75!important;
  font-size  : 34 / @width75!important;
  color      : #007aff;
}
.vux-cell-bd {
  .vux-label {
    width: 300 / @width75!important;
  }
}
#toPickMeter {
  position: relative;
  background-color: #fff;
  height: 88 / @width75;
  padding-left: 36 / @width75;
  line-height: 88 / @width75;
  font-size: 32 / @width75;
  i {
    position: absolute;
    right: 50 / @width75;
    top: 50%;
    transform: translate(0, -50%);
    font-family: serif;
  }
}

</style>
