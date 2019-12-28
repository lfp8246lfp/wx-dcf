<!-- 充电记录  -->
<template>
  <div id="">
    <ul class="list">
      <li v-for="(item,index) in list" :key="index">
        <h3>{{item.chatname}}</h3>
        <ul class="info">
          <li>
            <span>总金额：</span>
            {{item.rent.toFixed(1)}}
          </li>
          <li>
            <span>缴费日期：</span>
            {{item.deadline | dateFilter}}
          </li>
          <li>
            <span>是否逾期：</span>
            {{new Date().getDate() > new Date(item.deadline).getDate() ? '是' : '否' }}
          </li>
          <li>
            <span>剩余天数：</span>
            {{new Date(item.deadline).getDate() - new Date().getDate()}}
          </li>
        </ul>
        <x-button @click.native="press(item,index)" :ref="item.chatid">催款</x-button>
      </li>
    </ul>
    <x-button @click.native="pressAll" id="pressAll">{{pressAllText}}</x-button>
    <toast v-model="showToast" type="text" :time="800" is-show-mask :text="toastText" width="30em"></toast>
  </div>
</template>

<script>
import { XButton, Toast } from "vux"
import api from "../../api/Piles.js"
import { setTimeout } from 'timers';
const accountid = JSON.parse(localStorage.getItem("operatorUserItem")).accountid
const userItem = JSON.parse(localStorage.getItem("userItem"))
export default {
  data() {
    return {
      list: [
        {
          "chatid": "563",//用户微信id
          "monthstr": "2019-12",//月份	
          "roomid": 171.0,//房间id
          "rent": 30.0,//房租	
          "totalmoney": 30.0,//总金额
          "deadline": "Dec 26, 2019 12:00:00 AM",//最终缴纳日期
          "disc": "房租测试",//描述
          "status": 2.0,//状态 未缴纳
          "departmentid": 2355.0,
          "chatname": "魏亚军",//租客名称
          "phone": "15303727826",//租客手机号
          "Overdue": false,//是否逾期
          "overdueTime": 22.0,// 逾期 就是逾期天数 未逾期 就是剩余缴纳纳天数
          disabled: false, 
          timer: 10000
        },
      ],
      showToast: false,
      toastText: '',
      disabled: false,
      timer: 0,
      pressAllText: '全部催款'
    };
  },
  components: {
    XButton,
    Toast
  },

  mounted() {
    this.getList()
  },

  methods: {
    getList() {
      let obj = {
        accountid,
        pageNum: 1,
        pageSize: 10,
        status: 2
      }
      api.getFailurePay(obj).then(res => {
        console.log(res,'未缴费用户')
        if (res.data.returnCode !== 1) return
        this.list = res.data.items.map(item => ({disabled: false, timer: 60000, ...item}))
      })
    },
    press(item, index, all = '') {
      if (item.disabled) {
        if (all) return
        this.toastText = '请不要频繁操作，一分钟后再试'
        this.showToast = true
        return
      }
      this.list[index].disabled = true
      setTimeout(() => {
        this.list[index].disabled = false
      }, this.list[index].timer)
      let date = new Date(item.deadline)
      let deadline = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      let obj = {
	      "title":"账单缴费提醒",
	      "userOpenid": item.chatid,
	      "mpAccount":"wx63478c60a33d8fa9",
	      "datas":`国天测试\t房租\t${item.rent}\t${deadline}\t${accountid}`,
	      "jumpUrl":"https://open.weixin.qq.com/connect/oauth2/authorize?appid=omTdO1Qy25KGxzw4jKAGp4rtakCw&redirect_uri=http%3a%2f%2fgateway.statesky.cn%2fgatewayh5%2f%23%2fdataDetail%2f&response_type=code&scope=snsapi_base&state=1&conn"
      }
      api.SendWaringMsg(obj).then(res => {
        console.log(res, '催款', index)
        this.toastText = `${all}催款成功`
        this.showToast = true
      })
    },
    pressAll() {
      if (this.disabled) {
        this.toastText = '请不要频繁操作，一分钟后再试'
        this.showToast = true
        return
      }
      this.disabled = true
      setTimeout(() => {
        this.disabled = false
      }, 60000)
      this.list.forEach((item,index) => {
        this.press(item, index, '全部')
      })
    }
  },
  filters: {
    dateFilter(val) {
      let date = new Date(val)
      return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
    }
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.list {
  >li {
    position: relative;
    height: 172 / @width75;
    padding: 0 38 / @width75;
    border-bottom: 1px solid rgb(238,238,238);
    h3 {
      height: 70 / @width75;
      font-size: 32 / @width75;
      font-weight: 700;
      line-height: 70 / @width75;
    }
    .info {
      display: flex;
      flex-wrap: wrap;
      width: 80%;
      li {
        width: 250 / @width75;
        height: 40 / @width75;
        line-height: 40 / @width75;
        font-size: 24 / @width75;
        span {
          color: rgb(153,153,153);
        }
      }
    }
    .weui-btn {
      position: absolute;
      top: 57 / @width75;
      right: 39 / @width75;
      width: 132 / @width75;
      height: 58 / @width75;
      color: #fff;
      line-height: 58 / @width75;
      background: linear-gradient(left, rgb(134,214,211), rgb(53,186,182));
      border-radius: 29 / @width75;
    }
  }
}
#pressAll {
  position: fixed;
  bottom: 0;
  height: 88 / @width75;
  background: #35bab7;
  color: #fff;
}
</style>

