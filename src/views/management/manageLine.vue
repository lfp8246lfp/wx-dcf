<!-- 设备数量 -->
<template>
  <div class="lines">
    <scroller
      lock-x
      ref="scrollerBottom"
      use-pullup
      :pullup-config="pullupDefaultConfig"
      @on-pullup-loading="loadMore"
    >
      <ul>
        <li v-for="(item,index) in devicelist.data" :key="index">
          <div>
            <!-- <h1>租客A</h1> -->
            <div class="usermess">
              <div>
                <h2 v-if="apptype ==3">{{$t("barIndex.room")}}</h2>
                <h2 v-if="apptype ==1">充电桩名称</h2>
                <p>{{item.disc}}</p>
              </div>
              <div> 
                <h2 v-if="apptype ==3">{{$t("device.electricnumber")}}</h2>
                <h2 v-if="apptype ==1">充电桩编号</h2>
                <p>{{item.commaddress}}</p>
              </div>
              <div v-if="isStatus=='1'">
                <h2>{{$t("eleprice.creationtime")}}</h2>
                <p v-if="item.createtime!=null">{{formatTime(item.createtime)}}</p>
              </div>
              <div v-else>
                <h2>{{$t("eleprice.communication")}}</h2>
                <p v-if="item.changetime!=null">{{formatTime(item.changetime)}}</p>
              </div>
            </div>
          </div>
          <!-- <div class="recharge">
                    <router-link to="/manageRecharge">
                         充值
                    </router-link>
          </div>-->
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
      devicelist: { //数据
        total: 0,
        data: []
      }, //设备数据
      isStatus: "", //设备状态
      isEmpty: true,
      linereq: {
        accountid: id,
        pageSize: 6,
        pageNum: 1
      },
      apptype:"",
    };
  },

  components: {
    Scroller
  },

  computed: {},

  mounted() {
    this.isStatus = this.$route.query.curstatus;
    this.apptype = this.$route.query.apptype;
    console.log(this.apptype);
    console.log(this.isStatus);
    // this.getDevstatus();
    this.$nextTick(() => {
      this.$refs.scrollerBottom.reset({ top: 0 });
    });
    this.loadMore();
  },

  methods: {
    // 获取数据
    getDevstatus(fn) {
      this.linereq.curstatus = this.isStatus;
      this.linereq.apptype = this.apptype;
      console.log(this.linereq);
      api.GetDevStatus(this.linereq).then(res => {
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset({ top: 0 });
        });
        // this.device = res.data.listitem;
        this.devicelist.total = res.data.total;
        if (this.linereq.pageNum > 1) {
          this.devicelist.data = this.devicelist.data.concat(res.data.listitem);
        } else {
          this.devicelist.data = res.data.listitem;
        }
        fn();
      });
    },
    //   设置时间格式
    formatTime(val) {
      return format(val, "YYYY-MM-DD HH:mm:ss");
    },
    // 加载更多数据
    loadMore() {
      if (this.isEmpty) {
        this.isEmpty = false;
      } else {
        this.linereq.pageNum++;
      }
      this.getDevstatus(() => {
        let index = this.linereq.pageSize * this.linereq.pageNum;
        if (this.devicelist.total <= index) {
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
.lines {
  border-top: 1px solid #f6f6f8;
  border-bottom: 1px solid #f6f6f8;
  ul {
    background: #fff;
    li {
      display: flex;
      align-items: center;
      padding: 14 / @width75 38 / @width75;
      border-bottom: 1px solid #f6f6f6;
      justify-content: space-between;
      h1 {
        font-size: 32 / @width75;
        font-weight: bold;
        padding: 9 / @width75 0 8 / @width75 0;
      }
      > div {
        width: 100%;
      }
      .usermess {
        width: 100%;
        display: flex;
        margin-top: 14 / @width75;
        justify-content: space-between;
        div {
          width: 180 / @width75;
          h2 {
            color: #a3a3a3;
            font-size: 20 / @width75;
          }
          p {
            font-weight: bold;
            margin-top: 10 / @width75;
          }
        }
      }
      .recharge {
        width: 132 / @width75;
        height: 58 / @width75;
        border: 1px solid #4ac1bf;
        text-align: center;
        line-height: 58 / @width75;
        border-radius: 29 / @width75;
        font-size: 28 / @width75;
      }
    }
  }
}
</style>
