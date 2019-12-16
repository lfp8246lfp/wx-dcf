<template></template>
<script>
import wx from "weixin-js-sdk";
import wechat from "../tools/wechat";
import api from "@/api/Piles";
import { mapState, mapGetters, mapMutations } from "vuex";
var userItem = JSON.parse(localStorage.getItem("userItem"));
export default {
  data: function() {
    return {
      chatid: userItem.openid
    };
  },
  computed: {
    ...mapState({
      title: state => state.route.meta.title,
      path: state => state.route.path
    }),
    ...mapGetters(["user"])
  },
  created() {
    if (userItem != null) {
      this.$store
        .dispatch("AC_checkBandStatus", { chatid: userItem.openid })
        .then(res => {
          if (res.data.returnCode == 0) {
            this.$router.push("/meterVending");
          } else if (res.data.returnCode == 6) {
            wechat.wxAuthJumpele();
          } else {
            this.$router.push("/meterLow");
          }
        });
    } else {
      wechat.wxAuthJumpele();
    }
  },
  methods: {}
};
</script>
<style lang="less" scoped>
</style>
