<!--切换路由  -->
<template>
  <div>
    <router-view></router-view>
    <tabbar>
      <tabbar-item :selected="$route.name === 'manageIndex'" @click.native="jump('manageIndex')">
        <img
          slot="icon"
          src="../../assets/icon/Section/shouye2.png"
          v-if="$route.name !== 'manageIndex'"
        >
        <img
          slot="icon"
          src="../../assets/icon/Section/shouye.png"
          v-if="$route.name === 'manageIndex'"
        >
        <span slot="label">{{$t("bar.home")}}</span>
      </tabbar-item>
      <tabbar-item :selected="$route.name === 'manageAb'" @click.native="jump('manageAb')">
        <img
          slot="icon"
          src="../../assets/icon/Section/alarm.png"
          v-if="$route.name !== 'manageAb'"
        >
        <img
          slot="icon"
          src="../../assets/icon/Section/alarmse.png"
          v-if="$route.name === 'manageAb'"
        >
        <span slot="label">{{$t("bar.abnormal")}}</span>
      </tabbar-item>
      <tabbar-item :selected="$route.name === 'manageCenter'" @click.native="jump('manageCenter')">
        <img
          slot="icon"
          src="../../assets/icon/Section/mine-default@2x.png"
          v-if="$route.name !== 'manageCenter'"
        >
        <img
          slot="icon"
          src="../../assets/icon/Section/mine-selected@2x.png"
          v-if="$route.name === 'manageCenter'"
        >
        <span slot="label">{{$t("bar.my")}}</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, Cell } from "vux";
export default {
  data() {
    return {};
  },
  components: {
    Tabbar,
    TabbarItem,
    Cell
  },
  computed: {},
  mounted() {},
  methods: {
    //   跳转路由
    jump(age) {
      if (age == "manageIndex") {
        this.$router.replace({ path: "/manageBar/manageIndexV1" });
      } else if (age == "manageAb") {
        this.$router.replace({ path: "/manageBar/manageAb" });
      } else if (age == "manageCenter") {
        this.$router.replace({ path: "/manageBar/manageCenter" });
      }
    }
  }
};
</script>
<style lang='less' >
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
  color: #35bab6 !important;
}
.weui-tabbar {
  position: fixed;
  bottom: 0;
}
</style>
