<template>
  <div class="mine-wrap" ref="wrapper">
    <div class="mine-header">
      <div class="my-wallet">
        <div class="my-wallet-bottom">
          <div class="my-wallet-content">
            <router-link to="/personal">
              <img src="../assets/money@2x.png">
              <h4>{{balancevalue}}</h4>
              <p>{{$t("meterlow.accountbalance")}}</p>
              <p>({{$t("record.yuan")}})</p>
            </router-link>
          </div>
          <div class="my-wallet-line"></div>
          <div class="my-wallet-content">
            <img src="../assets/14@2x.png">
            <h4>{{balanceenergy}}</h4>
            <p>{{$t("barIndex.surplus")}}</p>
            <p>(kWh)</p>
          </div>
        </div>
      </div>
    </div>
    <div class="my-meter-information" v-for="(item,index) in meterlists" :key="index">
      <div class="code">
        <div class="code-one">
          <img src="../assets/ammeter.png" alt="" v-if="item.signal==''">
          <img src="../assets/nosignal.png" alt="" v-else-if="item.signal>=-971&&item.signal<=-87">
          <img src="../assets/signal1.png" alt="" v-else-if="item.signal>=-85&&item.signal<=-75">
          <img src="../assets/signal2.png" alt="" v-else-if="item.signal>=-73&&item.signal<=-63">
          <img src="../assets/signal3.png" alt="" v-else-if="item.signal>=-61&&item.signal<=-30">
          <p>
            {{$t("device.electricnumber")}}：<span>{{item.commaddress}}</span>
          </p>
          <img src="../assets/function.png" alt="" class="fun" @click="showOprate(index)" v-if="!isMore">
          <div class="box" v-show="isOprate ==index ">
            <div class="sj"></div>
            <ul class="opration" >
            <li>
              <router-link :to="{ path: 'chargeRecord', query: { rtuid: item.rtuid }}">
                <img src="../assets/chargeRecode.png" alt="">
                <span>{{$t("meterlow.chargingrecord")}}</span>
              </router-link>
            </li>
            
            <li>
              <router-link :to="{ path: 'meterBase', query: { rtuid: item.rtuid }}">
                <img src="../assets/meterbase.png" alt="">
                <span>{{$t("barIndex.surplus")}}</span>
              </router-link>
            </li>
            <li>
              <router-link :to="{ path: 'dumpMeter', query: { rtuid: item.rtuid }}">
                <img src="../assets/dumpmeter.png" alt="">
                <span>{{$t("meterlow.powerconsumption")}}</span>
              </router-link>
            </li>
            <li>
              <router-link :to="{path:'equipment', query:{funditem: item}}">
                <img src="../assets/position.png" alt="">
                <span>{{$t("meterlow.deviceinfo")}}</span>
              </router-link>
            </li>
          </ul>
          </div>
        </div>
        <div class="code-two">
          <div>
            <p>{{$t("meterlow.devicestatus")}}：<span
                v-if="item.curstatus==1"
                style="color:green;"
                class="showzaixian"
              >{{$t("meterlow.online")}}</span>
              <span v-else style="color:red;" class="showzaixian">{{$t("meterlow.offline")}}</span>
            </p>
            <p>{{$t("barIndex.surplus")}}：<span class="num">{{item.balancevlaue.toFixed(1)}}(kWh)</span></p>
          </div>
          <button
            type="default"
            @click="show(index)"
            class="recharge"
          >{{$t("meterlow.charge")}}</button>
        </div>
      </div>
      <!-- <div class="float">
        <div v-if="showLow">
          <img src="../assets/1@2x.png">
          <p>电量不足</p>
        </div>
        <div v-else>
          <img src="../assets/112@2x.png">
          <p>电量充足</p>
        </div>
      </div> -->
      <div class="money-low" v-show="activeIndex ===index">
        <p>{{$t("meterlow.chooseamount")}}</p>
        <div class="money">
          <div
            @click="money(item,index)"
            v-for="(item,index) in items"
            :key="index"
            v-bind:class="{bg:index==isactive}"
          >
            <p>￥{{item}}</p>
          </div>

          <div class="changestyle">
            <input
              v-on:input="tt($event)"
              type="text"
              autocomplete="off"
              :placeholder="$t('meterlow.enteramount')"
              v-model="result"
            >
          </div>
        </div>
        <div class="money-information">
          <p class="meter-price">
            <span>{{$t("meterlow.currentprice")}}:</span>
            {{item.pricevalue}}{{$t("record.yuank")}}
          </p>
          <p class="meter-count">
            <span>{{$t("meterlow.equivalentel")}}:</span>
            {{totalnew.toFixed(1)}}（kWh）
          </p>
        </div>
        <hr>
        <div class="money-balance">
          <div >
            <p>
              <span>
                <img src="../assets/11@2x.png">
              </span>
              <span class="moneyinfo">{{$t("meterlow.mybalance")}}{{balancevalue}}（元）</span>
              <span>
                <img src="../assets/buzu@2x.png" v-show="nowMoney > balancevalue">
                <img src="../assets/zugou@2x.png" v-show="nowMoney < balancevalue">
              </span>
            </p>
          </div>
        </div>
        <div class="btns">
          <button class="money-can"  @click="cancles">{{$t("device.cancel")}}</button>
          <button class="money-button" @click="recharge">{{$t("device.determine")}}</button>
        </div>
      </div>
      <div v-transfer-dom>
        <confirm v-model="shows" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm">
          <p class="text-center">{{$t("recharge.derecharge")}}</p>
        </confirm>
      </div>
      <div v-transfer-dom>
        <confirm v-model="showspoint" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirmpoint">
          <p class="text-center">{{$t("put.onenum")}}</p>
        </confirm>
      </div>
      <div v-transfer-dom>
        <confirm v-model="alarmshow" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm1">
          <p class="text-center">{{$t("meterlow.minute")}}</p>
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
          <div @click="cancle">
            <span class="vux-close" v-if="showcancle">{{$t("device.cancel")}}</span>
          </div>
        </x-dialog>
      </div>
      <div v-transfer-dom>
        <confirm v-model="isNotenough" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirmmoney(item)">
          <p class="text-center">{{$t("meterlow.click")}}</p>
        </confirm>  
      </div>
      <div v-transfer-dom>
        <confirm v-model="isunline" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm1()">
          <p class="text-center">{{$t("meterlow.unline")}}</p>
        </confirm>
      </div>
       <div v-transfer-dom>
        <confirm v-model="isNum" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm1()">
          <p class="text-center">{{$t("meterlow.maxfive")}}</p>
        </confirm>
      </div>
    </div>
    <!-- <div class="more-information" v-if="isMore">
      <p>更多功能</p>
      <div class="more-set">
        <div @click.native="addVendingRecord2">
          <router-link to="/chargeRecord">
            <div class="newposition">
              <img src="../assets/7@2x.png">
              <p class="new">充电记录</p>
            </div>
          </router-link>
        </div>
        <div @click.native="addVendingRecord4">
          <router-link to="/meterBase">
            <div class="newposition">
              <img src="../assets/8@2x.png">
              <p class="new">剩余电量</p>
            </div>
          </router-link>
        </div>
        <div @click.native="addVendingRecord3">
          <router-link to="/dumpMeter">
            <div class="newposition">
              <img src="../assets/9@2x.png">
              <p class="new unique">用电量查询</p>
            </div>
          </router-link>
        </div>
        <div @click="addVendingRecord()">
          <div class="newposition">
            <img src="../assets/243@2x.png">
            <p class="new">设备信息</p>
          </div>
        </div>
      </div>
    </div> -->
    <div class="addele" @click="add()">
      <img src="../assets/add@2x.png" alt="">
      <span>{{$t("meterlow.addmeter")}}</span>
      <img src="../assets/down-icon.png" alt="" class="fh">
    </div>
    <div class="problem" @click="problem()">
      <img src="../assets/271@3x.png" alt="">
      <span>{{$t("feedback.problem")}}</span>
    </div>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import wechat from "@/tools/wechat";
import { futimes, constants } from "fs";
import {
  Cell,
  Group,
  XButton,
  Blur,
  TransferDom,
  Confirm,
  XDialog,
  XProgress,
  Box
} from "vux";
import { format } from "date-fns";
import { mapState, mapGetters, mapMutations } from "vuex";
import { getErrorMsg } from "@/tools/commonJs/common";
import Bscroll from "better-scroll";
import api from "../api/Piles.js";
import { setTimeout } from "timers";
var userItem = JSON.parse(localStorage.getItem("userItem"));
var a = "";
export default {
  computed: {
    ...mapState({
      token: state => state.token
    }),
    ...mapGetters(["userInfos", "orderNum"]),
    getChatBandInfo() {
      return this.$store.state.aboutMe.getChatBandInfo;
    },
    getPriceNotesList() {
      return this.$store.state.aboutMe.getPriceNotesList;
    }
  },
  components: {
    Cell,
    Group,
    XButton,
    Blur,
    Confirm,
    XDialog,
    XProgress,
    Cell,
    Box
  },
  directives: {
    TransferDom
  },
  mounted() {
    this.$store.dispatch("AC_GetChatBandInfo", {
      chatid: userItem.openid
    });
    this.$store.dispatch("AC_GetPriceNotesList", {}).then(res => {
      this.isRequery = sessionStorage.getItem("czTime");
    });
  },

  data: function() {
    return {
      showspoint: false, //只能一位小数提示
      funditem: {
        //设备信息
        factoryid: "",
        deviceversion: "",
        softversion: ""
      },
      //    微信接口参数
      payInfo: {
        appid: userItem.appid,
        openid: userItem.openid,
        price: "",
        orderNum: ""
      },
      failNum: false,
      balanceenergy: "", //剩余电量
      balancevalue: "", //当前余额
      totalnew: 0, //等值电量
      alarmshow: false, //一分钟不能频繁操作
      result: "", //充电金额
      activeIndex: -1, //选中的金额索引
      isOprate: -1,
      showLow: false, //电量不足
      showzai: false, //在线
      nowMoney: 50, //当前充值的金额
      meterlists: [], //多个电表的数据
      isNotenough: false, //余额不足提示
      items: [], //充电金额数组
      // total: 50, //等价电量
      isactive: 0, //金额索引
      electrPrice: 0, //电价
      eleinfo:{},
      chat: "", //chatid
      shows: false, //确定充值提示
      isRequery: new Date().valueOf(), //时间戳
      interrupt: false,
      percent: 0, //进度
      showDialog: false,
      waitrecvMsg: "", //提示信息
      showcancle: false, //取消
      recvTimeoutCount: 10,
      tokenreq: {//获取token的请求参数
        meterno: "",
        chargevalue: "0",
        isclear: 0
      },
      tokenvalue: "",
      commad: "",
      objid: "",
      switchList: {
        objectid: 17122,
        objecttype: 1,
        requestid: "requestid",
        taskid: 5579,
        isresive: 0,
        afn: "1",
        content: {
          name: "F93",
          data: ""
        }
      },
      sendcharing: {}, //通知的参数
      isMore:false, //更多
      isunline:false,
      metertotal:0, //电表数量
      isNum:false //数量提示
    };
  },
  methods: {
    // 时间格式化
    formatTime(val) {
      return format(val, "YYYYMMDDHHmmss");
    },
    formatTime2(val) {
      return format(val, "YYYY-MM-DD HH:mm:ss");
    },
    // 充电按钮事件
    show: function(index) {
      this.nowMoney = 50;
      this.eleinfo=this.meterlists[index];
      this.electrPrice=this.meterlists[index].pricevalue;
      this.totalnew = 50 / this.electrPrice;
      if (this.activeIndex == index && this.activeIndex != -1 || this.meterlists[index].curstatus==0 ) {
        this.activeIndex = -1;
        if(this.meterlists[index].curstatus==0){
          this.isunline=true;
        }
      } else {
        this.activeIndex = index;
        this.result=""
      }
    },
    // 操作按钮事件
    showOprate(index){
      if (this.isOprate == index && this.isOprate != -1) {
        this.isOprate = -1;
      } else {
        this.isOprate = index;
      }
    },
    // 确认事件（形式上的）
    onConfirmpoint() {},
    // 充电金额选择事件
    money: function(item, index) {
      console.log(item)
      this.nowMoney = item;
      this.isactive = index;
      this.totalnew = this.nowMoney / this.electrPrice;
      // this.total = this.totalnew.toFixed(1);
    },
    // 输入框实时监测
    tt: function(e) {
      this.isactive=-1;
      a = e.target.value;
      var re1 = /^\d+(\.\d{0,1})?$|^\.\d{1,2}$/;
      if (a == "") {
        a = this.items[this.isactive];
        this.isactive=0
      } else {
        if (!re1.test(a)) {
          this.showspoint = true;
          this.result = a.match(/^\d*(\.?\d{0,1})/g)[0];
          this.nowMoney = parseFloat(this.result);
        } else {
          this.totalnew = a / this.electrPrice;
          // this.total = this.totalnew.toFixed(1);
          this.nowMoney = parseFloat(a);
        }
      }
    },
    // 微信充值的代码
    createNum() {
      let Num = "";
      for (var i = 0; i < 6; i++) {
        Num += String(Math.floor(Math.random() * 10));
      }
      return Num;
    },
    // 确定按钮
    recharge() {
      if (this.nowMoney > this.balancevalue) {
        this.isNotenough = true;
      } else {
        this.shows = true;
      }
      a = "";
    },
    // 充值电量
    onConfirm() {
      let item=this.eleinfo;
      this.sendcharing.commaddress = item.commaddress;
      this.sendcharing.total = this.totalnew.toFixed(1);
      this.sendcharing.nowMoney = this.nowMoney;
      this.sendcharing.balancevlaue = (
        Number(item.balancevlaue.toFixed(1)) + Number(this.totalnew.toFixed(1))
      ).toFixed(1);
      var nowTime = new Date().valueOf();
      if (this.isRequery !== undefined) {
        if (this.isRequery <= nowTime - 60000) {
          sessionStorage.setItem("czTime", nowTime);
          this.isRequery = nowTime;
          this.objid = item.rtuid;
          if (item.commaddress.length > 11) {
            this.commad = item.commaddress.slice(-11);
          } else if (item.commaddress.length < 11) {
            this.commad = item.commaddress;
            for (let i = item.commaddress.length; i < 11; i++) {
              this.commad = "0" + this.commad;
            }
          }
          this.tokenreq.meterno = this.commad;
          this.tokenreq.chargevalue = this.totalnew.toFixed(1);
          // 获取token
          api.GetToken(this.tokenreq).then(res => {
            this.tokenvalue = res.data.tokenvalue.replace(/-/g, "");
            this.sendData(this.objid);
          });
        } else {
          //   一分钟显示
          this.alarmshow = true;
          // 确定冲值
          this.shows = false;
        }
      } else {
        //可以请求
        this.objid = item.rtuid;
        if (item.commaddress.length > 11) {
          this.commad = item.commaddress.slice(-11);
        } else if (item.commaddress.length < 11) {
          this.commad = item.commaddress;
          for (let i = item.commaddress.length; i < 11; i++) {
            this.commad = "0" + this.commad;
          }
        }
        this.tokenreq.meterno = this.commad;
        this.tokenreq.chargevalue = this.totalnew.toFixed(1);
        // 获取token
        api.GetToken(this.tokenreq).then(res => {
          this.tokenvalue = res.data.tokenvalue.replace(/-/g, "");
          this.sendData(this.objid);
        });
      }
    },
    // 形式上的确定事件
    onConfirm1() {},
    // 设备信息
    addVendingRecord() {
      this.$router.push({
        path: "/equipment",
        query: { funditem: this.funditem }
      });
    },
    // 发送数据
    sendData(item) {
      this.switchList.objectid = item;
      this.switchList.content.data = this.tokenvalue;
      this.genTaskid();
      this.genRequestid();
      this.$store.dispatch("AC_SendCharing", this.switchList).then(res => {
        if (res.data.success == 1) {
          this.receiveData();
          this.saverecode(1);
        } else {
          this.$store.commit("UPDATE_TOAST", "充值失败");
        }
      });
    },
    // 接受数据
    receiveData() {
      this.$store.dispatch("AC_ReceiveCharing", this.switchList).then(res => {
        if (this.interrupt) {
          //一直都是false
          this.displayTimeout = false;
          this.percent = 0;
        } else {
          if (this.recvTimeoutCount == 10) {
            this.showDialog = true; //等待数据回复提示框出现
          }
          this.percent = ((10 - this.recvTimeoutCount) / 10) * 100; //进度计算
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
          // 成功
          this.showcancle = true;
          this.percent = 100;
          api
            .GetaddPryPayRecord({
              chatid: this.chat,
              objectid: this.objid,
              objecttype: 1,
              paymoney: this.nowMoney,
              payvalue: this.totalnew.toFixed(1),
              tokentype: 1,
              token: this.tokenvalue,
              vendingtype: 1,
              notes: "充值"
            })
            .then(res => {
              if (res.data.returncode != 1) {
                this.waitrecvMsg = "失败";
              } else {
                this.waitrecvMsg = "成功";
                this.SendCharingMsg();
                this.saverecode(2);
                this.$router.push("/moneySuccess");
              }
            });
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
          this.saverecode(3);
        } else {
          this.percent = 100;
          this.waitrecvMsg = "超时";
          this.showcancle = true;
          this.saverecode(3);
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
    // 添加充值日志
    saverecode(type) {
      api.insertChargeLog({
        objectid: this.switchList.objectid,
        objecttype: 1,
        sendstatus: type,
        token: this.tokenvalue,
        openid: userItem.openid,
        paymoney: this.sendcharing.nowMoney,
        payenergy: this.sendcharing.total
      });
    },
    // 取消充值
    cancles(){
      this.activeIndex = -1;
    },
    // 余额不足去充钱
    onConfirmmoney(item) {
      let Num;
      if (this.failNum) {
        Num = this.orderNum;
      } else {
        Num = this.formatTime(new Date()) + this.createNum();
        this.$store.commit(
          "UPDATE_orderNum",
          this.formatTime(new Date()) + this.createNum()
        );
      }
      this.$store
        .dispatch("AC_PrePay", {
          appid: userItem.appid,
          openid: userItem.openid,
          price: this.nowMoney,
          orderNum: Num
        })
        .then(res => {
          if (
            res.data.return_code == "SUCCESS" &&
            res.data.return_msg == "OK"
          ) {
            this.callWXPay(res.data, item);
          }
        });
    },
    callWXPay(params, item) {
      var _this = this;
      return new Promise((resolve, reject) => {
        params.success = res => {
          resolve(res);
        };
        params.fail = err => {
          reject(err);
        };

        wx.chooseWXPay({
          timestamp: params.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: params.nonce_str, // 支付签名随机串，不长于 32 位
          package: `prepay_id=${params.prepay_id}`, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: "MD5", // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: params.paySign, /// 支付签名
          success: function(res) {
            // 支付成功后的回调函数
            if (res.errMsg == "chooseWXPay:ok") {
              _this.AddAppWxChatRecharge();
              _this.SendWaringMsg();
              _this.onConfirm;
              _this.failNum = false;
            } else {
              _this.failNum = true;
            }
          },
          cancel: function() {
            _this.commit("UPDATE_TOAST", "取消充值");
            _this.failNum = false;
          },
          error: function(res) {
            _this.commit("UPDATE_TOAST", "充值失敗");
            _this.failNum = true;
          }
        });
      }).then(res => {});
    },
    // 添加充值记录
    async AddAppWxChatRecharge() {
      const result = await this.$store
        .dispatch("AC_AddAppWxChatRecharge", {
          chatid: userItem.openid,
          rechargevalue: this.nowMoney
        })
        .then(res => {
          if (res.data.returncode == 1) {
            this.$router.push({ path: "/meterLow" });
          }
        });
    },
    // 发送充值通知
    async SendWaringMsg() {
      const result = await this.$store.dispatch("AC_SendWaringMsg", {
        title: "充值成功通知",
        datas:
          "您已经成功充值到账户余额\t" +
          this.nowMoney +
          "元\t" +
          this.formatTime2(new Date()) +
          "\t" +
          "充值余额仅能做充电使用",
        userOpenid: userItem.openid,
        mpAccount: userItem.appid,
        jumpUrl: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
          userItem.appid
        }&redirect_uri=http%3a%2f%2fbee.statesky.cn%2fpowerh5%2f%23%2frechargeRecord%2f${
          userItem.openid
        }&response_type=code&scope=snsapi_base&state=1&conn`
      });
    },
    // 发送充电成功通知
    async SendCharingMsg() {
      const result = await this.$store.dispatch("AC_SendWaringMsg", {
        title: "充电成功通知",
        datas: `您好，您已经成功充值到电表\t${this.sendcharing.commaddress}\t${
          this.sendcharing.nowMoney
        }元\t${this.sendcharing.total}kWh\t${
          this.sendcharing.balancevlaue
        }kWh\t电充蜂平台\t感谢您的使用`,
        userOpenid: userItem.openid,
        mpAccount: userItem.appid,
        jumpUrl: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
          userItem.appid
        }&redirect_uri=http%3a%2f%2fbee.statesky.cn%2fpowerh5%2f%23%2fmeterLow&response_type=code&scope=snsapi_base&state=1&conn`
      });
    },
    // 产生随机数
    genTaskid() {
      this.switchList.taskid = this.genRandomNum(1000, 9999);
    },
    // 产生随机数
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
    },
    // 取消
    cancle() {
      this.showDialog = false;
      location.reload();
    },
    // 添加事件
    add: function() {
      if(this.metertotal>5){
        this.isNum=true;
      }else{
        let metervalue={
          chatname:this.res.data.chatname,
          phone:this.res.data.phone
        }
        sessionStorage.setItem("metervalue",JSON.stringify(metervalue))
        this.$router.push("/manageinstr");
      }
    },
    problem(){
      this.$router.push('/feedback')
    }
  },
  watch: {
    //   电表的一些基本信息code=1
    getChatBandInfo(val) {
      this.res = val;
      this.metertotal=val.data.meterlist.length;
      if (this.res.data.returnCode == 1) {
        this.balanceenergy = this.res.data.balanceenergy.toFixed(1);
        this.balancevalue = this.res.data.balancevalue;
        this.chat = this.res.data.chatid;
        let sets = [];
        if (this.res.data.meterlist != undefined ) {
          this.isMore= this.res.data.meterlist.legnth!=1 ?false:true;
          for (let i = 0; i < this.res.data.meterlist.length; i++) {
            // let groupinfo = [];
            // groupinfo.commaddress = this.res.data.meterlist[i].commaddress;
            // groupinfo.balancevlaue = this.res.data.meterlist[i].balancevlaue;
            // groupinfo.pricevalue = this.res.data.meterlist[i].pricevalue;
            // groupinfo.rtuid = this.res.data.meterlist[i].rtuid;
            // groupinfo.commaddress = this.res.data.meterlist[i].commaddress;
            // groupinfo.factoryid = this.res.data.meterlist[i].factoryid;
            // groupinfo.deviceversion = this.res.data.meterlist[i].deviceversion;
            // groupinfo.softversion = this.res.data.meterlist[i].softversion;
            sets[i] = this.res.data.meterlist[i]
            if (this.res.data.meterlist[i].balancevlaue <= 30) {
              this.showLow = true;
            } else {
              this.showLow = false;
            }
            
            if (this.res.data.meterlist[i].curstatus == 1) {
              this.showzai = true;
            } else {
              this.showzai = false;
            }
          }
          this.meterlists = sets;
          this.funditem=this.meterlists;
        } else {
          wechat.wxAuthJumpele();
        }
      } else {
        wechat.wxAuthJumpele();
      }
    },
    // 充值金额
    getPriceNotesList(val) {
      this.res = val;
      this.items[0] = this.res.data.item.price1;
      this.items[1] = this.res.data.item.price2;
      this.items[2] = this.res.data.item.price3;
      this.items[3] = this.res.data.item.price4;
      this.items[4] = this.res.data.item.price5;
      this.items[5] = this.res.data.item.price6;
    }
  }
};
</script>

<style lang="less" scoped>
@width75: 75rem;
.mine-wrap {
  width: 100%;
  height: 100%;
  // padding-bottom: 88/@width75;
}

.mine-header {
  width: 750 / @width75;
  background: url(../assets/beijing@2x.png) no-repeat #f6f6f6;
  background-size: 750 / @width75 300 / @width75;
  display: flex;
}

.my-wallet {
  width: 674 / @width75;
  height: 442 / @width75;
  margin: 74 / @width75 39 / @width75 0;
  text-align: center;
  background: white;
  border-radius: 5px;
  h4 {
    text-align: center;
    height: 36 / @width75;
    line-height: 36 / @width75;
    text-align: center;
    font-size: 30 / @width75;
    color: #000000;
    letter-spacing: 2px;
    font-weight: bolder;
  }
  .my-wallet-bottom {
    margin-top:28 / @width75;
    overflow: hidden;
    display: flex;
    align-items: center;
    img {
      width: 56 / @width75;
      height: 56 / @width75;
    }
    .my-wallet-content {
      width: 373 / @width75;
      h4 {
        height: 42 / @width75;
        line-height: 42 / @width75;
        font-size: 60 / @width75;
        margin-top: 44 / @width75;
        margin-bottom: 34 / @width75;
        font-weight: normal;
        text-align: center;
      }
      p {
        font-size: 28 / @width75;
        height: 46 / @width75;
        line-height: 46 / @width75;
        text-align: center;
        color: #999999;
      }
    }
    .my-wallet-line {
      // width: 4 / @width75;
      height: 388 / @width75;
      background: rgb(244, 244, 244);
      border-left: 4px dashed rgb(244, 244, 244);;
    }
  }
}

.money-low {
  //   margin: 0 39 / @width75;
  border-top: 1px solid rgb(244, 244, 244);
  padding: 26/@width75 0 0;
  p {
    margin-left: 30 / @width75;
    height: 45 / @width75;
    line-height: 45 / @width75;
    font-size: 28 / @width75;
    color: rgb(153, 153, 153);
  }
  .money {
    display: flex;
    overflow: hidden;
    flex-wrap: wrap;
    margin: 0 30 / @width75;
    div {
      margin: 12 / @width75 0;
      p {
        width: 182 / @width75;
        height: 88 / @width75;
        line-height: 88 / @width75;
        text-align: center;
        color: black;
        font-size: 36 / @width75;
        background: rgb(246, 246, 246);
        margin: 0 22 / @width75 0 0;
        border-radius: 16 / @width75;
        &:nth-child(3n){
          margin: 0;
        }
      }
      
    }
    .bg {
      p {
        background: rgb(53, 186, 182);
        color: white;
      }

    }
  }
  .changestyle {
    background: #ffffff;
    input {
      width: 354 / @width75;
      padding-left: 19 / @width75;
      border-radius: 16 / @width75;
      border: 2 / @width75 solid rgb(232, 232, 232);
      height: 68 / @width75;
      line-height: 68 / @width75;
      font-size: 28 / @width75;
    }
  }
  .money-information {
    p {
      margin-left: 30 / @width75;
      color: #000000;
      span {
        color: rgb(153, 153, 153);
      }
    }
  }

  hr {
    margin: 22 / @width75 0;
  }
}

.money-balance {
  margin: 36 / @width75 30 / @width75;
  height: 50 / @width75;
  img {
    width: 42 / @width75;
    height: 42 / @width75;
    display: block;
  }
  p {
    display: flex;
    overflow: hidden;
    font-size: 28 / @width75;
    margin-left: 0;
    span {
      display: block;
    }
    .moneyinfo {
      width: 450 / @width75;
      margin: 0 48 / @width75 0 28/@width75;
      color: #000000;
    }
    a {
      color: black !important;
    }
  }

}
  .btns{
    padding: 0 30/@width75 30/@width75;
    display: flex;
    justify-content: space-between;
    .money-can{
      width: 300/@width75;
      height: 88/@width75;
      border-radius: 44 / @width75;
      background: #ffffff;
      color: rgb(102, 102, 102);
      border: 3px solid rgb(238, 238, 238);
      font-size: 32/@width75;
    }
    .money-button {
      width: 300/@width75;
      height: 88/@width75;
      border-radius: 44 / @width75;
      background: rgb(53, 186, 182);
      color: white;
      font-size: 32/@width75;
    }
  }
.my-meter-information {
  background: #ffffff;
  width: 674 / @width75;
  //   height: 330 / @width75;
  margin: 30 / @width75 39 / @width75;
    // margin-left: 49 / @width75;
    .code{border-radius: 10/@width75;}
    .code-one {
      color: black;
      font-weight: bold;
      padding: 28/@width75 30/@width75;
      border-bottom: 1px solid rgb(244, 244, 244);
      position: relative;
      &:after{
        content: "";
        display: block;
        clear: both;
      }
      img{
        width: 30/@width75;
        height: 32/@width75;
        float: left;
      }
      p{
        font-size: 32/@width75;
        float: left;
        margin-left: 24/@width75;
      }
      .fun{
        float: right;
      }
      .box{
        width: 278/@width75;
        position: absolute;
        z-index: 99;
        right: 0;
        top: 72/@width75;
        .sj{
          width: 0;
          height: 0;
          margin-left: 224/@width75;
          border-width:0 10/@width75 10/@width75;
          border-style:solid;
          border-color:transparent transparent #333;/*透明 透明  灰*/
        }
      }
      .opration{
        width: 278/@width75;
        background: rgb(51, 51, 51);
        border-radius: 10/@width75;
        overflow: hidden;
        font-size: 32/@width75;
        li{
          height: 88/@width75;
          line-height: 88/@width75;
          padding-left: 30/@width75;
          border-bottom: 1px solid rgb(77, 77, 77);
          img{
            margin: 28/@width75 32/@width75 0 0 ;
          }
          a{color: #fff;}
        }
      }
    }
    .code-two{
      display: flex;
      justify-content: space-between;
      padding: 33/@width75 30/@width75 15/@width75;;
      p{
        margin-bottom: 17/@width75;
        font-size: 24/@width75;
        color: rgb(153, 153, 153);
        .num{
          color: rgb(51, 51, 51);
        }
      }
      .recharge{
        width: 132/@width75;
        height: 58/@width75;
        border-radius: 29/@width75;
        border: 2px solid rgb(53, 186, 182);
        color: rgb(53, 186, 182);
        line-height: 58/@width75;
        background: none;
        font-size: 28/@width75;
      }
    }
    .top-up {
      text-align: center;
      height: 75 / @width75;
      line-height: 75 / @width75;
      .top {
        width: 222 / @width75;
        background: rgb(53, 186, 182);
        margin-top: 20 / @width75;
        color: #ffffff;
      }
    }
}

.more-information {
  margin: 30 / @width75 39 / @width75;
  background: #ffffff;
  //   height: 308 / @width75;
  >p {
    margin: 20 / @width75 30 / @width75;
    font-size: 36 / @width75;
    font-weight: bold;
    padding-top: 30 / @width75;
  }
  .more-set {
    padding: 10/@width75 30/@width75 40/@width75;;
    display: flex;
    justify-content: space-between;
    text-align: center;
    a {
      color: black;
    }
    img {
      margin: 10 / @width75 10 / @width75;
      width: 100 / @width75;
      height: 100 / @width75;
      //   line-height: 100 / @width75;
    }
    .new {
      text-align: left;
      font-weight: normal;
      height: 43 / @width75;
      font-size: 26 / @width75;
      line-height: 43 / @width75;
      text-align: center;
    }
  }
}
.addele {
  margin: 0 39/@width75;
  height: 100 / @width75;
  line-height: 100 / @width75;
  background: #fff;
  color: white;
  border-radius: 10/@width75;
  padding :0 30/@width75;
  img{
    width: 46/@width75;
  }
  span {
    color: rgb(1, 1, 1);
    font-size: 28/@width75;
    margin-left: 20/@width75;
  }
  .fh{
    width: 24/@width75;
    transform:rotate(-90deg);
    float: right;
    margin-top: 44/@width75;
  }
}
.problem{
  margin: 20/@width75 39/@width75;
  background: #fff;
  height: 60/@width75;
  line-height: 60/@width75;
  text-align: center;
  img{
    width: 30/@width75;
    margin-right: 12/@width75;
  }
}
</style>

<style lang="less">
@width75: 75rem;
.weui-btn:after{
  width:0;
  height: 0;
}
.me-content .group1 .weui-cells {
  margin-top: 0;
}

.me-content .weui-cell_access .weui-cell__ft:after {
  display: none !important;
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
.weui-toast__content {
  height: 150 / @width75;
  line-height: 150 / @width75;
  font-size: 40 / @width75;
}
.vux-close:before, .vux-close:after{
  background-color: #fff !important;
}
</style>
