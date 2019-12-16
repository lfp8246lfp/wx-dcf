<!--告警电量详情  -->
<template>
  <div class="realarm">
    <form action class="information">
      <p>告警电量</p>
      <input type="text" placeholder="告警电量值" v-model="wifileakenergy">
      <span>(kWh)</span>
    </form>
    <div class="alarm">
      <x-button @click.native="read" class="refund-btn">读取</x-button>
      <x-button @click.native="set" class="refund-btn">设置</x-button>
    </div>

    <div v-transfer-dom>
      <confirm v-model="show" title="提示" @on-confirm="onConfirm">
        <p class="text-center">确定读取告警阀值</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="isshow" title="提示" @on-confirm="onConfirm">
        <p class="text-center">确定设置告警阀值</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="alarmshow" title="提示" @on-confirm="onConfirm1">
        <p class="text-center">请输入告警阀值</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showDialog" class="dialog-demo" @on-hide="intercept">
        <cell title="等待数据回复中..."></cell>
        <div>
          <box gap="10px">
            <x-progress :percent="percent" :show-cancel="false"></x-progress>
            <cell :title="waitrecvMsg"></cell>
          </box>
        </div>
        <div @click="showDialog=false">
          <span class="vux-close" v-if="showcancle">取消</span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import api from "../../api/Piles.js";
import { getErrorMsg } from "@/tools/commonJs/common";
var id = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
var userItem = JSON.parse(localStorage.getItem("userItem")); //获取微信号
import {
  Radio,
  Group,
  XButton,
  TransferDom,
  XDialog,
  XProgress,
  Cell,
  Box,
  Confirm
} from "vux";
export default {
  data() {
    return {
      wifileakenergy: "", //告警电量
      alarmshow: false, //告警阀值提示
      funditems: "", //传递过来的数据对象
      switchList: {
        objectid: 17122,
        objecttype: 1,
        requestid: "requestid",
        taskid: 5579,
        isresive: 0,
        afn: "2",
        content: {
          name: "F95",
          data: ""
        }
      },
      interrupt: false,
      percent: 0, //进度
      showDialog: false,
      waitrecvMsg: "", //提示信息
      showcancle: false, //取消
      recvTimeoutCount: 10,
      show: false, //弹框是否显示
      isshow: false,
      tokenreq: {
        //获取token的请求参数
        meterno: "",
        chargevalue: "0",
        isclear: 1
      },
      tokenvalue: "", //获取的token值
      commad: "",
      objid: "",
      energy: {
        wifileakenergy: 0
      }
    };
  },
  directives: {
    TransferDom
  },
  components: {
    Radio,
    Group,
    XButton,
    XDialog,
    XProgress,
    Cell,
    Box,
    Confirm
  },

  computed: {},

  mounted() {
    this.funditems = this.$route.query.funditem;
    this.objid = this.funditems.rtuid;
  },

  methods: {
    //   告警电量处理点击事件
    read() {
      this.show = true;
      this.switchList.afn = "2";
    },
    // 设置
    set() {
      if (this.wifileakenergy == "") {
        this.alarmshow = true;
      } else {
        this.isshow = true;
        this.switchList.afn = "1";
      }
    },
    // 确定事件
    onConfirm() {
      if (this.funditems.commaddress.length > 11) {
        this.commad = this.funditems.commaddress.slice(-11);
      } else if (this.funditems.commaddress.length < 11) {
        this.commad = this.funditems.commaddress;
        for (let i = this.funditems.commaddress.length; i < 11; i++) {
          this.commad = "0" + this.commad;
        }
      }
      this.tokenreq.meterno = this.commad;
      // 获取token
      //   console.log(this.commad);
      api.GetToken(this.tokenreq).then(res => {
        // console.log(this);
        this.tokenvalue = res.data.tokenvalue.replace(/-/g, "");
      });
      this.energy.wifileakenergy = this.wifileakenergy;
      this.sendData(this.funditems);
    },
    // 提示弹框
    onConfirm1() {
      this.showDialog = false;
    },
    // 发送数据
    sendData(item) {
      this.switchList.objectid = item.rtuid;
      if (this.switchList.afn == 1) {
        this.switchList.content.data = this.energy;
      } else if (this.switchList.afn == 2) {
        this.switchList.content.data = "";
      } else {
        alert("错误的输入");
      }
      // energy;
      this.genTaskid();
      this.genRequestid();
      this.$store.dispatch("AC_SendCharing", this.switchList).then(res => {
        if (res.data.success == 1) {
          this.receiveData();
        } else {
          this.$store.commit("UPDATE_TOAST", "失败");
        }
      });
    },
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
          this.wifileakenergy = res.data.content.data[0].data[0].wifileakenergy;
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
      this.showcancle = false;
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
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.realarm {
  .information {
    margin: 0 39 / @width75;
    display: flex;
    overflow: hidden;
    height: 150 / @width75;
    line-height: 150 / @width75;
    font-size: 32 / @width75;
    font-weight: bold;
    color: red;
    p {
      position: relative;
      top: 4 / @width75;
    }
    input {
      text-align: center;
      background: #fafafa;
    }
    span {
      color: black;
    }
  }
  .alarm {
    display: flex;
    overflow: hidden;
    .refund-btn {
      width: 337 / @width75;
      height: 66 / @width75;
      line-height: 66 / @width75;
      background: #35bab7;
      color: #fff;
      text-align: center;
      margin: 60 / @width75 auto;
      border-radius: 44 / @width75;
      font-size: 36 / @width75 !important;
    }
  }
}
</style>
<style lang="less" >
@width75: 75rem;
.fund {
  .weui-cells__title {
    height: 68 / @width75;
    line-height: 68 / @width75;
    padding: 7 / @width75 0 6 / @width75;
    padding-left: 38 / @width75;
    margin: 0;
  }
  .weui-cell {
    padding: 24 / @width75 38 / @width75;
    font-size: 28 / @width75;
  }
}
// .weui-cells_radio .weui-cell__bd .vux-radio-icon {
//   display: inline-block !important;
//   width: 36 / @width75;
//   height: 36 / @width75;
//   border: none;
// }
</style>
