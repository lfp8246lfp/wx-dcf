<template>
  <div class="blank">
    <img src="../../assets/abnormal.png">
    <p>{{$t("up.abno")}}</p>
    <button @click="back">{{$t("up.scan")}}</button>
  </div>
</template>

<script>
import wechat from "@/tools/wechat";
export default {
  components: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
      back(){
        wechat.callqrCode();
      }
  }
};
</script>

<style  lang="less" scoped>
@width75:75rem;
.blank{
    padding: 156/@width75 38/@width75 0;
    text-align: center;
    img{
        width: 200/@width75;
    }
    p{
        font-size: 32/@width75;
        color: #000;
        margin-top: 60/@width75;
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
}
</style>
