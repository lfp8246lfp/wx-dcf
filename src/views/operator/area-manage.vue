<template>
    <div class="area-manage">
        <div class="group1">
            <selector title="区域" :options="list" v-model="value" placeholder="请选择" @on-change="changeArea"></selector>
        </div>
        <group class="location">
            <checklist title="地点列表" :options="areaList" v-model="selectArea" :max="1" @on-change="areaClick"></checklist>
        </group>
        <tabbar style="position:fixed;">
            <tabbar-item @click.native="addArea">
                <img slot="icon" src="./../../assets/icon/xinzeng@2x.png">
                <span slot="label">新增</span>
            </tabbar-item>
            <tabbar-item @click.native="updateArea">
                <img slot="icon" src="./../../assets/icon/bianji@2x.png">
                <span slot="label">编辑</span>
            </tabbar-item>
            <tabbar-item @click.native="deleteArea">
                <img slot="icon" src="./../../assets/icon/shanchu@2x.png">
                <span slot="label">删除</span>
            </tabbar-item>
        </tabbar>
        <div v-transfer-dom>
            <confirm v-model="confirmDel" title="删除提示" @on-confirm="confirmClick">
                <p style="text-align:center;">确认删除？</p>
            </confirm>
        </div>
        <div v-transfer-dom>
            <popup v-model="showPop">
                <div class="popup0">
                    <group title="区域维护" class="name" style="height:80px" >
                        <x-input title="区域名称" v-model="pickAreaItem.disc" type="text"></x-input>
                    </group>
                    <div class="group2">
                        <x-button @click.native="submit" :gradients="['#1D62F0', '#19D5FD']">提交</x-button>
                    </div>

                </div>
            </popup>
        </div>
    </div>
</template>

<script>
import {
  XButton,
  XInput,
  Selector,
  Group,
  Tabbar,
  TabbarItem,
  Checklist,
  Confirm,
  TransferDom,
  Popup
} from "vux";
var operatorData = JSON.parse(localStorage.getItem("operatorUserItem"));
export default {
  directives: {
    TransferDom
  },
  components: {
    XButton,
    XInput,
    Selector,
    Group,
    Tabbar,
    TabbarItem,
    Checklist,
    Confirm,
    TransferDom,
    Popup
  },
  data() {
    return {
      showPop     : false,
      confirmDel  : false,
      areaList    : [],
      selectArea  : [],
      list        : [],
      pickAreaItem: {
        lineid        : null,
        disc          : "",
        powersupplyid1: null
      },
      value  : null,
      optType: null
    };
  },
  mounted() {
    this.$store
      .dispatch("AC_GetCityInfo", {
        accountid: operatorData.accountid
      })
      .then(res => {
        this.list = [];
        for (let item of res.data.listitem) {
          this.list.push({
            key  : item.powersupplyid,
            value: item.disc
          });
        }
        this.value = this.list[0].key;
      });
  },
  methods: {
    submit() {
      if (this.optType == 1) {
        this.pickAreaItem.powersupplyid1 = this.value;
        delete this.pickAreaItem.lineid;
        this.OptAreaInfo();
      } else {
        this.OptAreaInfo();
      }
    },
    changeArea(value) {
      if (value > 0) {
        this.GetAreaInfo();
      }
    },

    areaClick(value, label) {
      if (value[0]) {
        for (let item of this.areaList) {
          if (value[0] == item.key) {
            this.pickAreaItem = {
              lineid        : item.key,
              disc          : item.value,
              powersupplyid1: item.powersupplyid1
            };
          }
        }
      }
    },
    confirmClick() {
      this.OptAreaInfo();
    },
    addArea() {
      this.pickAreaItem.disc = "";
      this.optType           = 1;
      if (this.value != null) {
        this.showPop = true;
      } else {
        this.$store.commit("UPDATE_TOAST", "请选择区域");
      }
    },

    updateArea() {
      this.optType = 2;
      if (this.selectArea[0]) {
        this.showPop = true;
      } else {
        this.$store.commit("UPDATE_TOAST", "请选择地点");
      }
    },
    deleteArea() {
      this.optType = 3;
      if (this.selectArea[0]) {
        this.confirmDel = true;
      } else {
        this.$store.commit("UPDATE_TOAST", "请选择地点");
      }
    },
    GetAreaInfo() {
      this.$store
        .dispatch("AC_GetAreaInfo", {
          objId: this.value
        })
        .then(res => {
          this.areaList = [];
          for (let item of res.data.listitem) {
            this.areaList.push({
              key           : item.lineid,
              value         : item.disc,
              powersupplyid1: item.powersupplyid1
            });
          }
        });
    },
    OptAreaInfo() {
      this.$store
        .dispatch("AC_OptAreaInfo", {
          optType  : this.optType,
          accountid: operatorData.accountid,
          obj      : this.pickAreaItem
        })
        .then(res => {
          if (res.data.returnResult == 1) {
            this.$store.commit("UPDATE_TOAST", "操作成功");
            this.GetAreaInfo();
            this.showPop = false;
          } else {
            this.$store.commit("UPDATE_TOAST", "操作失败");
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.area-manage {
  background: #ffffff;
  .group1 {
    padding    : 34 / @width75 34 / @width75 0 34 / @width75;
    height     : 92 / @width75;
    line-height: 92 / @width75;
  }
}
</style>
<style lang="less">
@width75: 75rem;
.popup0 .weui-btn {
  border-radius: 44 / @width75;
  background   : #35bab6 !important;
  width        : 8.98666667rem;
  height       : 1.17333333rem;
  text-align   : center;
  line-height  : 1.17333333rem;
  background   : #35bab9;
  color        : #fff;
  border-radius: 0.58666667rem;
  margin-bottom: 39 / @width75;
  font-size    : 0.48rem !important;
}
.popup0 .weui-cells__title {
  font-size  : 28 / @width75;
  margin-left: 19 / @width75;
}
.popup0 .weui-label {
  font-size  : 32 / @width75;
  margin-left: 19 / @width75;
}
.area-manage .group1 .weui-cell__bd {
  text-align: right;
}
.area-manage .group1 .weui-label {
  color      : black;
  position   : relative;
  font-size  : 28 / @width75;
  top        : 3 / @width75;
  font-weight: bold;
}
.area-manage .group1 .weui-select {
  text-align: right;
  font-size : 28 / @width75;
  color     : rgb(102, 102, 102);
}
.area-manage .location .weui-cells__title {
  height     : 70 / @width75;
  line-height: 70 / @width75;
  font-size  : 24 / @width75;
  margin     : 0 0 0 24 / @width75;
}
.area-manage .location .weui-check_label {
  height: 94 / @width75;
  margin: 0 0 0 24 / @width75;
}
.area-manage .name .weui-cells__title {
  height: 150 / @width75 !important;
}
</style>




