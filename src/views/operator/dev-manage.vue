<template>
  <div class="dev-manage">

      <div class="group1">
        <selector title="区域" :options="arealist" v-model="selectArea" placeholder="请选择" @on-change="selectAreaClick"></selector>
      </div>

    <group class="scroller-wrap location">
        <scroller lock-x ref="scrollerBottom" use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore" use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh">
        <div>

          <checklist title="充电站列表" :options="this.showStationList" v-model="selectStation" :max="1" @on-change="stationClick"></checklist>
        </div>

      </scroller>

    </group>

    <tabbar style="position:fixed;">
      <tabbar-item @click.native="addStation">
        <img slot="icon" src="./../../assets/icon/xinzeng@2x.png">
        <span slot="label">新增</span>
      </tabbar-item>
      <tabbar-item @click.native="updateStation">
        <img slot="icon" src="./../../assets/icon/bianji@2x.png">
        <span slot="label">编辑</span>
      </tabbar-item>
      <tabbar-item @click.native="deleteStation">
        <img slot="icon" src="./../../assets/icon/shanchu@2x.png">
        <span slot="label">删除</span>
      </tabbar-item>
      <tabbar-item @click.native="jumpSocket">
        <img slot="icon" src="./../../assets/icon/chatou@2x.png">
        <span slot="label">编辑插头</span>
      </tabbar-item>
    </tabbar>
    <div v-transfer-dom>
      <popup v-model="showPop">
        <div class="popup">
          <group title="充电站维护">
            <x-input title="通讯地址" type="text" v-model="data.optStationInfo.commaddress" :is-type="commaddressValid" :max="8" placeholder="8位数字必填" @on-change="addressChange" :debounce="500"></x-input>
            <x-input title="充电站名称" type="text" v-model="data.optStationInfo.disc" required="required" placeholder="名称必填"></x-input>
            <x-input title="充电站编号" type="text" v-model="data.optStationInfo.version"></x-input>
            <x-input title="安装位置" type="text" v-model="data.optStationInfo.installer"></x-input>
            <x-input title="纬度" type="text" v-model="data.optStationInfo.dimension"></x-input>
            <x-input title="经度" type="text" v-model="data.optStationInfo.longitude"></x-input>
            <x-input title="" type="text"></x-input>
            <group title="电站类型">
              <radio title="title" :options="carType" :selected-label-style="{color: '#FF9900'}" v-model="data.optStationInfo.apptype"></radio>
            </group>
          </group>
          <group>
            <x-button @click.native="submit" :gradients="['#1D62F0', '#19D5FD']">保存</x-button>
          </group>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <confirm v-model="confirmDel" title="删除提示" @on-confirm="confirmClick">
        <p style="text-align:center;">确认删除？</p>
      </confirm>
    </div>
  </div>
</template>
<script>
import {
  XButton,
  XInput,
  Selector,
  Group,
  Tabbar,
  TabbarItem,
  Checklist,
  Confirm,
  TransferDom,
  Popup,
  Radio,
  Scroller
} from "vux";
// let resAdd = {
//   latitude: 30.19485,
//   longitude: 120.267166
// };
// sessionStorage.setItem("Location", JSON.stringify(resAdd));
var   operatorData          = JSON.parse(localStorage.getItem("operatorUserItem"));
var   locationAddress       = JSON.parse(sessionStorage.getItem("Location"));
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
  directives: {
    TransferDom
  },
  components: {
    XButton,
    XInput,
    Selector,
    Group,
    Tabbar,
    TabbarItem,
    Checklist,
    Confirm,
    TransferDom,
    Popup,
    Radio,
    Scroller
  },
  data() {
    return {
      commaddressValid: function(value) {
        return {
          valid: value.length === 8,
          msg  : "请填写正确通信地址"
        };
      },
      pullupDefaultConfig  : pullupDefaultConfig,
      pulldownDefaultConfig: pulldownDefaultConfig,
      isEmpty              : true,
      confirmDel           : false,
      arealist             : [],
      selectArea           : null,
      stationInfo          : {
        accountid: operatorData.accountid,
        pageNum  : 1,
        pageSize : 10,
        objectid : null
      },
      stationList: {
        totalCount: 0,
        data      : []
      },

      showStationList: [],
      selectStation  : [],
      showPop        : false,
      carType        : [
        {
          key  : "1",
          value: "电瓶车"
        },
        {
          key  : "2",
          value: "电动汽车"
        }
      ],

      data: {
        optStationInfo: {}
      },

      initOptStationInfo: {
        rtuid          : "",
        commaddress    : "",
        ischangeaddress: 0,
        ownerid        : "",
        disc           : "",
        version        : "",
        installer      : "",
        longitude      : locationAddress.longitude,
        dimension      : locationAddress.latitude,
        apptype        : "1",
        ownertype      : ""
      },
      oldCommaddress: null,
      optType       : null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.scrollerBottom.reset({ top: 0 });
      this.$refs.scrollerBottom.disablePullup();
    });

    this.$store
      .dispatch("AC_getAreaAuthInfo", {
        accountid: operatorData.accountid
      })
      .then(res => {
        for (let item of res.data.listitem) {
          this.arealist.push({
            key  : item.lineid,
            value: item.disc
          });
        }
        this.selectArea = this.arealist[0].key;
      });
  },
  methods: {
    loadMore() {
      if (this.isEmpty) {
        this.isEmpty = false;
      } else {
        this.stationInfo.pageNum++;
      }
      this.GetSatations(() => {
        let index = this.stationInfo.pageSize * this.stationInfo.pageNum;
        if (this.stationList.totalCount <= index) {
          this.$refs.scrollerBottom.disablePullup();
        } else {
          this.$refs.scrollerBottom.enablePullup();
        }
        this.$refs.scrollerBottom.donePullup();
      });
    },
    refresh() {
      this.stationInfo.pageNum = 1;
      this.$refs.scrollerBottom.disablePullup();
      this.GetSatations(() => {
        let index = this.stationInfo.pageSize * this.stationInfo.pageNum;
        if (this.stationList.totalCount > index) {
          this.$refs.scrollerBottom.enablePullup();
        }

        this.$refs.scrollerBottom.donePulldown();
      });
    },
    jumpSocket() {
      if (this.selectStation[0]) {
        this.$router.push(`/socketManage/${this.selectStation[0]}`);
      } else {
        this.$store.commit("UPDATE_TOAST", "请选择充电站");
      }
    },
    addressChange(value) {
      if (this.optType == 2 && this.oldCommaddress != value) {
        this.data.optStationInfo.ischangeaddress = 1;
        console.log(666);
      }
    },
    selectAreaClick(value) {
      if (value > 0) {
        this.stationInfo.objectid = this.selectArea;
        this.stationInfo.pageNum  = 1;
        this.isEmpty              = true;
        this.loadMore();
      }
    },
    stationClick(value) {
      this.data.optStationInfo = Object.assign(
        this.data.optStationInfo,
        this.initOptStationInfo
      );
      if (value[0]) {
        for (let item of this.stationList.data) {
          if (value[0] == item.rtuid) {
            this.data.optStationInfo = Object.assign(
              this.data.optStationInfo,
              item
            );
            this.oldCommaddress = this.data.optStationInfo.commaddress;
          }
        }
      }
    },
    submit() {
      if (this.optType == 1) {
        if (this.data.optStationInfo.commaddress != "") {
          delete this.data.optStationInfo.rtuid;
          delete this.data.optStationInfo.ownertype;
          this.data.optStationInfo.ischangeaddress = 0;
          this.data.optStationInfo.ownerid         = this.selectArea;
          this.OptStation();
        } else {
          this.$store.commit("UPDATE_TOAST", "通訊地址不能為空");
        }
      } else {
        if (this.data.optStationInfo.commaddress != "") {
          this.OptStation();
        } else {
          this.$store.commit("UPDATE_TOAST", "通訊地址不能為空");
        }
      }
    },
    addStation() {
      this.data.optStationInfo = Object.assign(
        this.data.optStationInfo,
        this.initOptStationInfo
      );
      console.log(this.data.optStationInfo);
      this.selectStation               = [];
      this.optType                     = 1;
      this.data.optStationInfo.apptype = "1";

      if (this.selectArea != null) {
        this.showPop = true;
      } else {
        this.$store.commit("UPDATE_TOAST", "请选择区域");
      }
    },

    updateStation() {
      this.data.optStationInfo.ischangeaddress = 0;
      this.optType                             = 2;
      if (this.selectStation[0]) {
        this.showPop = true;
      } else {
        this.$store.commit("UPDATE_TOAST", "请选择充电站");
      }
    },
    deleteStation() {
      this.optType = 3;
      if (this.selectStation[0]) {
        this.confirmDel = true;
      } else {
        this.$store.commit("UPDATE_TOAST", "请选择充电站");
      }
    },
    confirmClick() {
      this.OptStation();
    },

    GetSatations(fn) {
      this.$store.dispatch("AC_getSatations", this.stationInfo).then(res => {
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset();
        });
        this.stationList.totalCount = res.data.total;
        if (this.stationInfo.pageNum > 1) {
          this.stationList.data = this.stationList.data.concat(
            res.data.listitem
          );
        } else {
          this.stationList.data = res.data.listitem;
        }

        this.showStationList = this.stationList.data.map(res => {
          return {
            key       : res.rtuid,
            inlineDesc: res.commaddress,
            value     : res.disc
          };
        });
        fn();
      });
    },
    OptStation() {
      this.$store
        .dispatch("AC_OptStation", {
          optType: this.optType,
          obj    : this.data.optStationInfo
        })
        .then(res => {
          if (res.data.returnResult == 1) {
            this.$store.commit("UPDATE_TOAST", "操作成功");
            this.isEmpty = true;
            this.loadMore();
            this.showPop = false;
          } else {
            this.$store.commit("UPDATE_TOAST", "操作失败");
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.dev-manage {
  background: #ffffff;
  .group1 {
    padding: 34 / @width75 34 / @width75 0 34 / @width75;
  }
}
// .scroller-wrap {
//   position: absolute;
//   left: 0;
//   right: 0;
//   top: 50px;
//   bottom: 0;
//   overflow: hidden;
// }
// .popup0 {
//   padding-bottom: 15px;
//   height: 800px;
// }
</style>
<style lang="less">
@width75: 75rem;
.popup .weui-btn {
  border-radius: 44 / @width75;
  background   : #35bab6 !important;
  width        : 8.98666667rem;
  height       : 1.17333333rem;
  text-align   : center;
  line-height  : 1.17333333rem;
  background   : #35bab9;
  color        : #fff;
  border-radius: 0.58666667rem;
  margin       : 39 / @width75;
  font-size    : 0.48rem !important;
}
.popup .weui-cells__title {
  font-size  : 28 / @width75;
  margin-left: 28 / @width75;
}
.popup .weui-cells .weui-cells__title {
  font-size: 30 / @width75;
  position : relative;
  bottom   : 35 / @width75;
}
.popup .weui-cells .weui-check__label {
  margin-left: 28 / @width75;
}
.popup .weui-label {
  font-size  : 28 / @width75;
  margin-left: 28 / @width75;
}
.popup .vux-no-group-title {
  margin-top: 0;
}
.dev-manage .group1 .weui-cell__bd {
  text-align: right;
}
.dev-manage .group1 .weui-label {
  color      : black;
  position   : relative;
  font-size  : 28 / @width75;
  top        : 3 / @width75;
  font-weight: bold;
}
.dev-manage .group1 .weui-select {
  text-align: right;
  font-size : 28 / @width75;
  color     : rgb(102, 102, 102);
}
.dev-manage .location .weui-cells__title {
  height     : 70 / @width75;
  line-height: 70 / @width75;
  font-size  : 24 / @width75;
  margin     : 0 0 0 41 / @width75;
}
.dev-manage .location .weui-check_label {
  height: 94 / @width75;
  margin: 0 0 0 39 / @width75;
}
</style>



