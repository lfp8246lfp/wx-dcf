
<template>
  <div class="tab1-header">
    <div class="header">
      <!-- <div>
        <group class="address">
          <x-address
            :hide-district="true"
            v-model="value"
            :list="addressData"
            title
            placeholder="请选择地点"
            :raw-value="true"
            @on-hide="logHide"
          ></x-address>
        </group>
      </div> -->
      <div class="search-box" style="text-align:left;">
        <search ref="search" placeholder="请输入站点" :auto-fixed="false"  @on-submit="getExactCharging(cname)"  v-model="cname"></search>
      </div>
      <!-- <flexbox :gutter="0" class="vux-1px-t"> -->
      <!--<flexbox-item :span="8">-->
      <!--<div class="flex-header">-->
      <!--<div class="search-box">
              <search ref="search" placeholder="请输入站点" :auto-fixed="false"></search>

      </div>-->
      <!--</div>-->
      <!--</flexbox-item>-->
      <!--<flexbox-item :span="4">
          <div class="flex-header">
            <div class="header-right">
              <x-icon type="ios-star" size="24" class="icon icon-blue"></x-icon>
              <span class="icon-blue"> 常用</span>
            </div>

          </div>
      </flexbox-item>-->
      <!--</flexbox>-->
    </div>
    <div>
      <StationList ref="StationList"></StationList>
    </div>
  </div>
</template>
<script>
import {
  Group,
  Cell,
  CellBox,
  Flexbox,
  FlexboxItem,
  Icon,
  Search,
  XAddress,
  ChinaAddressV4Data,
  XButton,
  Value2nameFilter as value2name
} from "vux";
import StationList from "@/views/module/stationList";
import { mapState, mapGetters, mapMutations } from "vuex";
import wx from "weixin-js-sdk";
import wechat from "../tools/wechat";
var userItem = JSON.parse(localStorage.getItem("userItem"));
export default {
  components: {
    Group,
    Cell,
    CellBox,
    Flexbox,
    FlexboxItem,
    Icon,
    Search,
    StationList,
    XAddress
  },
  computed: {
    ...mapState({
      title: state => state.route.meta.title,
      path: state => state.route.path,
      showCity: state => state.station.stationInfo.areaname
    }),
    ...mapGetters(["stationInfo", "stationList", "userInfos", "user"])
  },
  created() {
    // if (userItem != null) {
    //   var user = wechat.getSubscribe(userItem.appid, userItem.openid);  //获取返回值
    //   //promsie里压根就读不到this，也就是说取不到全局变量，这就是作用域问题了
    //   //我们在promise外面定义let _this =this ，然后在promise里使用_this就好了
    //   let _this = this;  //
    //   user.then(function(userInfo) {
    //     if (userInfo.subscribe == 0) {
    //       _this.$router.push("/aboutpublic");
    //     }
    //   });
    // } else {
    //   this.$router.push("/login");
    // }
    if (userItem != null) {
      var user = wechat.getSubscribe(userItem.appid, userItem.openid);
      let _this = this;
      user.then(function(userInfo) {
        if (userInfo.subscribe == 0) {
          _this.$router.push("/aboutpublic");
        }
      });
    } else {
      this.$router.push("/login");
    }
  },
  data: function() {
    return {
      addressData: ChinaAddressV4Data,
      value: this.showCity,
      cname:''
    };
  },
  mounted: function() {
    this.value = this.showCity;
  },
  methods: {
    // logHide() {
    //   let city = this.getName(this.value).split(" ");

    //   this.$store.commit("Update_city", city);
    //   this.$store.commit("Clear_StationPageNum");
    //   this.$refs.StationList.selectCity(this.stationInfo);
    // },

    getName(value) {
      return value2name(value, ChinaAddressV4Data);
    },
    getExactCharging(value){
        console.log(value);
        this.$store.commit("Update_chargingName", value);
        this.$store.commit("Clear_StationPageNum");
        this.$refs.StationList.selectCity(this.stationInfo);
    }
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.header {
  height: 88 / @width75;
  padding-left: 74 / @width75;
  padding-right: 20 / @width75;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: url(../assets/icon/Section/location.2@2x.png) no-repeat 40 /
    @width75 center #ffffff;
  background-size: 22 / @width75 34 / @width75;
  .address {
    width: 230 / @width75;
    height: 60 / @width75;
    line-height: 60 / @width75;
    .vux-cell-box {
      background: url(../assets/icon/Section/pull-down@2x.png) no-repeat 202 /
        @width75 center;
      background-size: 16 / @width75 10 / @width75;
      width: 230 / @width75;
      height: 60 / @width75;
      overflow: hidden;
    }
  }
}
</style>
<style lang="less">
@width75: 75rem;

.address .weui-cell_access .weui-cell__ft:after {
  display: none !important;
}
.address .weui-cells:after {
  display: none !important;
}
.address .weui-cell_access {
  width: 200 / @width75;
  height: 60 / @width75;
  line-height: 60 / @width75;
  padding-right: 20 / @width75;
}
.address .weui-cell {
  padding: 0 !important;
}

.address .weui-cells:before {
  display: none;
}

.address .vux-popup-picker-select {
  text-align: left !important;
}

.address .vux-cell-value {
  display: block;
  width: 200 / @width75;
  height: 60 / @width75;
  line-height: 60 / @width75;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.search-box .weui-search-bar {
  background: white;
  width: 400 / @width75;
  height: 60 / @width75;
  padding: 0;
}

.search-box .weui-search-bar:before {
  display: none;
}

.search-box .weui-search-bar__label {
  background: url(../assets/icon/Section/search_home@2x.png) no-repeat 22 /
    @width75 center #efefef;
  background-size: 30 / @width75 30 / @width75;
  color: #666;
  span {
    display: inline-block;
    vertical-align: auto;
    height: 60 / @width75;
    line-height: 60 / @width75;
    width: 260 / @width75;
    text-align: left;
  }
}

.search-box .weui-search-bar__form:after {
  display: none;
}

.search-box .weui-search-bar__box {
  padding: 0;
  .weui-search-bar__input {
    padding-left: 20/@width75;
    display: inline-block;
    height: 58 / @width75;
    line-height: 58 / @width75;
    text-align: left;
  }
  .weui-icon-clear {
    top: 20 / @width75;
  }
}

.search-box .weui-icon-search {
  display: none;
}

.search-box .weui-search-bar__cancel-btn {
  line-height: 60 / @width75;
  height: 60 / @width75;
  width: 80 / @width75;
  text-align: center;
  margin-left: 0;
}

.search-box .weui-search-bar:after {
  display: none;
}

.vux-popup-header {
  height: 90 / @width75!important;
  line-height: 90 / @width75!important;
}

.vux-popup-header .vux-popup-header-left,
.vux-popup-header .vux-popup-header-right {
  font-size: 36 / @width75;
  letter-spacing: 4 / @width75;
}

.weui-dialog {
  max-width: 540 / @width75!important;
  border-radius: 20 / @width75!important;
  overflow: hidden;
}
.weui-dialog__hd .weui-dialog__title {
  font-size: 36 / @width75!important;
  letter-spacing: 4px;
  font-weight: bolder;
}

.weui-dialog__bd .text-center {
  color: #030303 !important;
  line-height: 40 / @width75;
  font-size: 30 / @width75!important;
}

.weui-dialog__ft {
  line-height: 88 / @width75!important;
  height: 88 / @width75!important;
}

.weui-dialog__ft .weui-dialog__btn {
  line-height: 88 / @width75!important;
  height: 88 / @width75!important;
  font-size: 34 / @width75!important;
  color: #007aff;
}

.weui-dialog .vux-label {
  padding-top: 36 / @width75;
  line-height: 50 / @width75;
  height: 50 / @width75;
  font-size: 36 / @width75;
}
.weui-search-bar__box .weui-search-bar__input {
  text-align: center;
}

.weui-dialog .weui-cell:before {
  display: none;
}

.weui-dialog .weui-progress__bar {
  height: 10 / @width75!important;
}

.weui-dialog .vux-close {
  width: 120 / @width75!important;
  height: 40 / @width75!important;
  display: inline-block;
  line-height: 40 / @width75!important;
  font-size: 36 / @width75!important;
  letter-spacing: 4px;
  color: #007aff;
  margin-bottom: 40 / @width75!important;
}

// .weui-dialog .vux-close: before,
// .weui-dialog .vux-close: after {
//   display: none;
// }
.weui-toast {
  width: 540 / @width75!important;
  height: 180 / @width75!important;
  border-radius: 20 / @width75!important;
  top: 50% !important;
  margin-top: -90 / @width75!important;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3) !important;

  .weui-toast__content {
    line-height: 160 / @width75!important;
    font-size: 36 / @width75!important;
  }
}
</style>

