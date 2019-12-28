<template>
  <div id="payRent">
    <div class="bg">
      <h2>{{items.roomname}}</h2>
      <span class="month">
        {{params.monthStr}}
        <popup-picker id="monthPicker" :data="monthList" v-model="month" @on-hide="pickMonth"></popup-picker>
      </span>
    </div>
    <div class="card">
      <div class="rent">
        <h3 v-if="showBill">该月租金</h3>
        <p v-if="showBill">{{items.rent}}</p>
      </div>
      <div class="detail">
        <ul v-if="showBill">
          <!-- <li>
            <p>
              押金
              <span>元</span>
            </p>
          </li> -->
          <li>
            <p>
              截至缴纳日期
              <span>{{items.deadline | dateFilter}}</span>
            </p>
          </li>
          <li>
            <p>
              缴纳状态
              <span :class="{green: items.status === 3, red: items.status === 2}">{{items.status === 2 ? '未缴纳' : '已缴纳'}}</span>
            </p>
          </li>
          <!-- <li v-if="items.status === 3">
            <p>
              缴纳日期
              <span>{{items.payDate | dateFilter}}</span>
            </p>
          </> -->
          <li v-if="items.overdueTime >= 0">
            <p>
              剩余缴纳天数
              <span>{{items.overdueTime}}</span>
            </p>
          </li>
          <li>
            <p>
              是否逾期
              <span :class="{green: !items.overdue, red: items.overdue}">{{items.overdue ? '已逾期' : '未逾期'}}</span>
            </p>
          </li>
          <li>
            <p>
              房东手机号
              <span>{{items.phone}}</span>
            </p>
          </li>
        </ul>
        <p class="datano" v-else>{{noData}}</p>
      </div>
      <div class="pay" v-if="items.status === 2" @click="pay">去缴费</div>
    </div>
    <p class="question">如有任何疑问，请联系房东</p>
    <div v-transfer-dom>
      <confirm v-model="showConfirm1"
      title="确定要缴费吗？"
      @on-confirm="onConfirm">
        <p style="text-align:center;">余额：{{balance}}</p>
      </confirm>
      <confirm v-model="showConfirm2"
      title="余额不足，前往充值吗？"
      @on-confirm="$router.push('/balanceRecharge')">
        <p style="text-align:center;">余额：{{balance}}</p>
      </confirm>
    </div>
    <toast v-model="showToast" type="text" :time="800" is-show-mask :text="toastText" width="20em"></toast>
  </div>
</template>

<script>
import api from "../../api/Piles.js";
import {Toast, TransferDom, Confirm, PopupPicker} from 'vux'
import { mapState, mapGetters, mapMutations } from "vuex"
const accountid = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
const userItem = JSON.parse(localStorage.getItem("userItem")); //获取微信号
export default {
  data() {
    let years = new Array(5).fill('').map((item, index) => {
      return new Date().getFullYear() - index + ''
    })
    let months = ['1','2','3','4','5','6','7','8','9','10','11','12']
    let y = new Date().getFullYear() + ''
    let m = new Date().getMonth() + 1 + ''
    return {
      items: {},
      params: {
        chatid: userItem.openid, 
        monthStr: y + '-' + m
      },
      showToast: false,
      toastText: '',
      money: '',
      showConfirm1: false,
      // 确定缴费
      showConfirm2: false,
      // 确定充值
      monthList: [years, months],
      month: [y, months[m - 1]],
      showDialog: false,
      showBill: true,
      noData: '',
      thisMonthRent: '该月租金'
    };
  },

  computed: {
    ...mapState(['balance'])
  },

  components: {
    Toast,
    TransferDom,
    Confirm,
    PopupPicker
  },

  directives: {
    TransferDom
  },

  mounted() {
    this.getBill()
  },

  methods: {
    getBill() {
      api.rentUserBill(this.params).then(res => {
        console.log(res, '账单信息')
        if (res.data.items) {
          this.items = res.data.items
          this.showBill = true
        } else {
          this.items.roomname = ''
          this.items.rent = '0'
          this.items.status = 3
          this.showBill = false
          this.noData = res.data.returnMsg
        }
      })
    },
    pay() {
      if (this.balance >= this.items.rent) {
        this.showConfirm1 = true
      }else {
        this.showConfirm2 = true
      }
    },
    onConfirm() {
      api.payRentBill(this.params).then(res => {
        console.log(res, '缴纳房租')
        if (res.data.returnCode === 1) {
          this.toastText = '缴纳成功'
          this.showToast = true
          this.getBill()
        }else {
          this.toastText = '缴纳失败'
          this.showToast = true
        }
      })
    },
    pickMonth() {
      this.params.monthStr = this.month[0] + '-' + this.month[1]
      this.getBill()
    }
  },
  filters: {
    dateFilter(val) {
      let date = new Date(val)
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    }
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
#payRent {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgb(238,238,238);
  .bg {
    position: relative;
    height: 360 / @width75;
    background: url(../../assets/payRentBg.png);
    background-size: 100% 100%;
    h2 {
      padding: 40 / @width75 38 / @width75;
      color: #fff;
      font-size: 36 / @width75;
    }
    .month {
      position: absolute;
      top: 40 / @width75;
      right: 38 / @width75;
      width: 150 / @width75;
      height: 40 / @width75;
      padding-left: 53 / @width75;
      border: 2px solid #fff;
      color: #fff;
      line-height: 40 / @width75;
      background: url(../../assets/icon/calendar.png) no-repeat 20 / @width75 center;
      background-size: 20 / @width75;
      font-size: 20 / @width75;
      border-radius: 30 / @width75;
      box-sizing: border-box;
      #monthPicker {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }
  .card {
    position: absolute;
    top: 110 / @width75;
    left: 50%;
    transform: translate(-50%,0);
    width: 90%;
    // padding-bottom: 205 / @width75;
    padding-bottom: 57 / @width75;
    background-color: #fff;
    border-radius: 5px;
    &::before, &::after {
      content: '';
      position: absolute;
      top: 185 / @width75;
      width: 30 / @width75;
      height: 30 / @width75;
      background-color: rgb(46,168,175);
      border-radius: 50%;
    }
    &::before {
      left: -15 / @width75;
    }
    &::after {
      right: -15 / @width75;
    }
    .rent {
      height: 200 / @width75;
      padding: 54 / @width75 47 / @width75;
      border-bottom: 2px dashed #ddd;
      font-size: 60 / @width75;
      box-sizing: border-box;
      h3 {
        margin-bottom: 20 / @width75;
        font-size: 28 / @width75;
        color: rgb(153,153,153);
      }
    }
    .detail {
      min-height: 500 / @width75;
      .datano {
        text-align: center;
        font-size: 50 / @width75;
        padding-top: 100 / @width75;
      }
    }
    ul {
      padding: 0 32 / @width75;
      li {
        position: relative;
        width: 100%;
        height: 110 / @width75;
        border-bottom: 2px solid #eee;
        box-sizing: border-box;
        p {
          position: absolute;
          top: 50%;
          width: 100%;
          height: 32 / @width75;
          line-height: 32 / @width75;
          padding-left: 18 / @width75;
          transform: translate(0, -50%);
          border-left: 4px solid rgb(41,133,237);
          color: rgb(102,102,102);
          font-size: 32 / @width75;
          box-sizing: border-box;
          span {
            float: right;
          }
        }
      }
    }
  }
  .question {
    position: absolute;
    left: 50%;
    bottom: 50 / @width75;
    transform: translate(-50%,0);
    color: rgb(153,153,153);
    text-align: center;
  }
  .green {
    color: rgb(103,194,58);
  }
  .red {
    color: rgb(245,108,108);
  }
  .pay {
    // position: fixed;
    // left: 50%;
    // bottom: 57 / @width75;
    // transform: translate(-50%,0);
    width: 614 / @width75;
    height: 88 / @width75;
    margin: 60 / @width75 auto 0;
    color: #fff;
    line-height: 88 / @width75;
    text-align: center;
    font-size: 36 / @width75;
    background: linear-gradient(left,rgb(134,214,211), rgb(53,186,182));
    border-radius: 44 / @width75;
  }
}
</style>
