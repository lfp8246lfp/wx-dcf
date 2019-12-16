<template>

</template>
<script>
import wechat from "../tools/wechat";
export default {
  created() {
    wechat.wxAuthPath();
  },
  methods: {}
};
</script>
<style lang="less" scoped>
</style>
