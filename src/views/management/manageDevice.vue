<!-- 设备管理 -->
<template>
  <div class="device">
    <div class="search">
      <input type="text" :placeholder="$t('device.devicename')" v-model="devreqnew.commaddress">
      <span>
        <button @click="getDeviceList">{{$t("device.search")}}</button>
      </span>
      <img slot="icon" src="../../assets/icon/Section/sweep-selected@2x.png" @click="jump">
    </div>
    <p class="datano" v-show="datano">{{$t("device.nodata")}}</p>
    <!-- <scroller
      lock-x
      height="-90px"
      ref="scrollerBottom"
      use-pullup
      :pullup-config="pullupDefaultConfig"
      @on-pullup-loading="loadMore"
    > -->
      <ul>
        <li v-for="(item,index) in devlist.data" :key="index">
          <div class="surface">
            <div class="flex">
              <img src="../../assets/ammeter.png" alt="" v-if="item.signal==''">
              <img src="../../assets/nosignal.png" alt="" v-else-if="item.signal>=-971&&item.signal<=-87">
              <img src="../../assets/signal1.png" alt="" v-else-if="item.signal>=-85&&item.signal<=-75">
              <img src="../../assets/signal2.png" alt="" v-else-if="item.signal>=-73&&item.signal<=-63">
              <img src="../../assets/signal3.png" alt="" v-else-if="item.signal>=-61&&item.signal<=-30">
              <h1>{{item.commaddress}}</h1>
              <div class="register" v-if="item.bandstatus ==1">{{$t("device.bound")}}</div>
              <div class="register unregister" v-else>{{$t("device.unbound")}}</div>
              <div class="none" @click.stop="showcontent(index)">
                <img src="../../assets/icon/1@2x.png">
              </div>
            </div>
            <div class="operation" v-show="activeIndex ===index">
              <div class="square"></div> 
              <div class="edit" @click="jumped(item)">
                <img src="../../assets/icon/bianjihoutai@2x.png">
                <span class="editor" >{{$t("eleprice.edit")}}</span>
              </div>
              <div class="delete" @click="remove(item)">
                <img src="../../assets/icon/shanchu@2x.png">
                <span >{{$t("eleprice.delete")}}</span>
              </div>
              <!-- <div class="share" @click="shares(item)">
                <img src="../../assets/icon/share@2x.png">
                <span >分享</span>
              </div> -->
            </div>
            <div class="surbox">
              <div class="room">
                <h2>{{$t("barIndex.room")}}</h2>
                <p>{{item.metername}}</p>
              </div>
              <div class="eleid">
                <h2>{{$t("device.electricnumber")}}</h2>
                <p>{{item.commaddress}}</p>
              </div>
              <div class="relay">
                <h2>{{$t("device.relaystatus")}}</h2>
                <p>{{changeStatus(item.relaystatus)}}</p>
              </div>
            </div>
            <div class="surbox">
              <div class="room">
                <h2>{{$t("device.username")}}</h2>
                <p v-if="item.bandstatus ==0">无</p>
                <p v-else>{{item.chatname}}</p>
              </div>
              <div class="eleid">
                <h2>{{$t("barIndex.phone")}}</h2>
                <p v-if="item.bandstatus ==0">无</p>
                <p v-else>{{item.phone}}</p>
              </div>
              <div class="relay">
                <h2>{{$t("barIndex.surplus")}}</h2>
                <p v-if="item.bandstatus ==0">0</p>
                <p v-else>{{item.balancevlaue.toFixed(1)}}kWh</p>
              </div>
            </div>
            <div class="surbox">
              <div class="room">
                <h2>{{$t("device.manufacturer")}}</h2>
                <p v-if="item.factoryid == 1">{{$t("device.chuanglun")}}</p>
              </div>
              <div class="eleid equip">
                <h2>{{$t("device.equipmenttype")}}</h2>
                <p>{{$t("device.single")}}</p>
              </div>
            </div>
          </div>

          <div class="btngroup">
            <button @click="clear(item)">{{$t("device.refund")}}</button>
            <button @click="sluice(item)">{{$t("device.sluicegate")}}</button>
            <button @click="closing(item)">{{$t("device.close")}}</button>
            <!-- <button class="unborder" @click="refund1(item)">告警阀值</button> -->
          </div>
        </li>
      </ul>
    <!-- </scroller> -->
    <div v-transfer-dom>
      <confirm v-model="show" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("device.suregate")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="isshow" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
        <p class="text-center">{{$t("device.sureclose")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="clearshow" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirmclear">
        <p class="text-center">{{$t("device.cantdo")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="removeshow" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirmremove">
        <p class="text-center">{{$t("device.confirmdeletion")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showDialog" class="dialog-demo" @on-hide="intercept">
        <cell :title="$t('device.wait')"></cell>
        <div>
          <box gap="10px">
            <x-progress :percent="percent" :show-cancel="false"></x-progress>
            <cell :title="waitrecvMsg"></cell>
          </box>
        </div>
        <div @click="showDialog=false">
          <span class="vux-close" v-if="showcancle">{{$t("device.cancel")}}</span>
        </div>
      </x-dialog>
    </div>
    <div class="add" @click="add()" ref="add" :class="{hidden:ishidd}" >
      {{$t("eleprice.add")}}
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
import { getErrorMsg } from "@/tools/commonJs/common";
const accountid = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
// var accountid = '15303727826';
// 魏亚军的手机
// var accountid = '15988873909';
// 高超的手机
const userItem = JSON.parse(localStorage.getItem("userItem")); //获取微信号
import wechat from "@/tools/wechat";
export default {
  data() {
    return {
      clearshow: false, //提示不能操作
      datano: false, //暂无数据
      // pullupDefaultConfig: pullupDefaultConfig,
      register: true, //是否已经注册
      devlist: { //数据
        total: 0,
        data: [
          {
            "chatname":"555",
            "phone":"13033629137",
            "createtime":"Dec 12, 2019 4:41:32 PM",
            "balancevlaue":0.0,
            "commaddress":"20191212",
            "metername":"1",
            "rtuid":17578.0,
            "chatid":"omTdO1VpnX4iYCtVL1wPAIkPQV_c",
            "pricevalue":1.0,
            "factoryid":1.0,
            "devicetype":1.0,
            "alarmenergy":20.0,
            "priceid":295.0,
            "bandstatus":1.0,
            "signal":""
          },
        ]
      }, //数据
      activeIndex: -1, //删除对应的数据
      isEmpty: true,
      devreq: {
        //传递的参数
        accountid,
        pageSize: 4,
        pageNum: 1
      },
      devreqnew: { //设备传递的参数
        commaddress: "",
        accountid,
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
      status: true,
      ishidd:false
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
    XButton,
    Alert
  },

  computed: {},

  mounted() {
    // this.$nextTick(() => {
    //   this.$refs.scrollerBottom.reset({ top: 0 });
    // });
    // this.loadMore();
    // window.onresize = () => {
    //   if(this.$refs.add.getBoundingClientRect().top<420){
    //     this.ishidd=true;
    //   }else if(this.$refs.add.getBoundingClientRect().top==0){
    //     this.ishidd=false;
    //   }
    // }
    this.getDeviceList()
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
    clear(item) {
      if (item.bandstatus == 1) {
        this.$router.push({ path: "/manageRefund", query: { funditem: JSON.stringify(item) } });
      } else {
        this.clearshow = true;
      }
    },

    // 拉闸
    sluice(item) {
      this.show = true;
      this.items = item;
      this.status = true;
    },
    // 跳转到扫描页面
    jump() {
      wechat.callqrCode();
    },
    // 合闸
    closing(item) {
      this.isshow = true;
      this.items = item;
      this.status = false;
    },
    // 删除
    remove: function(item) {
      this.removeshow = true;
      this.prompt = item.rtuid;
    },
    // 确认删除
    onConfirmremove() {
      this.$store
        .dispatch("AC_DeleteDevInfo", {
          rtuid: this.prompt
        })
        .then(res => {
          if (res.data.returncode == 1) {
            this.$router.go(0);
          }
        });
    },
    // 分享
    shares(item){
      wechat.share(item);
    },
    onConfirmclear() {},
    // 编辑
    jumped: function(item) {
      this.$router.push({ path: "/editor", query: { funditem: item } });
    },
    // 添加
    add: function() {
      this.$router.push('/equipmentnew');
    },
    // 告警阀值
    refund1(item) {
      
      this.$router.push({ path: "/managetry", query: { funditem: item } });
    },

    //   获取设备
    // getDevice(fn) {
    //   api.GetDevInfo(this.devreqnew).then(res => {
    //     this.$nextTick(() => {
    //       this.$refs.scrollerBottom.reset();
    //     });
    //     this.devlist.total = res.data.total;
    //     if (this.devreqnew.pageNum > 1) {
    //       this.devlist.data = this.devlist.data.concat(res.data.devUsersItems);
    //     } else {
    //       this.devlist.data = res.data.devUsersItems;
    //     }
    //     if (res.data.total == 0) {
    //       this.datano = true;
    //     }
    //     fn();
    //   });
    // },
    getDeviceList() {
      let obj = {
        accountid,
        pageNum: 1,
        pageSize: 10,
        roomid: this.$store.state.roomid
      }
      api.getDevInfo(obj).then(res => {
        console.log(res, '设备列表')
        this.devlist.data = res.data.devUsersItems
      })
    },
    // 搜索
    search: function() {
      // api.GetDevInfo(this.devreqnew).then(res => {
      //   this.$nextTick(() => {
      //     this.$refs.scrollerBottom.reset();
      //   });
      //   this.devlist.total = res.data.total;
      //   if (this.devreqnew.pageNum > 1) {
      //     this.devlist.data = this.devlist.data.concat(res.data.devUsersItems);
      //   } else {
      //     this.devlist.data = res.data.devUsersItems;
      //   }
      //   if (this.datano == true) {
      //     this.datano = false;
      //     if (res.data.total == 0) {
      //       this.datano = true;
      //     }
      //   } else {
      //     if (res.data.total == 0) {
      //       this.datano = true;
      //     }
      //   }
      // });
      
      // let obj = {
      //   accountid,
      //   serachValue: this.devreqnew.commaddress
      // }
      // api.selectAllDev(obj).then(res => {
      // })
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

    // 根据继电器状态返回
    changeStatus(value) {
      if (value == 1) {
        return this.$t("device.close");
      } else return this.$t("device.sluicegate");
    },

    // 确定拉闸合闸
    onConfirm() {
      if (this.items.commaddress.length > 11) {
        this.commad = this.items.commaddress.slice(-11);
      } else if (this.items.commaddress.length < 11) {
        this.commad = this.items.commaddress;
        for (let i = this.items.commaddress.length; i < 11; i++) {
          this.commad = "0" + this.commad;
        }
      }
      this.tokenreq.meterno = this.commad;
      // 获取token
      api.GetToken(this.tokenreq).then(res => {
        this.tokenvalue = res.data.tokenvalue.replace(/-/g, "");
        this.sendData(this.items);
      });
    },
    // 发送数据
    sendData(item) {
      this.switchList.objectid = item.rtuid;
      this.switchList.content.data = this.tokenvalue;
      if (this.status == true) {
        this.switchList.content.data = "0";
      } else {
        this.switchList.content.data = "1";
      }
      this.genTaskid();
      this.genRequestid();
      this.$store.dispatch("AC_SendCharing", this.switchList).then(res => {
        // console.log(res.data);
        if (res.data.success == 1) {
          this.receiveData();
        } else {
          this.$store.commit("UPDATE_TOAST", "失败");
        }
      });
    },
    // 接收数据
    receiveData() {
      this.$store.dispatch("AC_ReceiveCharing", this.switchList).then(res => {
        if (this.interrupt) {
          this.displayTimeout = false;
          this.percent = 0;
        } else {
          if (this.recvTimeoutCount == 10) {
            this.showDialog = true;
          }
          this.percent = ((10 - this.recvTimeoutCount) / 10) * 100;
        }

        if (res.data.isresive == 0 && this.recvTimeoutCount > 0) {
          setTimeout(() => {
            this.recvTimeoutCount--;
            this.receiveData();
          }, 5000);
        } else if (
          res.data.isresive == 1 &&
          res.data.content.data[0].result == 0
        ) {
          this.showcancle = true;
          this.percent = 100;
          this.waitrecvMsg = "成功";
        } else if (
          res.data.isresive == 1 &&
          res.data.content.data[0].result == 1
        ) {
          this.percent = 100;
          this.showcancle = true;
          this.waitrecvMsg = getErrorMsg(
            res.data.content.data[0].errortype,
            res.data.content.data[0].errorcode
          );
        } else {
          this.percent = 100;
          this.waitrecvMsg = "超时";
          this.showcancle = true;
        }
      });
    },
    intercept() {
      this.interrupt = false;
      this.recvTimeoutCount = 10;
      this.showDialog = false;
      this.percent = 0;
      this.waitrecvMsg = "";
    },
    genTaskid() {
      this.switchList.taskid = this.genRandomNum(1000, 9999);
    },
    genRequestid() {
      this.switchList.requestid = this.randomWord(false, 8, 8);
    },
    genRandomNum(min, max) {
      let range = max - min;
      let rand = Math.random();
      return min + Math.round(rand * range);
    },
    randomWord(randomFlag, min, max) {
      let str = "",
        range = min,
        arr = [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j",
          "k",
          "l",
          "m",
          "n",
          "o",
          "p",
          "q",
          "r",
          "s",
          "t",
          "u",
          "v",
          "w",
          "x",
          "y",
          "z",
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z"
        ];
      let pos;
      // 随机产生
      if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
      }
      for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
      }
      return str;
    }
  },
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.device {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  min-height: 100%;
  margin-bottom: 100 / @width75;
  .search {
    display: flex;
    padding: 18 / @width75 48 / @width75 18 / @width75 38 / @width75;
    justify-content: space-between;
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
          >img{
            width: 32/@width75;
            height: 32/@width75;
            display: block;
            margin: 5px 10/@width75 0 0;
          }
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
          margin: 0 0 0 30 / @width75;
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
    left: 0;
    height: 88 / @width75;
    line-height: 88 / @width75;
    width: 100%;
    text-align: center;
    font-size: 36 / @width75;
    background: rgb(53, 186, 182);
    color: white;
  }
  .hidden{
    position:static;
    margin-top: 30/@width75;
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
.vux-cell-primary p{
  width: 104%;
}
</style>
