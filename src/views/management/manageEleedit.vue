<!-- 电价管理编辑 -->
<template>
  <div class="eleedit">
    <!-- <group title="电价编辑" class="edit">
          <x-input title="电价名称"  v-model="eleName"></x-input>
          <x-input title="电价(元/kWh)"  v-model="elePrice" @on-change = "change" @on-blur = "tt" type="text"placeholder="请输入电价"></x-input>
    </group>-->
    <div class="newele">
      <div class="eletitle">{{$t('eleedit.priceediting')}}</div>
      <div class="elecontent">
        <span>{{$t("eleprice.pricename")}}</span>
        <input v-model="eleName" :placeholder="$t('eleedit.enterprice')">
      </div>
      <div class="elecontent">
        <span>{{$t("eleprice.price")}}</span>
        <input
          v-on:input="tt($event)"
          type="text"
          autocomplete="off"
          v-model="elePrice"
          :placeholder="$t('eleedit.electricityprice')"
        >
      </div>
    </div>
    <x-button @click.native="addedit" class="eleedit-btn" v-if="show==0">{{$t("eleprice.add")}}</x-button>
    <x-button @click.native="eleedit" class="eleedit-btn" v-else>{{$t("eleedit.save")}}</x-button>
    <div v-transfer-dom>
      <confirm v-model="show3" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("put.onenum")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="show4" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("eleedit.empty")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="show5" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("eleedit.priceempty")}}</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Group, XButton, XInput, Cell, TransferDom, Confirm } from "vux";

import api from "../../api/Piles.js";
var id = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
var a = "";
export default {
  directives: {
    TransferDom
  },
  data() {
    return {
      show3: false, //整数提示
      show4: false, //电价名提示
      show5: false, //电价提示
      eleName: "电价名称A", //电价名称
      elePrice: "", //电价价格
      show: "", //按钮切换
      items: "" //传递过来的数据
    };
  },

  components: {
    Group,
    XButton,
    XInput,
    Cell,
    Confirm
  },

  computed: {},
  watch: {},
  mounted() {
    this.show = this.$route.params.show; //根据传过来参数的不同显示不同的按钮
    if (JSON.stringify(this.$route.query) != "{}") {
      this.items = this.$route.query.id;
    } else {
      this.items = "";
    }
    this.eleName = this.items.pricename;
    this.elePrice = this.items.pricevalue;
    if (this.show == 0) {
      this.eleName = "";
      this.elePrice = "";
    }
  },

  methods: {
    //  输入的电价值
    tt: function(e) {
      a = e.target.value;
      var re1 = /^\d+(\.\d{0,1})?$|^\.\d{1,2}$/;
      if (a !== "") {
        if (!re1.test(a)) {
          this.show3 = true;
          this.elePrice = a.match(/^\d*(\.?\d{0,1})/g)[0];
        } else {
          this.elePrice = a;
        }
      }
    },

    //   保存修改电价
    eleedit() {
      if (this.eleName == "") {
        this.show4 = true;
      } else if (this.elePrice == "") {
        this.show5 = true;
      } else {
        api
          .PriceInfo({
            accountid: id,
            optType: 2,
            item: {
              pricename: this.eleName,
              pricevalue: this.elePrice,
              priceid: this.items.priceid,
              departmentid: this.items.departmentid
            }
          })
          .then(res => {
            if (res.msg == "success") {
              this.$router.back(-1);
            }
          });
      }
    },
    //   新增电价
    addedit() {
      if (this.eleName == "") {
        this.show4 = true;
      } else if (this.elePrice == "") {
        this.show5 = true;
      } else {
        api
          .PriceInfo({
            accountid: id,
            optType: 1,
            item: {
              pricename: this.eleName,
              pricevalue: this.elePrice
            }
          })
          .then(res => {
            if (res.msg == "success") {
              this.$router.back(-1);
            }
          });
      }
    },
    // 确定事件
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
  .newele {
    margin: 0 39 / @width75;
    font-size: 28 / @width75;
    .eletitle {
      margin: 10 / @width75 0;
      height: 40 / @width75;
      line-height: 40 / @width75;
    }
    .elecontent {
      display: flex;
      overflow: hidden;
      margin: 20 / @width75 0;
      height: 60 / @width75;
      line-height: 60 / @width75;
      span {
        width: 200 / @width75;
      }
      input {
        padding-left: 10 / @width75;
        text-align: center;
        width: 500 / @width75;
        border: 1px solid #fafafa;
        border-radius: 50 / @width75;
      }
    }
  }
}
</style>
<style lang="less" >
@width75: 75rem;
.edit {
  .weui-cells__title {
    height: 68 / @width75;
    line-height: 68 / @width75;
    padding: 7 / @width75 0 6 / @width75;
    padding-left: 38 / @width75;
    margin: 0;
    font-size: 28 / @width75;
    color: black;
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
    width: 200 / @width75 !important;
    margin-right: 40 / @width75;
  }
  .weui-input {
    font-size: 32 / @width75;
    padding-left: 0;
  }
}
</style>
