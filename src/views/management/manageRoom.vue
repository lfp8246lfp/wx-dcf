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
          <button @click="roomDev(item.id)">
              房间设备
          </button>
          <!-- <button @click="$router.push('/monthConsumption')">
              月用量编辑
          </button> -->
        </div>
      </li>
    </ul>
    <p class="datano" v-show="datano">
      <img src="../../assets/noData.png" alt="">
      <br>
      暂无数据
    </p>
    <toast v-model="showToast" type="text" :time="800" is-show-mask :text="toastText" width="20em"></toast>
    <div v-transfer-dom>
      <confirm v-model="removeshow" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirmremove">
        <p class="text-center">{{$t("device.confirmdeletion")}}</p>
      </confirm>
    </div>
    <div class="add" @click="add">
      {{$t("eleprice.add")}}
    </div>
  </div>
</template>

<script>
import { Confirm, TransferDom, Toast } from 'vux'
import api from '../../api/Piles.js'
import { mapMutations } from 'vuex'
const accountid = JSON.parse(localStorage.getItem('operatorUserItem')).accountid
// const accountid = '15303727826'
// const accountid = '15988873909'
const userItem = JSON.parse(localStorage.getItem('userItem')) //获取微信号
export default {
  data() {
    return {
      roomList: [],
      showToast: false,
      toastText: '',
      datano: false, //暂无数据
      activeIndex: -1, //删除对应的数据
      removeshow: false, //删除提示
      item: {}, // 暂存要删除房间的信息
      datano: true
    };
  },
  directives: {
    TransferDom
  },
  components: {
    Confirm,
    Toast
  },
  created() {
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
            if (res.data.total > 0) {
              this.roomList = res.data.items
              this.datano = false
            } else {
              this.datano = true
            }
        })
    },
    rentConfig(room) {
      console.log(room, 'room')
      this.$store.commit('changeRoom', room.id)
      if (room.renttotal > 0) {
          // 已经有租房用户时，直接去租客列表
        this.$router.push('/tenantsRecord')
        return
      }
      if (room.rtunum < 1) {
          // 房间下没有设备时，不能配置房租
        this.toastText = '该房间暂时不能配置房租'
        this.showToast = true
      } else if (room.rtunum > 1) {
          // 房间下设备数大于1时，选择租户
        this.$router.push('/searchTenant')
      } else {
          // 房间下设备数是1时，配置房租
        this.$router.push('/rentConfiguration')
      }
    },
    showcontent: function(index) {
      if (this.activeIndex == index && this.activeIndex != -1) {
        this.activeIndex = -1
      } else {
        this.activeIndex = index
      }
    },
    // 删除
    remove(item) {
      this.removeshow = true
      this.item = item
    },
    // 确认删除
    onConfirmremove() {
      let {id, accountid: householdName, roomname, province, town, region, disc} = this.item
      let obj = {id, householdName, roomname, province, town, region, disc, optype: 3, accountid}
      api.optUnit(obj).then(res => {
        console.log(res, '删除房间')
        this.getRoomList()
        this.toastText = '删除成功'
        this.showToast = true
      })
    },
    roomDev(roomid) {
      this.$store.commit('changeRoom', roomid)
      this.$router.push('/manageDevice')
    },
    // 编辑
    jumped(item) {
      console.log(item, '编辑参数')
      this.$router.push({ name: 'editRoom', params: item })
    },
    // 添加
    add() {
      this.$router.push({ path: '/editRoom' })
    },
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
  .datano {
    text-align: center;
    font-size: 32 / @width75;
    margin: 32 / @width75;
    padding-bottom: 32 / @width75;
    color: rgb(153,153,153);
    img {
      width: 262 / @width75;
      height: 210 / @width75;
      margin: 320 / @width75 0 70 / @width75;
    }
  }
</style>
