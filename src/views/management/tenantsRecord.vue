<!-- 房间管理 -->
<template>
  <div id="tenantsRecord">
    <div v-for="item in tenants" :key="item.id" class="item">
      <h2>
        <img src="../../assets/icon/tenant.png" alt="">
        {{item.chatname}}
      </h2>
      <ul>
        <li>
          <span>租客手机号：</span>
          {{item.phone}}
        </li>
        <li>
          <span>房租：</span>
          {{item.rent}} 元/月
        </li>
        <li>
          <span>租房开始时间：</span>
          {{item.starttime | dateFilter}}
        </li>
        <li>
          <span>租房结束时间：</span>
          {{item.endtime | dateFilter}}
        </li>
      </ul>
      <i class="delete" @click="remove(item)"></i>
    </div>
    <div class="add" @click="add">新增</div>

    <div v-transfer-dom>
      <confirm v-model="removeShow" title="提示" confirm-text="确定" cancel-text="取消" @on-confirm="onConfirmRemove">
        <p class="text-center">确定删除？</p>
      </confirm>
    </div>
    <toast v-model="showToast" type="text" :time="800" is-show-mask :text="toastText" width="20em"></toast>
  </div>
</template>

<script>
import api from "../../api/Piles.js"
import { Cell, TransferDom, Confirm, Group, XDialog, XButton, Toast } from "vux"
const accountid = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
const userItem = JSON.parse(localStorage.getItem("userItem")); //获取微信号
export default {
  data() {
    return {
      tenants: [],
      removeShow: false,
      item: {},
      showToast: false,
      toastText: ''
    };
  },

  computed: {},

  mounted() {
    this.getTenantList()
  },

  components: {
    Cell,
    TransferDom,
    Confirm,
    Group,
    XDialog,
    XButton,
    Toast
  },

  directives: {
    TransferDom
  },

  methods: {
    getTenantList() {
      let roomid = this.$route.params.id
      let obj = {
        accountid,
        pageNum: 1,
        pageSize: 10,
        roomid
      }
      api.getRoomConfiguration(obj).then(res => {
        console.log(res, '租客列表')
        this.tenants = res.data.items
      })
    },
    add() {
      let roomid = this.$route.params.id
      let params = {roomid}
      console.log(params)
      this.$router.push({name: 'searchTenant', params})
    },
    remove(item) {
      this.removeShow = true
      this.item = item
    },
    onConfirmRemove() {
      let roomid = this.$route.params.id
      let obj = {
        accountid,
        id: this.item.id,
        optType: 3,
        roomid,
        rent: this.item.rent,
        automaticbill: this.item.automaticbill,
        datepayment: this.item.datepayment,
        paymentfrequency: this.item.paymentfrequency
      }
      api.optRoomConfiguration(obj).then(res => {
        console.log(res, '删除租客')
        if (res.data.returnCode === 1) {
          this.toastText = '删除成功'
          this.showToast = true
          this.getTenantList()
        } else {
          this.toastText = '删除失败'
          this.showToast = true
        }
      })
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
#tenantsRecord {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  // height: 100%;
  min-height: 100%;
  background-color: rgb(235,235,235);
  padding-bottom: 100 / @width75;
  box-sizing: border-box;
  .item {
    position: relative;
    margin: 20 / @width75 38 / @width75;
    padding: 30 / @width75;
    background-color: #fff;
    h2 {
      position: relative;
      height: 90 / @width75;
      padding-left: 40 / @width75;
      font-size: 32 / @width75;
      line-height: 90 / @width75;
      font-weight: 700;
      img {
        position: absolute;
        top: 50%;
        left: 0;
        width: 32 / @width75;
        height: 32 / @width75;
        transform: translate(0, -50%);
      }
    }
    ul {
      li {
        height: 46 / @width75;
        line-height: 46 / @width75;
        font-size: 24px;
        color: rgb(153,153,153);
      }
    }
    .delete {
      position: absolute;
      right: 40 / @width75;
      bottom: 40 / @width75;
      width: 40px;
      height: 40px;
      background: url(../../assets/icon/trash.png);
      background-size: contain;
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
}
</style>
