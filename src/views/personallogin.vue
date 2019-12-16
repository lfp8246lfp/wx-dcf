<template>

</template>
<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import wx from "weixin-js-sdk";
import wechat from "../tools/wechat";
var userItem = JSON.parse(localStorage.getItem("userItem"));
export default {
  created() {
       if (userItem != null) {
           this.$router.push("/personal");
    } else {
     wechat.wxAuthJumpperson();
    }

  },
  methods: {}
};
</script>
<style lang="less" scoped>
</style>
