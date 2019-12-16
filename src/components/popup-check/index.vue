<template>
  <group>
    <div class="index" v-for="(item, index) in currentValue" :key="index">
      <div slot="icon" @click="choose($event, item)">
        <icon type="success" style="color: #f8b62c;" v-show="item.select"></icon>
        <icon type="circle" v-show="!item.select"></icon>
      </div>
      <cell style="flex:1;padding-left:0;padding-right:10px;" :title="item.key" @click.native="show(item)" :key="index" :is-link="hasChildren(item)">
        {{item.value.value}}
        <div v-transfer-dom>
          <popup v-model="item.expand" :height="height">
            <div class="vux-popup-picker-container">
              <radio :value="item.value.key" :options="item.children" :fill-mode="false" @on-change="onValueChange"></radio>
            </div>
          </popup>
        </div>
      </cell>
      <div class="deductibles">
        <div v-if="item.deductibles" class="checkbox" :class="{ 'right' : item.deductibles.selected }" @click="selectDeductibles(item)">
          <div class="switch"></div>
        </div>
      </div>
    </div>
  </group>
</template>

<script>
import { Cell, Icon, Popup, Group, Radio, TransferDom } from "vux";
export default {
  components: {
    Popup,
    Radio,
    Cell,
    Icon,
    Group
  },
  directives: {
    TransferDom
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    height: {
      type: String,
      default: "auto"
    },
    value: [String]
  },
  data() {
    return {
      expandItem: "",
      selectItems: this.value,
      currentValue: []
    };
  },
  methods: {
    concatId() {
      let ret = this.currentValue.reduce((total, curr) => {
        if (curr.select) {
          if (!curr.deductibles) {
            total = total + "," + curr.value.key;
          } else {
            if (curr.deductibles.selected) {
              total = total + "," + curr.value.key + "," + curr.deductibles.key;
            } else {
              total = total + "," + curr.value.key;
            }
          }
        }
        return total;
      }, "");
      this.selectItems = ret.substring(1);
    },
    selectDeductibles(item) {
      if (!item.deductibles.selected) {
        item.select = item.deductibles.selected = true;
      } else {
        item.deductibles.selected = !item.deductibles.selected;
      }
      this.concatId();
    },
    choose(e, item) {
      e.stopPropagation();

      if (item.deductibles) {
        item.deductibles.selected = !item.select;
      }

      item.select = !item.select;
      this.concatId();
    },
    onValueChange(val) {
      console.log("val-----------", val);
      this.expandItem.expand = false;
      this.expandItem.children.forEach(item => {
        if (item.key === val) {
          this.expandItem.value = item;
        }
      });
      this.concatId();
    },
    hasChildren(item) {
      return item.children.length > 1;
    },
    show(item) {
      if (this.hasChildren(item)) {
        item.expand = true;
        this.expandItem = item;
      }
    },
    convert(arr) {
      let res = [];
      let ret = arr.reduce((total, curr) => {
        let id = curr.id;
        let name = curr.name;
        let value = curr.value;
        let isDefault = curr.isDefault == "true";
        if (!total[name]) {
          total[name] = [];
        }
        total[name].push({ key: id, isDefault: isDefault, value: value });
        return total;
      }, {});
      for (let key in ret) {
        let value = ret[key];
        let deductibles = {
          selected: false,
          key: ""
        };
        let valueDefault = "";

        for (let i = 0; i < value.length; i++) {
          if (value[i].value == "不计免赔") {
            deductibles.key = value[i].key;
            value.splice(i, 1);
          }
          if (value[i] && value[i].isDefault) {
            valueDefault = value[i];
          }
        }

        let item = {
          key: key,
          value: valueDefault == "" ? value[0] : valueDefault,
          select:
            valueDefault == "" ? value[0].isDefault : valueDefault.isDefault,
          isDefault:
            valueDefault == "" ? value[0].isDefault : valueDefault.isDefault,
          expand: false,
          children: value
        };

        if (deductibles.key) {
          if (item.select == true) deductibles.selected = true;
          item.deductibles = deductibles;
        }

        res.push(item);
      }
      return res;
    }
  },
  watch: {
    options(val) {
      this.currentValue = this.convert(val);
      this.concatId();
    },
    selectItems(val) {
      this.$emit("on-change", val);
      this.$emit("input", val);
    }
  }
};
</script>

<style lang="less">
.index {
  display: flex;
  padding: 0 15px;
  border-bottom: 1px solid #dfdfdf;
  align-items: center;
}

.weui-cells.vux-no-group-title {
  margin: 0 !important;
}
.weui-cell:before {
  width: 0;
}
.deductibles {
  width: 42px;
  height: 26px;
}

.checkbox {
  position: relative;
  width: 42px;
  height: 26px;
  border: 1px solid #dfdfdf;
  border-radius: 16px;
  background-color: #dfdfdf;
}
.checkbox .switch {
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: left 0.3s;
  background: #fff;
}

.right {
  border: 1px solid rgb(248, 182, 44);
  background-color: rgb(248, 182, 44);
}
.right .switch {
  left: 17px;
}
</style>