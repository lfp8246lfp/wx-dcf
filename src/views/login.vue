<template>

</template>
<script>
import wechat from "../tools/wechat";
export default {
  created() {
    wechat.wxAuthJump();
  },
  methods: {}
};
</script>
<style lang="less" scoped>
</style>
