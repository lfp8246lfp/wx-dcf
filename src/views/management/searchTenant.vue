<!-- 房间管理 -->
<template>
  <div id="searchTenant">
    <!-- <div class="search">
      <input type="text" placeholder="输入手机号或用户名进行搜索" v-model="search">
      <span>
        <button @click="searchTenant">搜索</button>
      </span>
    </div> -->
        <p class="datano" v-show="datano">
            <img src="../../assets/noData.png" alt="">
            <br>
            暂无数据
        </p>
    <ul>
      <li v-for="(item, index) in list" :key="index" @click="pickTenant(item)">
        {{item.phone}} &nbsp; {{item.chatname}}
        <i>></i>
      </li>
    </ul>
  </div>
</template>

<script>
import api from "../../api/Piles.js"
const accountid = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
const userItem = JSON.parse(localStorage.getItem("userItem")); //获取微信号
export default {
  data() {
    return {
      search: '',
      datano: true,
      list: []
    };
  },

  mounted() {
    this.searchTenant()
  },

  methods: {
    searchTenant() {
      let roomid = this.$store.state.roomid
      api.selectTenantInfo({roomid}).then(res => {
        console.log(res, '查询租客')
        if (res.data.items.length > 0) {
          this.list = res.data.items
          this.datano = false
        } else {
          this.datano = true
        }
      })
    },
    pickTenant(params) {
      console.log(params, 'params')
      this.$router.push({
        name: 'rentConfiguration',
        params
      })
    }
  },
};
</script>
<style lang='less' scoped>
@width75: 75rem;
#searchTenant {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgb(238,238,238);
  .search {
    display: flex;
    padding: 18 / @width75 48 / @width75 18 / @width75 38 / @width75;
    justify-content: space-between;
    border-bottom: 1px solid rgb(228,228,228);
    background-color: #fff;
    input {
      width: 620 / @width75;
      padding: 0 75 / @width75 0 21 / @width75;
      height: 52 / @width75;
      background: #efefef;
    }
    span {
      margin-left: 20 / @width75;
      display: block;
      width: 126 / @width75;
      height:  52/ @width75;
      text-align: center;
      line-height: 52 / @width75;
      font-size: 32 / @width75;
      button{
        background: none;
        font-size: 28 / @width75;
      }
    }
    img {
      width: 40 / @width75;
      height: 40 / @width75;
      margin-top: 6 / @width75;
      margin-left: 14 / @width75;
    }
  }
  .datano {
    text-align: center;
    font-size: 32 / @width75;
    margin: 32 / @width75;
    padding-bottom: 32 / @width75;
    color: rgb(153,153,153);
    img {
      width: 262 / @width75;
      height: 210 / @width75;
      margin: 320 / @width75 0 70 / @width75;
    }
  }
  ul {
    li {
      position: relative;
      height: 90 / @width75;
      line-height: 90 / @width75;
      padding-left: 38 / @width75;
      background-color: #fff;
      border-bottom: 1px solid rgb(238,238,238);
      i {
        position: absolute;
        right: 30 / @width75;
        top: 50%;
        transform: translate(0,-50%);
        color: rgb(208,208,208);
        font-family: serif;
      }
    }
  }
}
</style>
