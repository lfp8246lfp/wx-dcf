<template>
  <div>
  	<div class="top-title">
  		<p>设备编号: {{selectStation2.commaddress}}</p>
  			<div v-if="selectStation2.curstatus==0">
        	<img src="../assets/icon/Section/Group4@2x.png"/>
        	<span class="icon">设备{{selectStation2.curstatus|curstatus}}</span>
      	</div>
      	<div v-if="selectStation2.curstatus==1">
        	<img src="../assets/icon/Section/equipment @2x.png"/>
        	<span class="icon icon2">设备{{selectStation2.curstatus|curstatus}}</span>
      	</div>
  	</div>
  	<div class="top-details">
  		<div class="top-details-left">
  			<h4>{{selectStation2.disc}}</h4>
  			<p>{{selectStation2.installer}}</p>
  		</div>
  		<!-- <div class="top-details-right">
  			<p>{{ selectStation2.commaddress}}</p>
  		</div> -->
  	</div>
    <div class="content">
    	<div class="title">
    		充电桩
    	</div>
      <flexbox :gutter="0" wrap="wrap">
        <flexbox-item :span="1/5" v-for="item of  socketList" :key="item.number" class="socket-list" @click.native="jump(item)">
          <div class="blue" :class="{orange:item.usestatus==2}">
            <p> {{item.tagno}}</p>
            <h4> {{item.usestatus|usestatus}}</h4>
          </div>

        </flexbox-item>
      </flexbox>
    </div>

    <div class="btn-box">
      <x-button  @click.native="qrCode" class="btn">

        <span>扫码充电</span>

      </x-button>
    </div>
    <div class="footer">
      <div class="footer-intro">
      	备注
      </div>
      <div class="instruction">
        按时收费：<span>{{showData.showvalue1}}</span>
      </div>
      <div class="instruction">
        标准功率：<span>{{showData.showvalue2}}</span>
      </div>
      <div class="instruction">
      	充电费用：<span v-for="item of priceList" :key="item.priceid">{{item.price}}元/{{item.hour}}小时 &nbsp;</span>
      </div>
			<div class="instruction">
      	开放时间：<span>00:00 - 23:59</span>
      </div>
    </div>
  </div>
</template>
<script>
import "@/tools/filter/filter.js";
import wechat from "../tools/wechat";
import {
  Panel,
  Divider,
  XButton,
  Flexbox,
  FlexboxItem,
  Grid,
  GridItem
} from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";
import api from "../api/Piles.js";
var locationAddress = JSON.parse(sessionStorage.getItem("Location"));
var userItem        = JSON.parse(localStorage.getItem("userItem"));
export default {
  components: {
    Panel,
    Divider,
    XButton,
    Flexbox,
    FlexboxItem,
    Grid,
    GridItem
  },
  beforeCreate() {
   if (userItem != null) {
      var user = wechat.getSubscribe(userItem.appid, userItem.openid);  //获取返回值
      //promsie里压根就读不到this，也就是说取不到全局变量，这就是作用域问题了
      //我们在promise外面定义let _this =this ，然后在promise里使用_this就好了
      let _this = this;  //
      user.then(function(userInfo) {
        if (userInfo.subscribe == 0) {
          _this.$router.push("/aboutpublic");
        }
      });
    } else {
      this.$router.push("/login");
    }
  },
  mounted: function() {
    var type = this.$route.params.type;
    var id ;
    var ownerid;
    if(type == 0){//点击
      id = this.$route.params.id;
      ownerid = this.$route.params.ownerid;
       this.$store.dispatch("AC_GetSocketList", {
      objectid: id,
      chatid  : userItem.openid
    });
    setTimeout(() => {
      this.$store
        .dispatch("AC_GetSocketList2", {
          objectid: id,
          chatid  : userItem.openid
        })
        .then(res => {
        //   console.log(JSON.stringify(res.item));
          const data2 = res.item;
          if (data2) {
            this.selectStation2 = data2;
          }
        });
    }, 500);
    this.$store.dispatch("AC_GetPriceList", {
      objectid: ownerid
    });
    this.$store
      .dispatch("AC_GetShowInfo", {
        objectid: 1
      })
      .then(res => {
        const data = res.data.item;
        if (data) {
          this.showData = data;
        }
      });
    }else{//扫码
      var commaddress = this.$route.params.id;
      var  ownerid ;
      api.GetDcuWebChatInfo({
          dcuaddress: commaddress
        })
        .then(res => {
           id = res.data.item.rtuid;
           ownerid = res.data.item.ownerid;
          this.$store.dispatch("AC_GetSocketList", {
            objectid: id,
            chatid  : userItem.openid
          });
          setTimeout(() => {
            this.$store
              .dispatch("AC_GetSocketList2", {
                objectid: id,
                chatid  : userItem.openid
              })
              .then(res => {
              //   console.log(JSON.stringify(res.item));
                const data2 = res.item;
                if (data2) {
                  this.selectStation2 = data2;
                }
              });
          }, 500);
          this.$store.dispatch("AC_GetPriceList", {
            objectid: ownerid
          });
          this.$store
            .dispatch("AC_GetShowInfo", {
              objectid: 1
            })
            .then(res => {
              const data = res.data.item;
              if (data) {
                this.showData = data;
              }
          });
      });  
    }
   
  },
  methods: {
    jump(socket) {
      this.$store.commit("UPDATE_SelectScoket", socket);
      if (socket.usestatus == 2) {
        if (socket.itself == 1) {
          this.$router.push({ path: `/tab2/${socket.pmeterid}` });//自己正在使用
        } else {
          this.$store.commit("UPDATE_TOAST", "该插头其他用户正在使用");
        }
      } else {
        this.$router.push({ path: `/payment/0/${socket.pmeterid}/0` });//他人正在使用
      }
    },
    qrCode() {
      console.log("扫码");
      this.$router.push("/qrCode");
    }
  },
  computed: {
    ...mapGetters([
      "socketInfo",
      "socketList",
      "priceList",
      "priceInfo",
      "selectStation"
    ])
  },
  data: function() {
    return {
      showData      : {},
      selectStation2: {}
    };
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;

.top-title {
  padding-left   : 38 / @width75;
  padding-right  : 28 / @width75;
  height         : 80 / @width75;
  line-height    : 80 / @width75;
  background     : #ffffff;
  border-bottom  : 1px solid rgba(0, 0, 0, 0.1);
  display        : flex;
  justify-content: space-between;
  p {
    color    : #666666;
    font-size: 28 / @width75;
  }
  span {
    font-size: 20 / @width75;
    color    : #999999;
  }
  img {
    display : inline-block;
    width   : 28 / @width75;
    height  : 28 / @width75;
    position: relative;
    top     : -2 / @width75;
  }
}

.top-details {
  margin-bottom  : 20 / @width75;
  height         : 166 / @width75;
  background     : #ffffff;
  display        : flex;
  justify-content: space-between;
  padding-left   : 38 / @width75;
  padding-right  : 48 / @width75;
  overflow       : hidden;
  .top-details-left {
    width   : 550 / @width75;
    overflow: hidden;
    h4 {
      font-size    : 32 / @width75;
      line-height  : 44 / @width75;
      height       : 44 / @width75;
      margin-top   : 30 / @width75;
      font-weight  : bolder;
      margin-bottom: 18 / @width75;
      overflow     : hidden;
      text-overflow: ellipsis;
      white-space  : nowrap;
    }
    p {
      font-size    : 26 / @width75;
      line-height  : 36 / @width75;
      height       : 36 / @width75;
      color        : #666666;
      overflow     : hidden;
      text-overflow: ellipsis;
      white-space  : nowrap;
    }
  }
  .top-details-right {
    width     : 230 / @width75;
    text-align: center;
    img {
      display      : inline-block;
      width        : 46 / @width75;
      margin-top   : 34 / @width75;
      margin-bottom: 14 / @width75;
    }
    p {
      font-size  : 26 / @width75;
      line-height: 36 / @width75;
      color      : #000000;
    }
  }
}

.content {
  background    : #ffffff;
  padding-bottom: 42 / @width75;
  margin-bottom : 20 / @width75;
  .title {
    padding-left : 38 / @width75;
    height       : 104 / @width75;
    line-height  : 104 / @width75;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    font-size    : 28 / @width75;
    color        : #666666;
  }
  .socket-list {
    text-align: center;
    .blue {
      p {
        width        : 112 / @width75;
        height       : 112 / @width75;
        line-height  : 112 / @width75;
        text-align   : center;
        border-radius: 56 / @width75;
        background   : #35bab6;
        overflow     : hidden;
        color        : #ffffff;
        font-size    : 32 / @width75;
        margin-left  : 20 / @width75;
        margin-top   : 34 / @width75;
      }
      h4 {
        line-height: 36 / @width75;
        height     : 36 / @width75;
        margin-top : 14 / @width75;
        font-size  : 26 / @width75;
        color      : #666666;
        font-weight: normal;
      }
    }

    .orange {
      p {
        width        : 112 / @width75;
        height       : 112 / @width75;
        line-height  : 112 / @width75;
        text-align   : center;
        border-radius: 56 / @width75;
        background   : #dedede;
        overflow     : hidden;
        color        : #ffffff;
        font-size    : 32 / @width75;
        margin-left  : 20 / @width75;
        margin-top   : 34 / @width75;
      }
      h4 {
        line-height: 36 / @width75;
        height     : 36 / @width75;
        margin-top : 14 / @width75;
        font-size  : 26 / @width75;
        color      : #dedede;
        font-weight: normal;
      }
    }
  }
}

.footer {
  background    : #ffffff;
  padding-bottom: 38 / @width75;
  .footer-intro {
    line-height  : 104 / @width75;
    height       : 104 / @width75;
    padding-left : 40 / @width75;
    font-size    : 28 / @width75;
    color        : #666666;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .instruction {
    padding-left : 38 / @width75;
    padding-right: 38 / @width75;
    font-size    : 28 / @width75;
    line-height  : 44 / @width75;
    color        : #000000;
    margin-top   : 26 / @width75;
    span {
      color: #666;
    }
  }
}
.btn-box {
  width        : 672 / @width75;
  height       : 88 / @width75;
  margin       : 40 / @width75 auto;
  border       : none;
  border-radius: 44 / @width75;
  overflow     : hidden;
//   .weui-btn    : after {
//     display: none;
//   }
  .btn {
    height     : 88 / @width75;
    line-height: 88 / @width75;
    font-size  : 40px;
    background : #35bab6;
    color      : #ffffff;
    font-size  : 34 / @width75;
  }
}

.weui-toast {
  width        : 540 / @width75!important;
  height       : 180 / @width75!important;
  border-radius: 20 / @width75!important;
  top          : 50% !important;
  margin-top   : -90 / @width75!important;
  overflow     : hidden;
  background   : rgba(0, 0, 0, 0.3) !important;

  .weui-toast__content {
    line-height: 160 / @width75!important;
    font-size  : 36 / @width75!important;
  }
}
</style>
