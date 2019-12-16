<template>
  <div class="socket-manage">
    <scroller
      lock-x
      use-pullup
    >
        <group class="group1">
          <checklist title="插头列表" :options="this.showSocketList" v-model="selectSocket" :max="1" @on-change="socketClick"></checklist>
        </group>
    </scroller>
    <tabbar style="position:fixed;">
      <!-- <tabbar-item @click.native="addSocket">
        <img slot="icon" src="./../../assets/icon/xinzeng@2x.png">
        <span slot="label">新增</span>
      </tabbar-item> -->
      <tabbar-item @click.native="updateSocket">
        <img slot="icon" src="./../../assets/icon/bianji@2x.png">
        <span slot="label">编辑</span>
      </tabbar-item>
      <tabbar-item @click.native="deleteSocket">
        <img slot="icon" src="./../../assets/icon/shanchu@plug.png">
        <span slot="label">删除</span>
      </tabbar-item>
      <div v-transfer-dom>
        <popup v-model="showPop">
          <div class="popup1">
            <group title="插头维护">
              <x-input title="通讯地址" type="text" v-model="data.obj.commaddress" :max="12" placeholder="12位数字必填" @on-change="addressChange" :debounce="500" :is-type="commaddressValid"></x-input>
              <x-input title="插座号" type="text" v-model="data.obj.meterno"></x-input>
              <x-input title="插座编号" type="text" v-model="data.obj.tagno"></x-input>
              <x-input title="插座名称" type="text" v-model="data.obj.disc"></x-input>

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
    </tabbar>
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
  mounted() {},
  data() {
    return {
      commaddressValid: function(value) {
        return {
          valid: value.length === 12,
          msg: "请填写正确通信地址"
        };
      },
      confirmDel: false,
      showPop: false,
      socketList: [],
      showSocketList: [],
      selectSocket: [],

      initSocketInfo: {
        rtuid: this.$route.params.id,
        pmeterid: "",
        pointid: "",
        meterno: "",
        commaddress: "",
        tagno: "",
        disc: "",
        numberid: "",
        usestatus: 1,
        ischangeaddress: 0
      },
      data: {
        optType: null,
        obj: {}
      },
      oldCommaddress: null
    };
  },
  mounted() {
    this.GetSockets();
  },
  methods: {
    addressChange(value) {
      console.log(value);
      console.log(this.oldCommaddress);
      if (this.data.optType == 2 && this.oldCommaddress != value) {
        this.data.obj.ischangeaddress = 1;
      }
    },
    socketClick(value) {
      this.data.obj = Object.assign(this.data.obj, this.initSocketInfo);
      if (value[0]) {
        for (let item of this.socketList) {
          if (value[0] == item.pmeterid) {
            this.data.obj = Object.assign(this.data.obj, item);
            this.oldCommaddress = this.data.obj.commaddress;
          }
        }
      }
    },
    addSocket() {
      this.data.obj = Object.assign(this.data.obj, this.initSocketInfo);
      console.log(this.data.obj);
      this.selectSocket = [];
      this.data.optType = 1;
      this.showPop = true;
    },
    updateSocket() {
      this.data.optType = 2;
      if (this.selectSocket[0]) {
        this.showPop = true;
      } else {
        this.$store.commit("UPDATE_TOAST", "请选择插头");
      }
    },
    deleteSocket() {
      this.data.optType = 3;
      if (this.selectSocket[0]) {
        this.confirmDel = true;
      } else {
        this.$store.commit("UPDATE_TOAST", "请选择插头");
      }
    },
    confirmClick() {
      this.data.obj.numberid = 1;
      this.OptSocket();
    },

    submit() {
      if (this.data.optType == 1) {
        if (this.data.obj.commaddress != "") {
          delete this.data.obj.pmeterid,
            delete this.data.obj.pointid,
            delete this.data.obj.numberid;
          this.OptSocket();
        } else {
          this.$store.commit("UPDATE_TOAST", "通訊地址不能為空");
        }
      } else {
        if (this.data.obj.commaddress != "") {
          this.OptSocket();
        } else {
          this.$store.commit("UPDATE_TOAST", "通訊地址不能為空");
        }
      }
    },
    GetSockets() {
      this.$store
        .dispatch("AC_getSockets", {
          objectid: this.$route.params.id
        })
        .then(res => {
          this.socketList = res.data.listitem;
          this.showSocketList = res.data.listitem.map(res => {
            return {
              key: res.pmeterid,
              inlineDesc: res.commaddress,
              value: res.disc
            };
          });
        });
    },
    OptSocket() {
      console.log(this.data);
      this.$store.dispatch("AC_OptSocket", this.data).then(res => {
        if (res.data.returnResult == 1) {
          this.$store.commit("UPDATE_TOAST", "操作成功");
          this.GetSockets();
          this.showPop = false;
        } else {
          this.$store.commit("UPDATE_TOAST", "操作失败");
        }
      });
    }
  }
};
</script>
<style lang="less">
@width75: 75rem;
.popup1 .weui-btn {
  border-radius: 44 / @width75;
  background: #35bab6 !important;
  width: 8.98666667rem;
  height: 1.17333333rem;
  text-align: center;
  line-height: 1.17333333rem;
  background: #35bab9;
  color: #fff;
  border-radius: 0.58666667rem;
  margin: 39 / @width75;
  font-size: 0.48rem !important;
}
.popup1 .vux-no-group-title {
  margin-top: 0;
}
.socket-manage .group1 .weui-cells__title {
  font-size: 28 / @width75;
  margin-left: 28 / @width75;
}
</style>



