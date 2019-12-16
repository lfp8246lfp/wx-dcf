<template>
  <div class="content-list">
    <scroller
      lock-x
      ref = "scrollerBottom"
      use-pullup
      :pullup-config       = "pullupDefaultConfig"
        @on-pullup-loading = "loadMore"
      use-pulldown
      :pulldown-config       = "pulldownDefaultConfig"
        @on-pulldown-loading = "refresh"
    >
      <div class="box-content">
        <cell-box class="cellStyle" v-for="(item,index) of stationList" :key="item.rtuid">
          <div class="box">
            <flexbox>
              <flexbox-item :span="7/10" @click.native="jump(item)">
                <div class="flex-demo">
                  <div class="box-left">
                    <h5>{{item.disc}}</h5>

                    <div class="socket-status" v-if="item.curstatus==1">
                      <div>
                        <img src="../../assets/icon/Section/free@2x.png">
                        <span>{{item.idlecount}}/共{{item.totalcount}}</span>
                      </div>
                      <div>
                        <img src="../../assets/icon/Section/charge@2x.png">
                        <span>{{item.usecount}}/共{{item.totalcount}}</span>
                      </div>
                      <div>
                        <img src="../../assets/icon/Section/equipment @2x.png">
                        <span>设备{{item.curstatus|curstatus}}</span>
                      </div>
                    </div>
                    <div class="socket-status" v-if="item.curstatus==0">
                      <div>
                        <img src="../../assets/icon/Section/free-ash@2x.png">
                        <span>{{item.idlecount}}/共{{item.totalcount}}</span>
                      </div>
                      <div>
                        <img src="../../assets/icon/Section/charge-ash@2x.png">
                        <span>{{item.usecount}}/共{{item.totalcount}}</span>
                      </div>
                      <div>
                        <img src="../../assets/icon/Section/Group4@2x.png">
                        <span>设备{{item.curstatus|curstatus}}</span>
                      </div>
                    </div>
                    <p>{{item.installer}}</p>
                  </div>
                </div>
              </flexbox-item>
              <flexbox-item :span="3/10">
                <div class="flex-demo">
                  <div class="box-right">
                    <flexbox :gutter="0">
                      <flexbox-item class="vux-1px-l" @click.native="toMap(item)">
                        <div class="flex-demo">
                          <div class="icon-car" v-if="item.curstatus==1">
                            <img
                              src  = "../../assets/icon/Section/location.3@2x.png"
                              v-if = "item.apptype==1"
                            >
                            <img
                              src  = "../../assets/icon/Section/location-ash@2x.png"
                              v-if = "item.apptype==2"
                            >
                          </div>
                          <div class="icon-car" v-if="item.curstatus==0">
                            <img
                              src  = "../../assets/icon/Section/location.3@2x.png"
                              v-if = "item.apptype==2"
                            >
                            <img
                              src  = "../../assets/icon/Section/location-ash@2x.png"
                              v-if = "item.apptype==1"
                            >
                          </div>
                          <p>{{item.distance}}km</p>
                        </div>
                      </flexbox-item>
                    </flexbox>
                  </div>
                </div>
              </flexbox-item>
            </flexbox>
          </div>
        </cell-box>
      </div>
    </scroller>
  </div>
</template>
<script>
import wx from "weixin-js-sdk";
import wechat from "@/tools/wechat";
import "@/tools/filter/filter.js";
import api from "@/api/Piles";

import { mapState, mapGetters, mapMutations } from "vuex";

import {
  Group,
  Cell,
  CellBox,
  Flexbox,
  FlexboxItem,
  Icon,
  Search,
  Scroller,
  LoadMore,
  XHeader
} from "vux";
let resAdd = {
  latitude : 30.19485,
  longitude: 120.267166
};
sessionStorage.setItem("Location", JSON.stringify(resAdd));

const pulldownDefaultConfig = {
  content       : "下拉刷新",
  height        : 40,
  autoRefresh   : false,
  downContent   : "下拉刷新",
  upContent     : "释放后刷新",
  loadingContent: "正在刷新...",
  clsPrefix     : "xs-plugin-pulldown-"
};
const pullupDefaultConfig = {
  content       : "上拉加载更多",
  pullUpHeight  : 60,
  height        : 40,
  autoRefresh   : false,
  downContent   : "释放后加载",
  upContent     : "上拉加载更多",
  loadingContent: "加载中...",
  clsPrefix     : "xs-plugin-pullup-"
};

export default {
  components: {
    Group,
    Cell,
    CellBox,
    Flexbox,
    FlexboxItem,
    Icon,
    Search,
    Scroller,
    LoadMore,
    XHeader
  },
  data: function() {
    return {
      pullupDefaultConfig  : pullupDefaultConfig,
      pulldownDefaultConfig: pulldownDefaultConfig,
      isEmpty              : true
    };
  },
  created() {},

  mounted() {
    this.$nextTick(() => {
      this.$refs.scrollerBottom.reset({ top: 0 });
    });

    if (JSON.parse(sessionStorage.getItem("Location"))) {
      this.loadMore();
    } else {
      this.$store.commit("UPDATE_LOADING", true);
      setTimeout(() => {
        var userItem = JSON.parse(localStorage.getItem("userItem"));
        this.$store
          .dispatch("AC_GetUserInfomation", {
            chatid: userItem.openid
          })
          .then(() => {
            if (!this.userInfos.balancevlaue) {
              this.UpdateUserInfo();
            }
          });
        this.loadMore();
      }, 2000);
    }
  },

  computed: {
    ...mapGetters(["stationInfo", "stationList", "selectStation", "userInfos"])
  },
  methods: {
    async UpdateUserInfo() {
      const result = await this.$store.dispatch("AC_UpdateUserInfo", {
        chatid      : userItem.openid,
        balancevlaue: 0,
        chatname    : "",
        phone       : "",
        status      : 1
      });
    },
    jump: function(item) {
      let date      = new Date();
          item.date = date;
      this.$store.commit("UPDATE_SelectStation", item);
      this.$router.push({
        path: `/chargeStation/0/${item.rtuid}/${item.ownerid}` //0 代表点击  1 代表扫码


        // query: {
        //   id: item.rtuid,
        //   ownerid: item.ownerid
        // }
      });
    },
    refresh() {
      var locationAddress = JSON.parse(sessionStorage.getItem("Location"));
      this.$store.commit("Clear_StationPageNum");
      this.$refs.scrollerBottom.disablePullup();
      this.getData(data => {
        if (data.listitem.length > 0) {
          for (let item of data.listitem) {
            item.distance = wechat.getFlatternDistance(
              Number(item.dimension),
              Number(item.longitude),
              Number(locationAddress.latitude),
              Number(locationAddress.longitude)
            );
            item.distance = Math.floor(item.distance / 100) / 10;
            if (isNaN(item.distance)) {
              item.distance = 0;
            }
          }
        }
        this.lisitem = this.sortKey(data.listitem,'distance');
        this.$store.commit("UPDATE_StationList", data.listitem);
        let index = this.stationInfo.pageNum * this.stationInfo.pageSize;
        if (data.total > index) {
          this.$refs.scrollerBottom.enablePullup();
        }
        this.$refs.scrollerBottom.donePulldown();
      });
    },
    loadMore() {
      var locationAddress = JSON.parse(sessionStorage.getItem("Location"));
      if (this.isEmpty) {
        this.isEmpty = false;
      } else {
        this.$store.commit("UPDATE_StationPageNum");
      }

      this.getData(data => {
        let index = this.stationInfo.pageNum * this.stationInfo.pageSize;
        if (data.total <= index) {
          this.$refs.scrollerBottom.disablePullup();
        }
        if (data.listitem.length > 0) {
          for (let item of data.listitem) {
            item.distance = wechat.getFlatternDistance(
              Number(item.dimension),
              Number(item.longitude),
              Number(locationAddress.latitude),
              Number(locationAddress.longitude)
            );
            item.distance = Math.floor(item.distance / 100) / 10;
            if (isNaN(item.distance)) {
              item.distance = 0;
            }
          }
        }
        this.lisitem = this.sortKey(data.listitem,'distance');

        this.$store.commit("UPDATE_StationList", data.listitem);
        this.$refs.scrollerBottom.donePullup();
      });
    },
    sortKey(array,key){
      return array.sort(function(a,b){
      var x = a[key];
      var y = b[key];
      return ((x<y)?-1:(x>y)?1:0)
      })
    },
    getData(fn) {
      this.$store.dispatch("AC_GetStationList", this.stationInfo).then(res => {
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset();
        });
        fn(res);
      });
    },
    selectCity(stationInfo) {
      var locationAddress = JSON.parse(sessionStorage.getItem("Location"));
      
      this.isEmpty = true;
      this.loadMore();
    },
    toMap(item) {
      wechat.goDeviceLocation(
        item.dimension,
        item.longitude,
        item.disc,
        item.installer
      );
    }
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.content-list {
  position  : absolute;
  left      : 0;
  right     : 0;
  top       : 95 / @width75;
  bottom    : 0 / @width75;
  overflow  : hidden;
  background: white;
  .weui-cell {
    padding: 0;
  }
  .cellStyle {
    height: 220 / @width75;
    .box {
      width: 100%;
      .box-left {
        padding-left: 40 / @width75;
        h5 {
          font-size    : 32 / @width75;
          line-height  : 44 / @width75;
          height       : 44 / @width75;
          color        : #000000;
          font-weight  : bolder;
          margin-bottom: 22 / @width75;
        }
        p {
          font-size  : 26 / @width75;
          line-height: 36 / @width75;
          height     : 36 / @width75;
          color      : #666666;
          margin-top : 26 / @width75;
        }
        .socket-status {
          display  : flex;
          height   : 28 / @width75;
          font-size: 0;
          img {
            display       : inline-block;
            width         : 28 / @width75;
            height        : 28 / @width75;
            vertical-align: bottom;
            position      : relative;
            top           : -2 / @width75;
            margin-right  : 4 / @width75;
          }
          span {
            display     : inline-block;
            line-height : 28 / @width75;
            height      : 28 / @width75;
            font-size   : 20 / @width75;
            margin-right: 24 / @width75;
            color       : #999999;
          }
        }
      }
      .box-right {
        .vux-1px-l:before {
          display: none;
        }
        .vux-1px-l {
          .icon-car {
            text-align: center;
            img {
              display: inline-block;
              width  : 46 / @width75;
            }
          }
          p {
            text-align : center;
            line-height: 36 / @width75;
            height     : 36 / @width75;
            font-size  : 26 / @width75;
            color      : #000000;
            margin-top : 8 / @width75;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
// @width75     : 75rem;
// .vux-cell-box: not(:first-child): before {
//   border-top: 30 / @width75 solid #f4f4f4;
//   left      : 0;
// }
</style>


