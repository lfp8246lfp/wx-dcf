
<template>
  <div class="eleedit">
    <group class="edit">
      <x-input :title="$t('barIndex.room')" v-model="metername"></x-input>
      <!-- 告警阀值 -->
      <!-- <x-input title="告警阀值" v-model="alarmenergy"></x-input> -->
    </group>
    <group :title="$t('equip.eleprice')" class="edit new">
      <radio :options="radio001" v-model="radioData"></radio>
    </group>
    <x-button @click.native="eleedit" class="eleedit-btn">{{$t("device.determine")}}</x-button>
  </div>
</template>

<script>
import { Group, XButton, XInput, Cell, Radio, TransferDom, Confirm } from "vux";

import api from "../../api/Piles.js";
var id = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
export default {
  data() {
    return {
        funditem   : "",
        radio001   : [], //单选数据
        radioData  : "",
        metername  : "",   //房间号
        alarmenergy: "", //告警阀值
        // elePrice   : "",
        show       : "",   //按钮切换
        items      : ""    //传递过来的数据
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
    TransferDom
  },

  computed: {},

  mounted() {
    this.funditem    = this.$route.query.funditem;
    this.metername   = this.funditem.metername;
    this.alarmenergy = this.funditem.alarmenergy;
    this.radioData   = this.funditem.priceid;
    this.getPricelist();
  },

  methods: {
    // 获取全部电价
    getPricelist() {
      api.GetPriceList({ accountid: id }).then(res => {
        this.priceList = res.data.listitem;
        this.priceList.forEach((val, key) => {
          this.radio001.push({
            value: val.pricevalue,
            key  : val.priceid
          });
        });
      });
    },
    // 确定事件
    eleedit: function(event) {
      this.$store
        .dispatch("AC_updateDevInfo", {
          rtuid      : this.funditem.rtuid,
          metername  : this.metername,
          alarmenergy: this.alarmenergy,
          priceid    : this.radioData
        })
        .then(res => {
          if (res.data.returncode == 1) {
            this.$router.push({ path: "/manageDevice" });
          }
        });
    }
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.eleedit {
  .eleedit-btn {
    width        : 674 / @width75;
    height       : 88 / @width75;
    line-height  : 88 / @width75;
    background   : #35bab7;
    color        : #fff;
    text-align   : center;
    margin       : 60 / @width75 auto;
    border-radius: 44 / @width75;
    font-size    : 36 / @width75 !important;
  }
}
</style>
<style lang="less" >
@width75: 75rem;
.edit {
  .weui-cells__title {
    height      : 68 / @width75;
    line-height : 68 / @width75;
    padding     : 7 / @width75 0 6 / @width75;
    padding-left: 38 / @width75;
    margin      : 0;
    color       : black;
  }
  .weui-cell {
    padding  : 24 / @width75 38 / @width75;
    font-size: 28 / @width75;
  }
  .vux-label {
    width       : 200 / @width75;
    font-size   : 32 / @width75;
    margin-right: 40 / @width75;
  }
  .weui-cell__ft {
    color    : #000;
    font-size: 32 / @width75;
  }
  .weui-label {
    font-size   : 32 / @width75;
    width       : 200 / @width75 !important;
    margin-right: 40 / @width75;
  }
  .weui-input {
    font-size   : 32 / @width75;
    padding-left: 0;
  }
  .weui-cell__hd{
      label{
           color: black;
      }
  }
}
.new {
  .weui-cells__title {
    height      : 48 / @width75;
    line-height : 48 / @width75;
    padding     : 7 / @width75 0 6 / @width75;
    padding-left: 38 / @width75;
    margin      : 0;
    font-size   : 32 / @width75;
  }
}
</style>
