<!-- 房间管理 -->
<template>
  <div id="room" @click="activeIndex = -1">
      <ul>
        <li v-for="(item,index) in roomList" :key="index">
          <div class="item">
            <div class="head">
              <img src="../../assets/icon/house.png" alt="">
              <h2>{{item.roomname}}</h2>
              <span class="status"></span>
              <div class="tool" @click.stop="showcontent(index)">
                <img src="../../assets/icon/1@2x.png">
              </div>
            </div>

            <div class="operation" v-show="activeIndex === index">
              <div class="square"></div> 
              <div class="edit" @click="jumped(item)">
                <img src="../../assets/icon/bianjihoutai@2x.png">
                <span class="editor">编辑</span>
              </div>
              <div class="delete" @click="remove(item)">
                <img src="../../assets/icon/shanchu@2x.png">
                <span>删除</span>
              </div>
            </div>

            <div class="content">
                <ul>
                    <li>
                        <span>用户名：</span>
                        {{item.accountid}}
                    </li>
                    <li>
                        <span>所属区域：</span>
                        {{item.province + ' ' + item.town + ' ' + item.region}}
                    </li>
                    <li>
                        <span>详细地址：</span>
                        {{item.disc}}
                    </li>
                </ul>
            </div>

          </div>

          <div class="btngroup">
            <button @click="rentConfig(item)">
                房租配置
            </button>
            <button @click="$router.push({name: 'manageDevice', params: {id: item.id}})">
                房间设备
            </button>
            <!-- <button @click="$router.push('/monthConsumption')">
                月用量编辑
            </button> -->
          </div>
        </li>
      </ul>
      <toast v-model="showToast" type="text" :time="800" is-show-mask :text="toastText" width="20em"></toast>
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
  Confirm,
  TransferDom,
  XDialog,
  XProgress,
  Cell,
  Box,
  XButton,
  Alert,
  Toast
} from "vux";
import api from "../../api/Piles.js";
import { getErrorMsg } from "@/tools/commonJs/common";
const accountid = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
// const accountid = '15303727826';
// const accountid = '15988873909';
const userItem = JSON.parse(localStorage.getItem("userItem")); //获取微信号
import wechat from "@/tools/wechat";
export default {
  data() {
    return {
      roomList: [],
      showToast: false,
      toastText: '',
      clearshow: false, //提示不能操作
      datano: false, //暂无数据
      register: true, //是否已经注册
      devlist: { //数据
        total: 0,
        data: []
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
      ishidd:false,
      item: ''
        // 暂存要删除房间的信息
    };
  },
  directives: {
    TransferDom
  },
  components: {
    Confirm,
    XDialog,
    XProgress,
    Cell,
    Box,
    XButton,
    Alert,
    Toast
  },

  computed: {},

  mounted() {
    // this.loadMore();
    // window.onresize = () => {
    //   if(this.$refs.add.getBoundingClientRect().top<420){
    //     this.ishidd=true;
    //   }else if(this.$refs.add.getBoundingClientRect().top==0){
    //     this.ishidd=false;
    //   }
    // }
    this.getRoomList()
  },

  methods: {
      getRoomList() {
          let obj = {
              pageNum: 1,
              pageSize: 10,
              accountid
          }
          api.getUnitList(obj).then(res => {
              console.log(res, '房间列表')
              this.roomList = res.data.items
          })
      },
      rentConfig(item) {
        console.log(item, 'item')
        if (item.renttotal > 0) {
          this.$router.push({
            name: 'tenantsRecord',
            params: {id: item.id}
          })
          return
        }
        if (item.rtunum < 1) {
          this.toastText = '该房间暂时不能配置房租'
          this.showToast = true
        } else if (item.rtunum > 1) {
          this.$router.push({name: 'searchTenant', params: item})
        } else {
          this.$router.push({name: 'rentConfiguration', params: item})
        }
      },
    showcontent: function(index) {
      if (this.activeIndex == index && this.activeIndex != -1) {
        this.activeIndex = -1;
      } else {
        this.activeIndex = index;
      }
    },
    // 删除
    remove(item) {
      this.removeshow = true;
      this.prompt = item.rtuid;
      this.item = item
    },
    // 确认删除
    onConfirmremove() {
      let {id, accountid: householdName, roomname, province, town, region, disc} = this.item
      let obj = {id, householdName, roomname, province, town, region, disc, optype: 3, accountid}
      api.optUnit(obj).then(res => {
        console.log(res, '删除房间')
        this.getRoomList()
      })
      // this.$store
      //   .dispatch("AC_DeleteDevInfo", {
      //     rtuid: this.prompt
      //   })
      //   .then(res => {
      //     if (res.data.returncode == 1) {
      //       this.$router.go(0);
      //     }
      //   })
    },
    // 分享
    shares(item){
      wechat.share(item);
    },
    onConfirmclear() {},
    // 编辑
    jumped(item) {
      console.log(item, '编辑参数')
      this.$router.push({ name: "editRoom", params: item });
    },

    // 添加
    add() {
      this.$router.push({ path: "/editRoom" });
    },
    // 告警阀值
    refund1(item) {
      
      this.$router.push({ path: "/managetry", query: { funditem: item } });
    },

    //   获取设备
    getDevice(fn) {
      api.GetDevInfo(this.devreqnew).then(res => {
        this.devlist.total = res.data.total;
        if (this.devreqnew.pageNum > 1) {
          this.devlist.data = this.devlist.data.concat(res.data.devUsersItems);
        } else {
          this.devlist.data = res.data.devUsersItems;
        }
        if (res.data.total == 0) {
          this.datano = true;
        }
        fn();
      });
    },
    // 搜索
    search: function() {
      api.GetDevInfo(this.devreqnew).then(res => {
        this.devlist.total = res.data.total;
        if (this.devreqnew.pageNum > 1) {
          this.devlist.data = this.devlist.data.concat(res.data.devUsersItems);
        } else {
          this.devlist.data = res.data.devUsersItems;
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
#room {
    position: absolute;
    width: 100%;
    min-height: 100%;
    background-color: rgb(245,245,245);
    padding-bottom: 100 / @width75;
    box-sizing: border-box;
  >ul {
    padding: 20 / @width75 38 / @width75;
    >li {
      background: #fff;
      margin-bottom: 20 / @width75;
      .item {
        padding: 20 / @width75;
        position: relative;
        border-bottom: 1px solid #f6f6f6;
        .head {
          display: flex;
          overflow: hidden;
          h2 {
              height: 96 / @width75;
              font-size: 32 / @width75;
              font-weight: 700;
              line-height: 96 / @width75;
          }
          >img{
            width: 32/@width75;
            height: 32/@width75;
            display: block;
            margin: 30/@width75 10/@width75 0 0;
          }
          .tool {
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
      }
      .content {
        ul {
            li {
                height: 46 / @width75;
                line-height: 46 / @width75;
                span {
                    color: rgb(153,153,153);
                }
            }
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
      .btngroup {
        display: flex;
        button {
          width: 336 / @width75;
          padding: 16 / @width75 0 18 / @width75;
          background: #fff;
          color: #35bab6;
          font-size: 24 / @width75;
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
