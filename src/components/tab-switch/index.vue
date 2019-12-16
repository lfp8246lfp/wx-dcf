<template>
    <div id="mescroll" class="mescroll">
        <tab :line-width="1" v-model="index">
            <tab-item v-for="(item,index) in options" :key="index" @on-item-click="switchTab(index)">{{item.label}}</tab-item>
        </tab>
        <router-view></router-view>
    </div>
</template>
<script>
import { Tab, TabItem, Sticky } from "vux";
import props from "./props";
export default {
  components: {
    Tab,
    TabItem,
    Sticky
  },
  props: {
    ...props()
  },
  data() {
    return {
      index: 0
    };
  },
  methods: {
    switchTab(index) {
      let item = this.options[index];
      this.$router.replace(item);
    }
  },
  mounted() {
    this.switchTab(this.index);
  }
};
</script>
<style scoped>
.msglistbody {
  font-size: smaller;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
