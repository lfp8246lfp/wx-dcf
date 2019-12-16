<template>
  <group>
    <cell @click.native="show" :title="title" :inline-desc="inlineDesc" :value="currentValue" is-link>
      {{currentValue}}
      <div v-transfer-dom>
        <popup v-model="showPopup" position="bottom" :show-mask="true" :hide-on-blur="false" :height="height">
          <radio :options="options" v-model="currentValue" :fill-mode="false" @on-change="onValueChange"></radio>
        </popup>
      </div>
    </cell>
  </group>

</template>

<script>
import { Cell, Popup, Radio, TransferDom, Scroller, Group } from "vux";
import props from "./props";

export default {
  components: {
    Popup,
    Radio,
    Cell,
    Scroller,
    Group
  },
  directives: {
    TransferDom
  },
  props: {
    ...props()
  },
  methods: {
    onValueChange(val) {
      this.hide();
    },
    show() {
      this.showPopup = true;
    },
    hide() {
      this.showPopup = false;
    }
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
    currentValue(val) {
      this.$emit("input", val);
      this.$emit("on-change", val);
    },
    showPopup(val) {
      if (val) {
        this.$emit("on-show");
      } else {
        this.$emit("on-hide");
      }
    }
  },
  data() {
    return {
      showPopup: false,
      currentValue: this.value
    };
  },
  mounted() {}
};
</script>

<style>
.weui-cell.vux-tap-active.weui-cell_access {
  background-color: #fff !important;
}
</style>
