<!-- 退费 -->
<template>
  <div class="fund">
    <div class="search">
      <x-input type="text" placeholder="输入房间号/用户名/手机号进行搜索" @on-enter="search"></x-input>
      <span>搜索</span>
    </div>
    <ul>
      <li>
        <div class="surface">
          <h1>WIFI表一号</h1>
          <div class="surbox">
            <div class="room">
              <h2>房间号</h2>
              <p>1101</p>
            </div>
            <div class="eleid">
              <h2>电表编号</h2>
              <p>001809200001</p>
            </div>
            <div class="relay">
              <h2>继电器状态</h2>
              <p>开</p>
            </div>
          </div>
          <div class="surbox">
            <div class="room">
              <h2>用户名</h2>
              <p>租客A</p>
            </div>
            <div class="eleid">
              <h2>手机号</h2>
              <p>13081770866</p>
            </div>
            <div class="relay">
              <h2>剩余电量</h2>
              <p>100.00kWh</p>
            </div>
          </div>
        </div>
        <div class="btngroup">
          <button @click="goto(item)">退费</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { XInput } from "vux";
export default {
  data() {
    return {};
  },

  components: {
    XInput
  },

  computed: {},

  mounted() {},

  methods: {
    //跳转到退费具体页面
    goto(item) {
      this.$router.push({ path: "/manageRefund", query: { funditem: item } });
    },
    //搜索
    search() {}
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.fund {
  .search {
    background: #fff;
    display: flex;
    padding: 18 / @width75 48 / @width75 18 / @width75 38 / @width75;
    justify-content: space-between;
    input {
      width: 440 / @width75;
      padding: 0 89 / @width75 0 21 / @width75;
      height: 52 / @width75;
      background: #efefef;
    }

    span {
      display: block;
      width: 96 / @width75;
      height: 48 / @width75;
      text-align: center;
      line-height: 48 / @width75;
      font-size: 32 / @width75;
      margin-top: 2 / @width75;
    }
  }
  ul {
    padding: 20 / @width75 38 / @width75;
    li {
      background: #fff;
      .surface {
        padding: 20 / @width75 0 16 / @width75 30 / @width75;
        position: relative;
        border-bottom: 1px solid #f6f6f6;
        h1 {
          padding: 17 / @width75 0 16 / @width75;
          font-size: 32 / @width75;
          font-weight: bold;
        }
      }
      .surbox {
        margin-top: 20 / @width75;
        display: flex;
        .room {
          width: 100 / @width75;
          margin-right: 50 / @width75;
          h2 {
            color: #999999;
            padding: 5 / @width75 0;
          }
          p {
            padding: 6 / @width75 0 5 / @width75;
            margin-top: 2 / @width75;
          }
        }
        .eleid {
          width: 180 / @width75;
          margin-right: 50 / @width75;
          h2 {
            color: #999999;
            padding: 5 / @width75 0;
          }
          p {
            padding: 6 / @width75 0 5 / @width75;
            margin-top: 2 / @width75;
          }
        }
        .relay {
          width: 170 / @width75;
          h2 {
            color: #999999;
            padding: 5 / @width75 0;
          }
          p {
            padding: 6 / @width75 0 5 / @width75;
            margin-top: 2 / @width75;
          }
        }
      }
      .btngroup {
        button {
          width: 100%;
          padding: 16 / @width75 0 18 / @width75;
          background: #fff;
          color: #35bab6;
          font-size: 32 / @width75;
          display: block;
        }
      }
    }
  }
}
.weui-cell[data-v-51a2e3b0] {
  background: #efefef;
  width: 548 / @width75;
  padding: 0;
  .weui-input {
    width: 440 / @width75;
    padding: 0 89 / @width75 0 21 / @width75;
    height: 52 / @width75;
    background: #efefef;
  }
}
</style>
<style lang="less">
@width75: 75rem;
.weui-input {
  width: 440 / @width75;
  padding: 0 0 0 21 / @width75;
  height: 52 / @width75;
  background: #efefef;
}
</style>
