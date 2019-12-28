<!-- 选择电表 -->
<template>
  <div id="pickMeter">
    <div class="search">
      <input type="text" placeholder="设备名称" v-model="search">
      <span>
        <button @click="searchDev">搜索</button>
      </span>
    </div>
        <p class="datano" v-show="datano">
            <img src="../../assets/noData.png" alt="">
            <br>
            暂无数据
        </p>
    <div class="data">
      <ul>
        <li v-for="(item,index) in list" :key="index" @click="pick(item)">
          <div class="title">
            {{item.disc}}
          </div>
          <div class="item">
            <span>通讯地址：</span>
            {{item.commAddress}}
          </div>
          <div class="item">
            <span>是否绑定其他房间：</span>
            {{item.isBandRoom === -1 ? '未绑定' : '已绑定'}}
          </div>
          <div class="item" v-if="item.isBandRoom !== -1">
            <span>绑定房间：</span>
            {{item.roomname}}
          </div>
          <i class="arrow">></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  XInput,
  Scroller,
  Confirm,
  TransferDom,
  XDialog,
  XProgress,
  Cell,
  Box,
  XButton,
  Alert
} from "vux";
import api from "../../api/Piles.js";
const accountid = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
const userItem = JSON.parse(localStorage.getItem("userItem")); //获取微信号
export default {
  data() {
    return {
      search: '',
      list: [],
      datano: true,
    };
  },
  components: {
    XInput,
    Scroller,
    Confirm,
    XDialog,
    XProgress,
    Cell,
    Box,
    XButton,
    Alert
  },

  mounted() {
    this.searchDev()
  },

  methods: {
    searchDev() {
      let obj = {
        accountid,
        serachValue: this.search
      }
      api.selectAllDev(obj).then(res => {
        console.log(res, '查询设备')
        if (res.data.items.length > 0) {
          this.list = res.data.items
          this.datano = false
        } else {
          this.datano = true
        }
      })
    },
    pick(item) {
      let params = {
        roomid: this.$store.state.roomid,
        ...item
      }
      this.$router.push({
        name: 'equipmentnew',
        params
      })
    }
  },
};
</script>
<style lang='less' scoped>
@width75: 75rem;
#pickMeter {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(245,245,245);
  .search {
    display: flex;
    padding: 18 / @width75 48 / @width75 18 / @width75 38 / @width75;
    justify-content: space-between;
    background-color: #fff;
    input {
      width: 620 / @width75;
      padding: 0 70/ @width75 0 21 / @width75;
      height: 52 / @width75;
      background: #efefef;
    }
    span {
      margin-left: 10 / @width75;
      display: block;
      width: 126 / @width75;
      height:  52/ @width75;
      text-align: center;
      line-height: 52 / @width75;
      font-size: 32 / @width75;
      button{
        background: none;
      }
    }
    img {
      width: 40 / @width75;
      height: 40 / @width75;
      margin-top: 6 / @width75;
      // margin-left: 14 / @width75;
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
  .data {
    padding: 35 / @width75;
    ul {
      li {
        position: relative;
        padding: 30 / @width75;
        margin-bottom: 30 / @width75;
        background-color: #fff;
        .title {
          font-size: 30 / @width75;
          height: 50 / @width75;
          // line-height: 50 / @width75;
          font-weight: 700;
        }
        .item {
          height: 35 / @width75;
          line-height: 35 / @width75;
          span {
            color: #999;
          }
        }
        .arrow {
          position: absolute;
          right: 40 / @width75;
          top: 50%;
          transform: translate(0,-50%);
          font-family: serif;
          color: #aaa;
          font-size: 40 / @width75;
          // width: 132 / @width75;
          // height: 58 / @width75;
          // line-height: 58 / @width75;
          // background: linear-gradient(left, rgb(134,214,211), rgb(53,186,182));
          // color: #fff;
          // border-radius: 100 / @width75;
        }
      }
    }
  }
}
</style>
