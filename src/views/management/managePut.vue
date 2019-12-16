<!-- 提现 -->
<template>
  <div class="put">
    <group :title="$t('put.choose')" class="putf">
      <radio :options="options2"  v-model="value">
        <!-- <img src="../../assets/icon/Section/alarm.png" alt=""> -->
      </radio>
    </group>
    <div class="withdrawal">
      <form class role="form" action>
        <!-- <div class="card" v-show="cardAccount">
          <span class>银行账号</span>
          <input type="text" class placeholder="请输入银行卡账号" v-model="card">
        </div>
        <div class="card" v-show="chatAccount">
          <span class>微信账号</span>
          <input type="text" class placeholder="请输入微信账号" v-model="chat">
        </div> -->
        <div class="card">
          <span class>{{$t("put.name")}}</span>
          <input type="text" class :placeholder="$t('put.realname')" v-model="username">
        </div>
        <div class="card all">
          <span class>{{$t("put.amount")}}</span>
          <input
            type="text"
            class
            :placeholder="$t('put.widthamount')"
            v-model="rechargevalue"
            v-on:input="tt($event)"
            style="width:166px"
          >
          <span class="all-button" @click="all()">{{$t("put.total")}}</span>
        </div>
        <div class="card all">
          <p>
            {{$t("put.withdrawable")}}
            <span class="position">{{reset}}</span>
          </p>
        </div>
      </form>
      <x-button class="withdrawal-button" @click.native="withdrawal">{{$t("put.withdrawalbtn")}}</x-button>
    </div>
    <p class="msg">
      {{$t("put.note")}}<br>
      {{$t("put.cont")}}<br>
      {{$t("put.context")}}<br>
      {{$t("put.cont2")}}<br>
      4. 单次提现金额不能超过5000。
    </p>
    <div class="record" :class="{hidden:ishidd}" ref="puts"><span @click="putRecord">{{$t("put.record")}}</span></div>
    <div v-transfer-dom>
      <confirm v-model="showInfo" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm1">
        <p class="text-center">{{$t("put.notenough")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showInfo3" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm1">
        <p class="text-center">{{$t("put.widthamount")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showInfo4" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm1">
        <p class="text-center">{{$t("put.realname")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showInfo5" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm1">
        <p class="text-center">{{$t("put.morezhen")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showInfo6" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm1">
        <p class="text-center">单次体现金额不能超过5000</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="shownumber" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm1">
        <p class="text-center">{{$t("put.onenum")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="iswidth" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onWidth">
        <p class="text-center">{{$t("put.width")}}</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Radio, Group, TransferDom, Confirm, XButton,Alert } from "vux";
import api from "../../api/Piles.js";
var id = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
var userItem = JSON.parse(localStorage.getItem("userItem"));
var a = "";
export default {
  data() {
    return {
      value:3,
      options2: [
        // {
        //   icon: "http://www.img.statesky.cn/image/wifi/pay3.png",
        //   key: 1,
        //   value: "银行卡"
        // },
        {
          icon: "http://www.img.statesky.cn/image/wifi/pay2.png",
          key: 3,
          value: this.$t("put.wechat")
        },
        // {
        //   icon: "http://www.img.statesky.cn/image/wifi/pay1.png",
        //   key: 4,
        //   value: "支付宝"
        // }
      ],
      showInfo3: false, //提现金额提示
      showInfo4: false, //提现姓名提示
      showInfo5: false, //提现金额数量提示
      shownumber: false, //整数或者小数提示
      showInfo6:false,//金额大于5000提示
      // cardAccount: false, //银行账号提示
      // chatAccount: false, //微信账号提示
      // zhiFuBaoAccount: false, //支付宝账号提示
      // card: "", //银行卡账号
      // chat: "", //微信账号
      username: "", //姓名
      rechargevalue: "", //提现金额
      withdrawtype: "", //提现方式
      payid: "",
      showInfo: false, //月不足提示
      reset: 0, //可提现金额
      ishidd:false,
      iswidth:false
    };
  },
  components: {
    Radio,
    Group,
    XButton,
    Confirm,
    Alert
  },
  directives: {
    TransferDom
  },
  computed: {},

  mounted() {
    this.reset = JSON.parse(sessionStorage.getItem("restMoney"));
    this.withdrawtype = 3;
    window.onresize = () => {
      if(this.$refs.puts.getBoundingClientRect().top<420){
        this.ishidd=true;
      }else if(this.$refs.puts.getBoundingClientRect().top==0){
        this.ishidd=false;
      }
    }
  },
  methods: {
    // 输入的金额
    tt: function(e) {
      a = e.target.value;
      var re1 = /^\d+(\.\d{0,1})?$|^\.\d{1,2}$/;
      if (a !== "") {
        if (!re1.test(a)) {
          this.shownumber = true;
          this.rechargevalue = a.match(/^\d*(\.?\d{0,1})/g)[0];
        } else {
          this.rechargevalue = a;
        }
      }
    },
    // 提现方式选择
    // putf: function(value, label) {
    //   if (value == 1) {
    //     this.cardAccount = true;
    //     this.chatAccount = false;
    //     this.zhiFuBaoAccount = false;
    //     this.card = "";
    //     this.rechargevalue = "";
    //   } else if (value == 3) {
    //     this.chatAccount = true;
    //     this.cardAccount = false;
    //     this.zhiFuBaoAccount = false;
    //     this.chat = "";
    //     this.rechargevalue = "";
    //   } else if (value == 4) {
    //     this.zhiFuBaoAccount = true;
    //     this.chatAccount = false;
    //     this.cardAccount = false;
    //     this.username = "";
    //     this.rechargevalue = "";
    //   }
    //   this.withdrawtype = value;
    // },
    // 提现全部事件
    all: function() {
      this.rechargevalue = this.reset;
    },
    // 提现事件
    withdrawal: function() {
      
      if (this.rechargevalue !== "") {
        if (this.rechargevalue > this.reset) {
          // 总金额提现金额比较
          this.showInfo = true;
          this.rechargevalue=""
        } else {
          // if (this.withdrawtype == 1) {
          //   this.payid = this.card;
          // } else if (this.withdrawtype == 3) {
          //   this.payid = this.chat;
          // } else if (this.withdrawtype == 4) {
          //   this.payid = this.username;
          // } 
          this.payid=this.username;
          if (this.withdrawtype !== "") {
            if (this.username !== "") {
              if (this.rechargevalue >= 100) {
                if(this.rechargevalue <=5000){
                    this.iswidth=true;
                }else{
                  this.showInfo6 = true;
                }
              } else {
                this.showInfo5 = true;
              }
            } else {
              this.showInfo4 = true;
            }
          }
        }
      } else {
        this.showInfo3 = true;
      }
      // 充值金额
    },
    onWidth(){
      var _this = this;
      this.$store
        .dispatch("AC_AddAppWithdRawLog", {
          accountid: id,
          payid: _this.payid,
          rechargevalue: this.rechargevalue,
          withdrawtype: this.withdrawtype,
          rechargetype: 1
        })
        .then(res => {
          if (res.data.returnCode == 1) {
            _this.reset = this.reset - this.rechargevalue;
            this.$router.push("/putSuccess");
          } else {
            this.$store.commit("UPDATE_TOAST", "提现失败");
          }
        });
    },
    // 确定事件（只是个形式）
    onConfirm1() {},
    // 查看提现记录
    putRecord(){
      this.$router.push('/managePutRecord')
    }
  }
};
</script>
<style lang='less'>
@width75: 75rem;
.putf {
  .weui-cells__title {
    height: 68 / @width75;
    line-height: 68 / @width75;
    padding: 7 / @width75 0 6 / @width75;
    padding-left: 38 / @width75;
    margin: 0;
    font-size: 28 / @width75;
    color: black;
  }
  .weui-cell {
    padding: 24 / @width75 38 / @width75;
    font-size: 28 / @width75;
  }
  .weui-cells_radio .weui-cell__bd .vux-radio-icon {
    display: inline-block !important;
    border-image-width: 0%;
    border: none;
    width: 36 / @width75;
    height: 36 / @width75;
    overflow: hidden;
  }
}
.weui-toast__content {
  height: 150 / @width75;
  line-height: 150 / @width75;
  font-size: 40 / @width75;
}
.msg {
  margin-top: 54 / @width75;
  padding: 0 39/@width75;
  line-height: 30/@width75;
  color: #999999;
  font-size: 24 / @width75;
}
.withdrawal {
  margin: 20 / @width75 0 / @width75;
  // padding: 0 39 / @width75;
  background: #ffffff;
  form {
    // padding: 20 / @width75 0;
    .card {
      height: 48 / @width75;
      line-height: 48 / @width75;
      display: flex;
      justify-content: start;
      padding: 28/@width75 39/@width75;
      border-bottom: 1px solid rgb(244, 244, 244);
      span {
        display: block;
        width: 140/@width75;
        font-size: 32 / @width75;
        color: rgb(51, 51, 51);
        margin-right: 52 / @width75;
      }
      input {
        vertical-align: baseline;
        font-size: 32/@width75;
        width: 420/@width75;
      }
    }
    .all {
      // margin: 39 / @width75 0;
      p {
        display: flex;
        overflow: hidden;
        font-size: 24 / @width75;
        color: rgb(153, 153, 153);
        span {
          font-size: 24 / @width75;
          color: rgb(255, 0, 0);
          margin-left: 20 / @width75;
        }
        .position {
          width: 75 @width75;
        }
      }
      .all-button {
        background: #ffffff;
        border-radius: 22 / @width75;
        font-size: 26/@width75;
        height: 44 / @width75;
        width: 132 / @width75;
        line-height: 44/@width75;
        text-align: center;
        border: 2 / @width75 solid #35bab6;
        color: rgb(53, 186, 182);
        float: right;
        margin:0 0 0 8/@width75;
      }
    }
  }
  .withdrawal-button {
    width: 674/@width75;
    border-radius: 44 / @width75;
    height: 88 / @width75;
    background: rgb(53, 186, 182);
    color: white;
    font-size: 36/@width75;
    margin-top: 62/@width75;
  }
}
.record {
    width: 100%;
    text-align: center;
    color: #35bab6;
    font-size: 24 / @width75;
    // margin-top:180/@width75;
    position: absolute;
    bottom: 32/@width75;
    
}
.hidden{
    margin-top: 200/@width75;
    position: static;
  }
.vux-x-dialog .weui-mask {
  z-index: 500 !important;
}

.weui-dialog {
  max-width    : 540 / @width75!important;
  border-radius: 20 / @width75!important;
  overflow     : hidden;
}
.weui-dialog__hd .weui-dialog__title {
  font-size     : 36 / @width75!important;
  letter-spacing: 4px;
  font-weight   : bolder;
}

.weui-dialog__bd .text-center {
  color      : #030303 !important;
  line-height: 40 / @width75;
  font-size  : 30 / @width75!important;
}

.weui-dialog__ft {
  line-height: 88 / @width75!important;
  height     : 88 / @width75!important;
}

.weui-dialog__ft .weui-dialog__btn {
  line-height: 88 / @width75!important;
  height     : 88 / @width75!important;
  font-size  : 34 / @width75!important;
  color      : #007aff;
}
</style>
