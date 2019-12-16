<template>
  <div class="jump">
    <!-- <button @click="back">{{$t("up.scan")}}</button> -->
  </div>
</template>
<script>
import wx from "weixin-js-sdk";
import wechat from "@/tools/wechat";
export default {
  data() {
    return {
    };
  },
  mounted() {
    setTimeout(() => {
      wechat.callqrCode();
    }, 2000);
    
  },
  methods:{
    back(){
      wechat.callqrCode();
    }
  }
};
</script>
<style lang="less" scoped>
@width75:75rem;
.jump{
  padding: 200/@width75 38/@width75 0;
}
button{
        width: 100%;
        height: 88/@width75;
        background:rgb(53, 186, 182);
        color: white;
        margin-top: 64/@width75;
        line-height: 88/@width75;
        font-size: 36/@width75;
        border-radius: 44/@width75;
    }
</style>
