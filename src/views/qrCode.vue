<template>

</template>
<script>
import wx from "weixin-js-sdk";
var userItem = JSON.parse(localStorage.getItem("userItem"));
import { format } from "date-fns";
import { mapState, mapGetters } from "vuex";
import "@/tools/filter/filter.js";
import { timeDif, formatDate } from "@/tools/commonJs/common";
import wechat from "@/tools/wechat";
export default {
  data() {
    return {
      code: ""
    };
  },
  mounted() {
    wechat.callqrCode();
  },updated(){
    wechat.callqrCode();
  }
};
</script>
<style lang="less" scoped>
</style>
