<!--余额详情 -->
<template>
  <div class="balance">
    <div class="balance-top">
      <p>电表编号</p>
      <p class="time">时间</p>
      <p class="balan">余额</p>
    </div>
    <ul>
      <li>
        <p>001209200001</p>
        <p class="time">09-21 16:58</p>
        <p class="balan">￥6.00</p>
      </li>
      <li>
        <p>001209200001</p>
        <p class="time">09-21 16:58</p>
        <p class="balan">￥6.00</p>
      </li>
      <li>
        <p>001209200001</p>
        <p class="time">09-21 16:58</p>
        <p class="balan">￥6.00</p>
      </li>
      <li>
        <p>001209200001</p>
        <p class="time">09-21 16:58</p>
        <p class="balan">￥6.00</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {}
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.balance {
  .balance-top {
    display: flex;
    justify-content: space-around;
    height: 60 / @width75;
    line-height: 60 / @width75;
    background: #fafafa;
    padding: 0 38 / @width75;
    p {
      color: #cccccc;
      width: 220 / @width75;
      text-align: center;
    }
    .time {
      width: 294 / @width75;
    }
    .balan {
      width: 160 / @width75;
    }
  }
  ul {
    border-bottom: 1px solid #f3f3f3;
  }
  li {
    display: flex;
    justify-content: space-around;
    border-top: 1px solid #f3f3f3;
    padding: 20 / @width75 38 / @width75;
    p {
      font-size: 28 / @width75;
      padding: 16 / @width75 0;
      width: 220 / @width75;
      text-align: center;
    }
    .time {
      width: 294 / @width75;
    }
    .balan {
      width: 160 / @width75;
    }
  }
}
</style>
