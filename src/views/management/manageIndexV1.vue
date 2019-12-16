<!-- 管理端首页 -->
<template>
  <div class="management">
    <div class="scroller-wrap">
        <div>
           <div class="box1">
               <div class="bgimg">
                 <div class="container">
                    <div class="total">
                      <ul>
                        <li>
                          <h3>累计总收入(元)</h3>
                          <p style="font-size:20px;color:white">{{totalMoney}}</p>
                        </li>
                        <li>
                          <h3>房租总收益(元)</h3>
                          <p style="font-size:20px;color:white">{{allRentPay}}</p>
                        </li>
                        <li>
                          <h3>总租房用户数  </h3>
                          <p style="font-size:20px;color:white">{{RentUse}}</p>
                        </li>
                      </ul>
                    </div>
                    <div class="month">
                      <h3 style="display:inline">本月总收入(元)</h3>
                      <p style="color:white;">{{monthMoney}}</p>
                    </div>
                    <div class="incomingSort">
                        <ul>
                          <li>
                            <div @click="$router.push('/rentRecord')"> 
                              <p style="display:inline">房租月收入</p>
                              <h2 style="color:white;">{{monthMoneyRent}}</h2>
                            </div>
                          </li>
                          <li>
                            <div @click="goMonthDetail(3)" >
                              <p style="display:inline">WIFI表月收入</p>
                              <h2 style="color:white;">{{monthMoneyWIFI}}</h2>
                            </div>
                          </li>
                          <li>
                            <div @click="goMonthDetail(1)" >
                              <p style="display:inline">充电桩月收入</p>
                              <h2 style="color:white;">{{monthMoneyCharging}}</h2>
                            </div>
                          </li>
                          <li>
                            <div @click="$router.push('/unpaidRecord')">
                              <p style="display:inline">上月账单未缴纳用户</p>
                              <h2 style="color:white;">{{noPay}}</h2>
                            </div>
                          </li>
                        </ul>
                    </div>

                 </div>
               </div>
           </div>

          <!-- 在线设备  离线设备  -->
          <div class="deviceClassify">
              <div class="imgcontiner">
                  <img src="../../assets/deviceClassify.png"> 
                  <p>设备分类统计</p>
              </div>
              <div class="typeContiner">
                  <div>
                    <p>WIFI表</p>
                    <img src="../../assets/wifidevice.png">
                    <div class="linenum" style="margin-top: 20px;">
                        <div @click="onlineDev(1)">
                          <p>在线数</p>
                        </div>
                        <div @click="onlineDev(2)">
                          <p>离线数</p>
                        </div>
                    </div>
                    <div class="linenum">
                        <div @click="onlineDev(1)">
                          <h2>{{onlineCountWIFI}}</h2>
                        </div>
                        <div @click="onlineDev(2)">
                          <h2>{{offlineCountWIFI}}</h2>
                        </div>
                    </div>
                  </div>

                  <div>
                    <p>充电桩</p>
                    <img src="../../assets/chargingdevice.png">
                      <div class="linenum" style="margin-top: 20px;">
                        <div @click="onlineDev(3)">
                          <p>在线数</p>
                        </div>
                        <div @click="onlineDev(4)">
                          <p>离线数</p>
                        </div>
                    </div>
                    <div class="linenum">
                        <div @click="onlineDev(3)">
                          <h2>{{onlineCountCharging}}</h2>
                        </div>
                        <div @click="onlineDev(4)">
                          <h2>{{offlineCountCharging}}</h2>
                        </div>
                    </div>
                  </div>
              </div>
          </div>
          <!-- <div class="devicenum">
            <div class="online">
              <h2>{{$t("barIndex.online")}}</h2>
              <p>
                <router-link to="/manageLine/1">{{totalMoney.onlineCount}}</router-link>
              </p>
            </div>
            <div class="line"></div>
            <div class="outline">
              <h2>{{$t("barIndex.unline")}}</h2>
              <p>
                <router-link to="/manageLine/0">{{totalMoney.offlineCount}}</router-link>
              </p>
            </div>
          </div> -->

          <!-- 剩余电量告警列表  -->
          <scroller
            height="-316px"
            lock-x
            ref="scroll"
            :use-pullup="true"
            :pullup-config="pullupDefaultConfig"
            @on-pullup-loading="loadMore"
          >
            <div>
              <div class="warn" v-if="devUserslist.total!=0">
                <img src="../../assets/powerlow1.png" alt>
                <p>{{$t("barIndex.userlist")}}</p>
              </div>
              <ul>
                <li v-for="(item,index) in devUserslist.data" :key="index">
                  <div>
                    <h1>{{item.chatname}}</h1>
                    <div class="usermess">
                      <div>
                        <h2>{{$t("barIndex.room")}}</h2>
                        <p>{{item.metername}}</p>
                      </div>
                      <div>
                        <h2>{{$t("barIndex.phone")}}</h2>
                        <p>{{item.phone}}</p>
                      </div>
                      <div class="position">
                        <h2>{{$t("barIndex.surplus")}}</h2>
                        <p>{{item.balancevlaue.toFixed(1)}} kWh</p>
                      </div>
                    </div>
                  </div>
                  <div class="recharge">
                    <router-link :to="{path:'/manageRecharge',query:{chargeitem:JSON.stringify(item)}}" class="rechargeLink">{{$t("personal.button")}}</router-link>
                  </div>
                </li>
              </ul>
              <div class="positionline"></div>
            </div>
            </scroller>
        </div>
    </div>
  </div>
</template>

<script>
import { Cell, Tab, TabItem, Group, Scroller } from "vux";
import Swiper from "swiper";
import "../../assets/styles/swiper.min.css";
import api from "../../api/Piles.js";
import { format } from "date-fns";
var id = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
// var id = '15303727826'
const pullupDefaultConfig = {
  content: "上拉加载更多",
  pullUpHeight: 60,
  height: 40,
  autoRefresh: false,
  downContent: "释放后加载",
  upContent: "上拉加载更多",
  loadingContent: "加载中...",
  clsPrefix: "xs-plugin-pullup-"
};
export default {
  components: {
    Cell,
    Tab,
    TabItem,
    Group,
    Scroller
  },
  data() {
    return {
      monthMoney: "", //本月收入
      monthMoneyCharging:"",//本月充电站收入
      noPay:"",//本月充电站收入
      monthMoneyWIFI:"",//本月WIFI表收益
      offlineCountCharging:"",//离线充电站数量
      monthMoneyRent: '',
      offlineCountWIFI:"",//离线wifi表数量
      onlineCountCharging:"",//在线充电桩数量
      onlineCountWIFI:"",//离线wifi表数量
      pullupDefaultConfig: pullupDefaultConfig,
      total:"",
      totalMoney: "", //收入详情
      allRentPay: "", //收入详情
      RentUse: "", //收入详情
      time: this.formatTime(new Date()), //今日，昨日，本月
      devUserslist: {
        total: 0,
        data: []
      }, //告警用户列表
      isEmpty: true,
      devalrmreq: {
        //告警用户参数
        accountid: id,
        pageSize: 5,
        pageNum: 1
      }
    };
  },

  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.$refs.scroll.reset({ top: 0 });
    });
    this.loadMore();
    this.getincome();
    this.initSwiper();
  },

  methods: {
    //   获取收入信息
    getincome() {
      api.statisticsIndex({ accountid: id }).then(res => {
        console.log(res.data);
        this.totalMoney = res.data.totalMoney;
        this.allRentPay = res.data.allRentPay;
        this.RentUse = res.data.RentUse;
        this.monthMoney = "+"+res.data.monthMoney;
        this.monthMoneyCharging = "+"+res.data.monthMoneyCharging;
        this.monthMoneyRent = "+"+res.data.monthMoneyRent;
        this.monthMoneyWIFI = "+"+res.data.monthMoneyWIFI;
        this.offlineCountCharging = res.data.offlineCountCharging;
        this.onlineCountCharging = res.data.onlineCountCharging;
        this.onlineCountWIFI = res.data.onlineCountWIFI;
        this.offlineCountWIFI = res.data.offlineCountWIFI;
        this.noPay = res.data.noPay;
      });
    },
    goMonthDetail(index){
        this.$router.push({name:"manageRecord",query:{timerange:this.time,apptype:index,num:0}})
      
        // if(index===1){
        //     //apptype 1 充电桩 3 wifi表
        //     this.$router.push({name:"manageRecord",query:{timerange:this.time,apptype:3,num:0}});
        // }else{
        //     this.$router.push({name:"manageRecord",query:{timerange:this.time,apptype:1,num:0}});
        // }
    },
    onlineDev(index){
        switch(index){
          case 1:if(this.onlineCountWIFI!=0){
            this.$router.push({name:"manageLine",query:{apptype:3,curstatus:1}})
          };
          break;
          case 2:if(this.offlineCountWIFI!=0){
            this.$router.push({name:"manageLine",query:{apptype:3,curstatus:0}})
          };
          break;
          case 3:if(this.onlineCountCharging!=0){
            this.$router.push({name:"manageLine",query:{apptype:1,curstatus:1}})
          };
          break;
          case 4:if(this.offlineCountCharging!=0){
            this.$router.push({name:"manageLine",query:{apptype:1,curstatus:0}})
          };
          break;
        }

    },
    //   设置时间格式
    formatTime(val) {
      return format(val, "YYYY-MM-DD");
    },
    // 获取电量告警用户
    getAlarmrecord(fn) {
      api.GetAlarmEnergyRecord(this.devalrmreq).then(res => {
        this.$nextTick(() => {
          this.$refs.scroll.reset();
        });
        this.devUserslist.total = res.data.total;
        if (this.devalrmreq.pageNum > 1) {
          this.devUserslist.data = this.devUserslist.data.concat(
            res.data.listitem
          );
        } else {
          this.devUserslist.data = res.data.listitem;
        }
        fn();
      });
    },
    // 加载更多的数据
    loadMore() {
      if (this.isEmpty) {
        this.isEmpty = false;
      } else {
        this.devalrmreq.pageNum++;
      }
      this.getAlarmrecord(() => {
        let index = this.devalrmreq.pageSize * this.devalrmreq.pageNum;
        if (this.devUserslist.total <= index) {
          this.$refs.scroll.disablePullup();
        } else {
          //   this.$refs.scroller.enablePullup();
        }
        this.$refs.scroll.donePullup();
      });
    },
    // 轮播
    initSwiper() {
      var mySwiper = null;
      mySwiper = new Swiper(".swiper-container", {
        slidesPerView: "auto",
        spaceBetween: 10,
        centeredSlides: true,
        observer: true,
        observeParents: true
      });
    }
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.management {
  background: #fafafa;
  padding-bottom: 125 / @width75;

  .swiper-container {
    padding: 20 / @width75 0 20 / @width75 0;
  }
  .vux-slider > .vux-swiper {
    width: 648 / @width75;
  }
  .deviceClassify{
    border-top: 1px solid #f4f4f4;
    border-bottom: 1px solid #f4f4f4;
    //display: flex;
    //justify-content: space-between;
    background: #fff;
    padding: 20 / @width75 40 / @width75;
    margin-top: 30 / @width75;
    text-align: center;
    .imgcontiner{
      float: left;
      >img{
        display: inline-block;
        width: 30px;
        height: 30px;
      }
      >p{
        padding-left: 5px;
        display: inline;
        font-size: 25px;
      }
    }
    .typeContiner{
      clear: both;
      display: flex;
      justify-content: space-between;
      //overflow: hidden;
      >div {
        margin-top: 15px;
        border-radius: 8px;
        width: 41%;
        height: 120px;
        padding: 20px;
        box-shadow:0px 0px 10px 1px #F4F4F4;
        >p{
          float: left;
          font-size: 28px;
          font-weight: bold;
        }
        img{
          float:right;
          width: 45px;
          height: 45px;;
        }
      }
    }
  }
  .linenum{
    clear: both;  
    div {
        float: left;
        width: 50%;
        margin-top: 10px;
        p{
          display: block;
          float: left;
          font-size: 20px;
          color: #B3B3B3;
        }
        h2{
          display: block;
          float: left;
          font-weight: bold;
        }
    }
    
    //background-color: pink;
  
  }
  .devicenum {
    border-top: 1px solid #f4f4f4;
    border-bottom: 1px solid #f4f4f4;
    background: #fff;
    display: flex;
    justify-content: space-between;
    padding: 20 / @width75 67 / @width75;
    text-align: center;
    .online {
      a {
        color: #35bab7;
      }
    }
    .outline {
      a {
        color: red;
      }
    }
    h2 {
      width: 240 / @width75;
      font-size: 28 / @width75;
      padding: 7 / @width75 0 8 / @width75;
      color: #999;
    }
    p {
      width: 240 / @width75;
      font-size: 48px;
      margin-top: 24 / @width75;
    }
    .line {
      height: 100 / @width75;
      width: 2px;
      background: #f5f5f5;
      margin-top: 4px;
    }
  }
  .box1{
    width: 100%;
    padding: 30 /@width75 0;
    padding-bottom: 0;
    background-color: #41ABBC;
    &:after{
      content: "";
      display: block;
      clear: both;
    }
  }
  .container {
      width: 100%;
      color:#ACD2EA;
      background-color: #41ABBC;
      margin-bottom: -2px;
      .total {
        ul {
          display: flex;
          list-style:none;
          overflow: hidden;
          height: 100px;
          li{
              display: flex;
              flex-direction: column;
              flex: 1;
              background-color: #41ABBC;
              margin-bottom:-2px;
              padding: 0;
              // h3 {
              //   text-align: left;
              // }
              // p{
              //   text-align: right;
              // }
          }
        }
      }
      .month {
        display: flex;
        margin-left: 40px;
        margin-top: 40px;
        p {
          margin-left: 30px;
        }
      }
  }
  .incomingSort{
            display: block;
            margin-top: 20px;
            ul {
              overflow: hidden;
              display: flex;
              flex-wrap: wrap;
              li {
                box-sizing: border-box;
                width: 50%;
                height: 60px;
                background-color: #41ABBC;
                margin-bottom:-2px;
                padding: 0;
                border-top: 1px solid #1B99A7;
                &:nth-child(2n) {
                  border-left: 1px solid #1B99A7;
                }
              }
            }
            div {
              width: 100%;
              height: 100%;
              padding: 0 40px;
              line-height: 60px;
              box-sizing: border-box;
              p {
                float: left;
                font-size: 25px;
              }
              h2{
                float:right;
              }
            }

  }
  .bgimg {
    // width: 644 / @width75 !important;
    height: 270 / @width75; 
    text-align: center;
    border-radius: 10px;
    //background: url("../../assets/icon/Section/bgimg.png") center center;
    background-size: 100%;
    background-color: #41ABBC;
    // float: left;
    // margin-left: 30/@width75;
    .account {
      h4 {
        margin-top: 20 / @width75;
        margin-bottom: 40 / @width75;
        color: #aee2d8;
        font-size: 26 / @width75;
        padding: 8 / @width75 0 7 / @width75;
      }
      p {
        font-size: 72 / @width75;
        padding: 13 / @width75 12 / @width75;
        color: #fff;
      }
      a {
        color: #fff;
      }
      .monthin {
        display: flex;
        margin-top: 24 / @width75;
        // justify-content: space-between;
        p {
          font-size: 32 / @width75;
          margin-top: 14 / @width75;
          padding: 0;
        }
        .line {
          width: 2px;
          height: 52 / @width75;
          background: #7ad2dc;
          margin-top: 8 / @width75;
        }
        .todayin {
          width: 214 / @width75;
          height: 52 / @width75;
        }
        .yesin {
          width: 214 / @width75;
        }
        .list {
          width: 214 / @width75;
          a {
            color: #fff;
          }
        }
        h5 {
          color: #aee2d8;
        }
      }
    }
  }
  .warn {
    background: #fff;
    height: 110 / @width75;
    border-top: 1px solid #f6f6f8;
    border-bottom: 1px solid #f6f6f8;
    display: flex;
    padding-left: 40 / @width75;
    img {
      width: 32 / @width75;
      height: 32 / @width75;
      margin: 40 / @width75 20 / @width75 0 0;
    }
    p {
      font-size: 34 / @width75;
      font-weight: bold;
      line-height: 110 / @width75;
    }
  }
  .positionline {
    height: 2 / @width75;
    border-top: 0.013333rem solid #f6f6f6;
  }
  ul {
    background: #fff;
    li {
      display: flex;
      align-items: center;
      padding: 14 / @width75 38 / @width75;
      border-bottom: 1px solid #f6f6f6;
      justify-content: space-between;
      h1 {
        font-size: 32 / @width75;
        font-weight: bold;
        padding: 9 / @width75 0 8 / @width75 0;
      }
      .usermess {
        display: flex;
        margin-top: 14 / @width75;
        div {
          width: 175 / @width75;
          margin-right: 27 / @width75;
          h2 {
            color: #a3a3a3;
            font-size: 20 / @width75;
          }
          p {
            font-weight: bold;
            margin-top: 10 / @width75;
          }
        }
        .position {
          margin-right: 0;
        }
      }
      .recharge {
        width: 132 / @width75;
        height: 58 / @width75;
        border: 2px solid #4ac1bf;
        text-align: center;
        line-height: 58 / @width75;
        border-radius: 29 / @width75;
        font-size: 28 / @width75;
        background: linear-gradient(left, rgb(134,214,211), rgb(53,186,182));
        .rechargeLink {
          color: #fff;
        }
      }
    }
  }
}
[v-cloak] {
  display: none;
}
.weui-tabbar {
  height: 125 / @width75;
  background: #f7f7fa !important;
}
.weui-tabbar__icon {
  width: 45px !important;
  height: 45px !important;
  margin-bottom: 8 / @width75;
  margin-top: 15 / @width75;
}
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
  color: #000000 !important;
}
.vux-tab-wrap .vux-tab-container .vux-tab .vux-tab-item {
  font-size: 28 / @width75;
  color: #666;
}
</style>
<style lang="less">
@width75: 75rem;
.vux-no-group-title {
  margin-top: 0;
}
.weui-cell {
  padding: 32 / @width75;
  color: #999;
  .weui-cell__ft {
    color: #000;
    margin-right: 24 / @width75;
  }
}
.weui-cell_access .weui-cell__ft:after {
  width: 14 / @width75;
  height: 14 / @width75;
  right: -20 / @width75;
  top: 42%;
}
.vux-tab-wrap .vux-tab-container .vux-tab {
  height: 80 / @width75;
}
.weui-toast__content {
  height: 150 / @width75;
  line-height: 150 / @width75;
  font-size: 40 / @width75;
}
</style>


