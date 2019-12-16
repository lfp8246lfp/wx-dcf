<!-- 用户 -->
<template>
  <div class="account">
    <div class="acc-top">
      <p>{{$t("device.username")}}</p>
      <p class="iphone">{{$t("barIndex.phone")}}</p>
      <p>{{$t("record.bindtime")}}</p>
    </div>
    <scroller
      lock-x
      ref="scrollerBottom"
      use-pullup
      :pullup-config="pullupDefaultConfig"
      @on-pullup-loading="loadMore"
    >
      <ul>
        <li v-for="(item,index) in accountList.data" :key="index">
          <p>{{item.chatname}}</p>
          <p class="iphone">{{item.phone}}</p>
          <p>{{formatTime(item.createtime)}}</p>
        </li>
      </ul>
    </scroller>
  </div>
</template>

<script>
import { Scroller } from "vux";
import api from "../../api/Piles.js";
import { format } from "date-fns";
var id = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
const pullupDefaultConfig = {
  content: "上拉加载更多",
  pullUpHeight: 60,
  height: 40,
  autoRefresh: false,
  downContent: "释放后加载",
  upContent: "上拉加载更多",
  loadingContent: "加载中...",
  clsPrefix: "xs-plugin-pullup-"
};
export default {
  data() {
    return {
      pullupDefaultConfig: pullupDefaultConfig,
      accountList: { //数据
        total: 0,
        data: []
      }, //数据
      isEmpty: true,
      accountreq: { //用户参数
        accountid: id,
        pageSize: 6,
        pageNum: 1
      }
    };
  },

  components: {
    Scroller
  },

  computed: {},

  mounted() {
    this.$nextTick(() => {
      this.$refs.scrollerBottom.reset({ top: 0 });
    });
    this.loadMore();
  },

  methods: {
    //   设置时间格式
    formatTime(val) {
      return format(val, "YYYY-MM-DD");
    },
    // async SendWaringMsg() {
    //   const result = await this.$store.dispatch("AC_SendWaringMsg", {
    //     title     : "低电量提醒",
    //     datas     : `您好:${this.metername} 电量剩余不足\t姓名：${this.chatname}\t地址：${this.commaddress}\t剩余电量：${this.balancevlaue}\t ${this.alarmenergy}，请及时充值`,
    //     userOpenid: chatid,
    //     mpAccount : appid,
    //     jumpUrl   : `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
    //       appid
    //     }&redirect_uri=http%3a%2f%2fbee.statesky.cn%2fpowerh5%2f%23%2fmeterLow%2f${
    //       chatid
    //     }&response_type=code&scope=snsapi_base&state=1&conn`
    //   });
    // },
    //   获取用户
    getAccount(fn) {
      if (this.$route.params.nomal == 1) {
        this.accountreq.isnormal = 1;
      } else {
        delete this.accountreq.isnormal;
      }
      api.GetCalUsers(this.accountreq).then(res => {
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset();
        });
        this.accountList.total = res.data.total;
        if (this.accountreq.pageNum > 1) {
          this.accountList.data = this.accountList.data.concat(
            res.data.devUsersItems
          );
        } else {
          this.accountList.data = res.data.devUsersItems;
        }
        fn();
        // this.SendWaringMsg();
      });
    },
    // 加载更过
    loadMore() {
      if (this.isEmpty) {
        this.isEmpty = false;
      } else {
        this.accountreq.pageNum++;
      }
      this.getAccount(() => {
        let index = this.accountreq.pageSize * this.accountreq.pageNum;
        if (this.accountList.total <= index) {
          this.$refs.scrollerBottom.disablePullup();
        }
        this.$refs.scrollerBottom.donePullup();
      });
    }
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.account {
  background: #fff;
  position: relative;
  height: 100%;
  .acc-top {
    display: flex;
    justify-content: space-around;
    height: 60 / @width75;
    line-height: 60 / @width75;
    background: #fafafa;
    padding: 0 38 / @width75;
    p {
      width: 220 / @width75;
      text-align: center;
      color: #cccccc;
    }
    .iphone {
      width: 234 / @width75;
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
      width: 220 / @width75;
      font-size: 28 / @width75;
      padding: 13 / @width75 0 14 / @width75;
      text-align: center;
    }
    .iphone {
      width: 234 / @width75;
    }
  }
}
</style>
