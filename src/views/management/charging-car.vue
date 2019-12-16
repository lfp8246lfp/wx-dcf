<!-- 设备管理 -->
<template>
  <div class="device">
    <div class="search">
      <input type="text" placeholder="搜索设备" v-model="devreqnew.commaddress">
      <span>
        <button @click="search" style="color: #35bab6;">搜索</button>
      </span>
      <img slot="icon" src="../../assets/icon/Section/sweep-selected@2x.png" @click="jump">
    </div>
    <p class="datano" v-show="datano">
      <img src="../../assets/noData.png" alt="">
      <br>
      暂无数据
    </p>
    <scroller
      lock-x
      height="-100px"
      ref="scrollerBottom"
      use-pullup
      :pullup-config="pullupDefaultConfig"
      @on-pullup-loading="loadMore"
    >
      <ul>
        <li v-for="(item,index) in devlist.data" :key="index">
          <div class="surface">
            <div class="flex">
               <img src="..\..\assets\chargingplug.png" width="24" height="24">
              <h1>&nbsp;{{item.disc}}</h1>
              <!-- <div class="none" @click="showcontent(index)">
                <img src="../../assets/icon/1@2x.png">
              </div> -->
            </div>
            <div class="operation" v-show="activeIndex ===index">
              <div class="square"></div> 
              <div class="edit" @click="jumped(item)">
                <img src="../../assets/icon/bianjihoutai@2x.png">
                <span class="editor" >编辑</span>
              </div>
              <div class="delete" @click="remove(item)">
                <img src="../../assets/icon/shanchu@2x.png">
                <span >删除</span>
              </div>
              <!-- <div class="share" @click="shares(item)">
                <img src="../../assets/icon/share@2x.png">
                <span >分享</span>
              </div> -->
            </div>
            <div class="surbox">
              <div class="room">
                <h2>通讯地址</h2>
                <p>{{item.commaddress}}</p>
              </div>
              <div class="eleid">
                <h2>充电站编号</h2>
                <p>{{item.version}}</p>
              </div>
              <div class="relay">
                <h2>插座数量</h2>
                <p>{{item.plugnum}}</p>
              </div>
            </div>
            <div class="surbox">
              <div class="room">
                <h2>经度</h2>
                <p>{{item.longitude}}</p>
              </div>
              <div class="eleid">
                <h2>维度</h2>
                <p>{{item.dimension}}</p>
              </div>
              <div class="relay">
                <h2>电站类型</h2>
                <p>{{changeStatus(item.apptype)}}</p>
              </div>
            </div>
            <div class="surbox">
              <div class="room">
                <h2>安装位置</h2>
                <p>{{item.installer}}</p>
              </div>
            </div>
          </div>

          <div class="btngroup">
            <button @click="edit(item)">编辑</button>
            <button @click="remove(item)">删除</button>
            <button @click="plugmanage(item)">插座管理</button>
            <!-- <button class="unborder" @click="refund1(item)">告警阀值</button> -->
          </div>
        </li>
      </ul>
    </scroller>
    <div v-transfer-dom>
      <confirm v-model="removeshow" title="提示" @on-confirm="onConfirmremove">
        <p class="text-center">确定删除？</p>
      </confirm>
    </div>
    <div class="add">
      <span @click="add()">新增</span>
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
  XButton
} from "vux";
import api from "../../api/Piles.js";
import { getErrorMsg } from "@/tools/commonJs/common";
import StationList from "@/views/module/stationList";
import wx from "weixin-js-sdk";
var id = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
var userItem = JSON.parse(localStorage.getItem("userItem")); //获取微信号
import wechat from "@/tools/wechat";
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
      optType:"",
      datas:{
      
      },
      delRtuid:"",
      clearshow: false, //提示不能操作
      datano: false, //暂无数据
      pullupDefaultConfig: pullupDefaultConfig,
      register: true, //是否已经注册
      devlist: { //数据
        total: 0,
        data: []
      }, //数据
      activeIndex: -1, //删除对应的数据
      isEmpty: true,
      devreq: {
        //传递的参数
        accountid: id,
        pageSize: 4,
        pageNum: 1
      },
      devreqnew: { //设备传递的参数
        commaddress: "",
        accountid: id,
        pageSize: 4,
        pageNum: 1
      },
    //   a: "1",
      tokenreq: {
        //获取token的请求参数
        meterno: "",
        chargevalue: "0",
        isclear: 1
      },
      tokenvalue: "", //获取的token值
      commad: "",
      switchList: {
        objectid: 17122,
        objecttype: 1,
        requestid: "requestid",
        taskid: 5579,
        isresive: 0,
        afn: "3",
        content: {
          name: "F11",
          data: ""
        }
      },
      interrupt: false,
      percent: 0, //进度
      showDialog: false,
      waitrecvMsg: "", //提示信息
      showcancle: false,  //取消
      isshow: false, //合闸显隐
      recvTimeoutCount: 10,
      show: false, //弹框是否显示
      removeshow: false, //删除提示
      prompt: "",
      tokenreq: {
        //获取token的请求参数
        meterno: "",
        chargevalue: "0",
        isclear: 1
      },
      items: "",
      status: true
    };
  },
  directives: {
    TransferDom
  },
  components: {
    XInput,
    Scroller,
    Confirm,
    XDialog,
    XProgress,
    Cell,
    Box,
    XButton
  },

  computed: {},

  mounted() {
    this.$nextTick(() => {
      this.$refs.scrollerBottom.reset({ top: 0 });
    });
    this.loadMore();
  },

  methods: {
    showcontent: function(index) {
      if (this.activeIndex == index && this.activeIndex != -1) {
        this.activeIndex = -1;
      } else {
        this.activeIndex = index;
      }
    },
    //   清零
    edit(item) {
          this.$router.push({ path: "/chargingnew", query: { funditem: item } });
    },
    // 跳转到扫描页面
    jump() {
      wechat.callqrCode();
    },
    // 删除
    remove: function(item) {
      this.removeshow = true;
      this.optType=3;
      this.delRtuid = item.rtuid;
    },
    plugmanage(item){
         //console.log(item);
         this.$router.push(`/socketManage/${item.rtuid}`);
    },
    // 确认删除
    onConfirmremove() {
      this.OptStation();
    },
    OptStation() {
      if(this.optType!=null&&this.optType==3){
          this.datas={
            optType : this.optType,
            accountid:id,
            obj:{
              rtuid :this.delRtuid
            }
          }
      }
      this.$store
        .dispatch("AC_OptStation",this.datas)
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
    },
    // // 分享
    // shares(item){
    //   wechat.share(item);
    // },
    onConfirmclear() {},
    // 编辑
    jumped: function(item) {
      this.$router.push({ path: "/editor", query: { funditem: item } });
    },
    // 添加
    add: function() {
      this.$router.push({ path: "/chargingnew" });
    },

    //   获取设备
    getDevice(fn) {
      this.devreqnew.accountid=id;
      api.queryChargingInfo(this.devreqnew).then(res => {
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset();
        });
        this.devlist.total = res.data.total;
        if (this.devreqnew.pageNum > 1) {
          this.devlist.data = this.devlist.data.concat(res.data.listitem);
        } else {
          this.devlist.data = res.data.listitem;
        }
        if (res.data.total == 0) {
          this.datano = true;
        }
        fn();
      });
    },
    // 搜索
    search: function() {
      this.devreqnew.accountid=id;
      //this.devreqnew.accountid="admin";
      api.queryChargingInfo(this.devreqnew).then(res => {
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset();
        });
        this.devlist.total = res.data.total;
        if (this.devreqnew.pageNum > 1) {
          this.devlist.data = this.devlist.data.concat(res.data.listitem);
        } else {
          this.devlist.data = res.data.listitem;
        }
        if (this.datano == true) {
          this.datano = false;
          if (res.data.total == 0) {
            this.datano = true;
          }
        } else {
          if (res.data.total == 0) {
            this.datano = true;
          }
        }
      });
    },
    // 加载更多数据
    loadMore() {
      if (this.isEmpty) {
        this.isEmpty = false;
      } else {
        this.devreqnew.pageNum++;
      }
      this.getDevice(() => {
        let index = this.devreqnew.pageSize * this.devreq.pageNum;
        if (this.devlist.total <= index) {
          this.$refs.scrollerBottom.disablePullup();
        }
        this.$refs.scrollerBottom.donePullup();
      });
    },

    changeStatus(value) {
      if (value == 1) {
        return "电瓶车";
      } else if(value == 2){
         return "电动汽车";
      }
    },
    intercept() {
      this.interrupt = false;
      this.recvTimeoutCount = 10;
      this.showDialog = false;
      this.percent = 0;
      this.waitrecvMsg = "";
    },
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.device {
  .search {
    display: flex;
    padding: 18 / @width75 48 / @width75 18 / @width75 38 / @width75;
    justify-content: space-between;
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
    padding: 20 / @width75 38 / @width75;
    li {
      background: #fff;
      margin-bottom: 20 / @width75;
      .surface {
        padding: 20 / @width75 0 16 / @width75 30 / @width75;
        position: relative;
        border-bottom: 1px solid #f6f6f6;
        .flex {
          display: flex;
          overflow: hidden;
          .none {
            position: absolute;
            top: 20 / @width75;
            right: 0;
            width: 156 / @width75;
            height: 40 / @width75;
            line-height: 40 / @width75;
            text-align: center;
            img {
              width: 42 / @width75;
              height: 42 / @width75;
            }
          }
        }
        h1 {
          padding: 6 / @width75 0 16 / @width75;
          font-size: 32 / @width75;
          font-weight: bold;
        }
        .register {
          width: 110 / @width75;
          height: 40 / @width75;
          line-height: 40 / @width75;
          text-align: center;
          border-radius: 30 / @width75;
          margin: 0 0 0 75 / @width75;
          border: 2 / @width75 solid #96d79f;
          color: #96d79f;
        }
        .unregister {
          border: 2 / @width75 solid #f29279;
          color: #f29279;
        }
      }
      .operation {
        position: absolute;
        top: 80/@width75;
        right: 0;
        line-height: 88 / @width75;
        width: 228/@width75;
        z-index: 10000;
        font-size: 32/@width75;
        color: white;
        >div{
          display: flex;
          align-items: center;
          background: rgb(51, 51, 51);
          justify-content:center;
        }
        img {
          margin: 0 25 / @width75 0 0;
          height: 32 / @width75;
          width: 32 / @width75;
        }
        .delete{
          border-top: 1px solid rgb(77, 77, 77);
          border-bottom: 1px solid rgb(77, 77, 77);
          border-radius: 0 0  10/@width75 10/@width75;
        }
        .edit{border-radius: 10/@width75 10/@width75 0 0 }
        // .share{border-radius:0 0  10/@width75 10/@width75 ;
        //   img{
        //     width: 24/@width75;
        //     padding: 0 4/@width75;
        //   }
        // }
        span{
          display: inline-block;
        }
        .square{
          background: none;
          width: 0;
          height:0;
          border-width:0 10px 10px 10px;
          border-style:solid;
          border-color:transparent transparent rgb(51, 51, 51) transparent ;
          margin-left: 140/@width75;
        }
      }
      .surbox {
        margin-top: 20 / @width75;
        display: flex;
        .room {
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
        .equip {
          width: 380 / @width75;
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
        display: flex;
        button {
          width: 336 / @width75;
          padding: 16 / @width75 0 18 / @width75;
          background: #fff;
          color: #35bab6;
          font-size: 32 / @width75;
          border-right: 1px solid #f4f4f4;
          display: block;
        }
        .unborder {
          border: none;
        }
      }
    }
  }
  .add {
    position: fixed;
    bottom: 0;
    height: 88 / @width75;
    line-height: 88 / @width75;
    width: 750 / @width75;
    text-align: center;
    font-size: 36 / @width75;
    background: rgb(53, 186, 182);
    color: white;
    span {
      display: block;
      color: white;
      height: 88 / @width75;
      line-height: 88 / @width75;
      width: 750 / @width75;
    }
  }
}
</style>
<style lang="less">
@width75: 75rem;
.weui-cell[data-v-2eee73fe] {
  background: #efefef;
  width: 548 / @width75;
  padding: 0;
  .weui-input {
    width: 440 / @width75;
    padding: 0 89 / @width75 0 21 / @width75;
    height: 52 / @width75;
  }
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
//   display: none !important;
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
