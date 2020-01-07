<!-- 新增编辑房间 -->
<template>
    <div id="editRoom">
        <group>
            <x-input title="房间名称" v-model="form.roomname" placeholder="请输入房间名称" :show-clear="false"></x-input>
            <x-input title="用户名" v-model="form.householdName" placeholder="请输入用户名" :show-clear="false"></x-input>
            <x-address title="省市区" v-model="addressArr" :list="addressData" @on-hide="hide" placeholder="请选择地址"></x-address>
            <x-input title="详细地址" v-model="form.disc" placeholder="请输入详细地址" :show-clear="false"></x-input>
        </group>
        <confirm v-model="removeshow" title="提示" confirm-text="确定" cancel-text="取消" @on-confirm="onConfirm">
          <p>继续操作？</p>
        </confirm>
        <toast v-model="showToast" type="text" width="15em" :time="800" :text="toastText"></toast>
        <x-button @click.native="editRoom">确定</x-button>
        <!-- <div>{{hh}}</div> -->
    </div>
</template>
<script>
import axios from 'axios'
import api from "../../api/Piles.js"
import { Group, XButton, XInput, TransferDom, Confirm, XAddress, ChinaAddressV4Data, Toast } from "vux"
const accountid = JSON.parse(localStorage.getItem("operatorUserItem")).accountid
export default {
  data() {
    return {
        form: {
            roomname: '',
            householdName: '',
            province: '',
            town: '',
            region: '',
            disc: '',
        },
        addressArr: [],
        addressData: ChinaAddressV4Data,
        optype: 1,
        id: '',
        toastText: '',
        showToast: false,
        removeshow: false,
        hh:''
    }
  },
  components: {
    Group,
    XButton,
    XInput,
    Confirm,
    TransferDom,
    XAddress,
    Toast
  },
  created() {
  },
  mounted() {
    let room = this.$route.params
    console.log(room, 'room')
    if (!room.id) {
        // 新增
        this.optype = 1
        this.id = null
        console.log('新增')
        return
    }
    // 编辑
    this.form.roomname = room.roomname
    this.form.householdName = room.accountid
    this.form.disc = room.disc
    this.form.province = room.province
    this.form.town = room.town
    this.form.region = room.region
    let p = this.addressData.find(item => item.name === room.province).value
    let t = this.addressData.find(item => item.name === room.town).value
    let r = this.addressData.find(item => item.name === room.region).value
    this.addressArr = [p, t, r]
    this.optype = 2
    this.id = room.id
    // this.hh = JSON.stringify(room) + ' room ' + JSON.stringify(this.addressArr) + ' 编辑'
    console.log('编辑')
  },
  methods: {
      editRoom() {
          if (!this.form.roomname.trim()) {
            this.toastText = '请输入房间名称'
            this.showToast = true
            return
          } else if (!this.form.householdName.trim()) {
            this.toastText = '请输入用户名'
            this.showToast = true
            return
          } else if (!this.form.disc.trim()) {
            this.toastText = '请输入详细地址'
            this.showToast = true
            return
          } else if (!this.addressArr.length) {
            this.toastText = '请选择省市区'
            this.showToast = true
            return
          }
          this.removeshow = true
      },
      onConfirm() {
        let obj = {
            accountid,
            optype: this.optype,
            id: this.id,
            ...this.form
        }
        // this.hh = JSON.stringify(this.form) + ' 新增'
        api.optUnit(obj).then(res => {
          console.log(res, '新增/修改房间')
          if (res.data.returnCode === 1) {
            this.toastText = '操作成功'
            this.showToast = true
            this.$router.push('/manageRoom')
          } else {
            this.toastText = '操作失败'
            this.showToast = true
          }
        })
      },
      hide() {
          if (!this.addressArr[0]) return // 当没有选择时，不用进行之后的操作
          let p = this.addressData.find(item => item.value === this.addressArr[0]).name
          let t = this.addressData.find(item => item.value === this.addressArr[1]).name
          let r = this.addressData.find(item => item.value === this.addressArr[2]).name
          this.form.province = p
          this.form.town = t
          this.form.region = r
          // this.hh = JSON.stringify(this.form)
      }
  },
};
</script>
<style lang='less'>
@width75: 75rem;
#editRoom {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgb(235,235,235);
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
    .vux-popup-picker-value, .vux-popup-picker-placeholder {
        float: left;
    }
  }
  .vux-label {
    width: 200 / @width75;
    font-size: 28 / @width75;
    margin-right: 40 / @width75;
  }
  .weui-cell__ft {
    color: #000;
    font-size: 28 / @width75;
  }
  .weui-label {
    font-size: 28 / @width75;
    width: 200 / @width75 !important;
    margin-right: 40 / @width75;
  }
  .weui-input {
    font-size: 28 / @width75;
    padding-left: 0;
  }
  .weui-cell__hd {
    label {
      color: black;
    }
  }

  .weui-btn {
    width: 674 / @width75;
    height: 88 / @width75;
    line-height: 88 / @width75;
    background: linear-gradient(left, rgb(134,214,211), rgb(53,186,182));
    color: #fff;
    text-align: center;
    margin: 60 / @width75 auto;
    border-radius: 44 / @width75;
    font-size: 36 / @width75 !important;
  }
}
</style>
