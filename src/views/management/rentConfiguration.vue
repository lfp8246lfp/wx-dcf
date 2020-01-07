<!-- 新增编辑房租 -->
<template>
  <div id="rentConfiguration">
    <group>
      <x-input ref="chatname" title="租客名称" v-model="form.chatname" placeholder="请输入住户" :is-type="chatnameValid" @on-change="inputChange('chatname')"></x-input>
      <x-input ref="phone" title="租客手机号" v-model="form.phone" placeholder="请输入住户" :is-type="phoneValid" @on-change="inputChange('phone')"></x-input>
      <datetime v-model="form.starttime" title="租房开始时间" :min-year="minYear"></datetime>
      <datetime v-model="form.endtime" title="租房结束时间"></datetime>
      <x-input ref="rent" title="房租" v-model="form.rent" placeholder="请输入房租" :is-type="rentValid" @on-change="inputChange('rent')">
        <span slot="right">元/月</span>
      </x-input>
      <x-input ref="paymentfrequency" title="缴费间隔" v-model="form.paymentfrequency" placeholder="请输入缴费间隔" :is-type="paymentfrequencyValid" @on-change="inputChange('paymentfrequency')">
        <span slot="right">个月</span>
      </x-input>
      <!-- <popup-picker title="租房时长" v-model="form.rentTime" :data="rentTime"></popup-picker>
      <datetime v-model="form.starttime" title="租房开始时间" :min-year="minYear"></datetime>
      <x-input title="缴纳房租日期" v-model="form.datepayment" placeholder="请输入日期">
        <span slot="right">号</span>
      </x-input> -->
    </group>
    <x-button @click.native="add" :disabled="disabled">确定</x-button>
    <toast v-model="showToast" type="text" :time="800" is-show-mask :text="toastText" width="20em"></toast>
  </div>
</template>
<script>
import api from "../../api/Piles.js"
import { Group, Cell, XButton, XInput, Selector, TransferDom, Confirm, PopupPicker, Datetime, Toast } from "vux"
import { setTimeout } from 'timers';
const accountid = JSON.parse(localStorage.getItem("operatorUserItem")).accountid
const userItem = JSON.parse(localStorage.getItem("userItem"))
export default {
  data() {
    return {
      form: {
        rent: '',
        // rentTime: ['三个月'],
        paymentfrequency: '1',
        starttime: '',
        endtime: '',
        // datepayment: '',
        chatname: '',
        phone: '',
      },
      // rentTime: [['三个月', '六个月', '十二个月', '二十四个月']],
      minYear: new Date().getFullYear(),
      showToast: false,
      toastText: '',
      disabled: true,
      chatnameValid: function(val) {
        return {
          valid: val.length > 0,
          msg: '请输入姓名'
        }
      },
      phoneValid: function(val) {
        return {
          valid: /^1[345789]\d{9}$/.test(val),
          msg: '请输入手机号'
        }
      },
      rentValid: function(val) {
        return {
          valid: /^[0-9]*$/.test(val),
          msg: '请输入数字'
        }
      },
      paymentfrequencyValid: function(val) {
        return {
          valid: /^[0-9]*$/.test(val),
          msg: '请输入数字'
        }
      },
      tenantChatid: '',
    }
  },
  components: {
    Group,
    Cell,
    XButton,
    XInput,
    Selector,
    Confirm,
    TransferDom,
    PopupPicker,
    Datetime,
    Toast
  },
  mounted() {
    let roomid = this.$store.state.roomid
    if (roomid) {
      this.searchTenant()
    }
  },
  methods: {
    searchTenant() {
      let roomid = this.$store.state.roomid
      api.selectTenantInfo({roomid}).then(res => {
        console.log(res, '获取租户')
        if (res.data.returnCode === 1) {
            this.form.chatname = res.data.items[0].chatname
            this.form.phone = res.data.items[0].phone
            this.tenantChatid = res.data.items[0].chatid
            if (res.data.items.length < 1) {
              this.toastText = '无法获取租户'
              this.showToast = true
            }
        }
      })
    },
    add() {
      if (this.form.starttime.length === 0) {
        this.toastText = '请选择租房开始时间'
        this.showToast = true
        return
      } else if (this.form.endtime.length === 0) {
        this.toastText = '请选择租房结束时间'
        this.showToast = true
        return
      } else if (this.form.rent.trim().length === 0) {
        this.toastText = '请输入租金'
        this.showToast = true
        return
      } else if (this.form.phone.trim().length === 0) {
        this.toastText = '请输入租客手机号'
        this.showToast = true
        return
      } else if (this.form.chatname.trim().length === 0) {
        this.toastText = '请输入租客名称'
        this.showToast = true
        return
      } else if (this.form.paymentfrequency.trim().length === 0) {
        this.toastText = '请输入缴费间隔'
        this.showToast = true
        return
      }
      let time1 = this.form.starttime
      let time2 = this.form.endtime
      console.log(time1,time2)
      let rentTime = (Number(time2.substr(0,4)) - Number(time1.substr(0,4))) * 12 + Number(time2.substr(5,2)) - Number(time1.substr(5,2))
      let obj = {
        accountid,
        optType: 1,
        roomid: this.$store.state.roomid,
        rent: this.form.rent,
        automaticbill: 1,
        datepayment: 10,
        paymentfrequency: this.form.paymentfrequency,
        rentTime,
        starttime: this.form.starttime + ' 00:00:00',
        tenementchatid: this.tenantChatid
      }
      console.log(this.tenantChatid, 'hhh')
      api.optRoomConfiguration(obj).then(res => {
         console.log(res, '新增')
         if (res.data.returnCode === 1) {
           this.toastText = '配置成功'
           this.showToast = true
           setTimeout(() => {
             this.$router.push('/manageRoom')
           }, 1000)
         } else {
           this.toastText = '配置失败'
           this.showToast = true
         }
      })
    },
    timeFilter(val) {
      let date = new Date(val)
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0')
    },
    inputChange(ref) {
      if(this.$refs[ref].valid == true && this.form[ref] != ''){
        this.disabled = false
      }else{
        this.disabled = true
      }
    },
    // 中文和数字的双向转换，一个参数直接转换，两个参数转换差
    // timeConfig(time1, time2) {
    //   let time
    //   if (time2) {
    //     time = new Date(+new Date(time2) - +new Date(time1)).getMonth()
    //   } else {
    //     time = time1
    //   }
    //   let numArr = [1,3,6,12,24]
    //   let strArr = ['一个月','三个月','六个月','十二个月','二十四个月']
    //   let numIndex = numArr.findIndex(item => item === time)
    //   let strIndex = strArr.findIndex(item => item === time)
    //   if (numIndex != -1) {
    //     return strArr[numIndex]
    //   } else if (strIndex != -1) {
    //     return numArr[strIndex]
    //   }
    // },
  },
};
</script>
<style lang='less'>
@width75: 75rem;
#rentConfiguration {
  .cell {
    position: relative;
    height: 88 / @width75;
    padding-left: 272 / @width75;
    border-bottom: 1px solid rgb(244,244,244);
    line-height: 88 / @width75;
    color: rgb(51,51,51);
    &:last-of-type {
      border: 0;
    }
    span {
      position: absolute;
      left: 40 / @width75;
    }
    i {
      position: absolute;
      right: 40 / @width75;
      &.arrow {
        color: rgb(200,200,200);
        font-family: serif;
      }
    }
  }
  .weui-btn {
    position: fixed;
    bottom: 10 / @width75;
    left: 50%;
    transform: translate(-50%, 0);
    width: 674 / @width75;
    height: 88 / @width75;
    line-height: 88 / @width75;
    background: linear-gradient(left, rgb(134,214,211), rgb(53,186,182));
    color: #fff;
    text-align: center;
    border-radius: 44 / @width75;
    font-size: 36 / @width75 !important;
  }
  .weui-cell {
    height: 88 / @width75;
    .weui-cell__hd {
      width: 250 / @width75;
      padding-left: 30 / @width75;
      color: rgb(51,51,51);
    }
    .vux-popup-picker-value {
      float: left;
    }
    .vux-cell-value {
      float: left;
    }
  }
  .vux-datetime {
    p {
      width: 250 / @width75;
      padding-left: 30 / @width75;
    }
  }
}
</style>
