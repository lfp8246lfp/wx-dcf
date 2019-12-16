<template>
  <div class="feed">
    <div class="feed-top">
      <p @click="nomal()">
        <span :class="{active:show==1}">{{$t('feedback.faq')}}</span>
        <b :class="{bg:show==1}"></b>
      </p>
      <p @click="feed()">
        <span :class="{active:show==2}">{{$t("feedback.back")}}</span>
        <b :class="{bg:show==2}"></b>
      </p>
    </div>
    <div class="feed-cont" v-show="show==1">
      <div class="feed-box" >
        <h1>{{$t("feedback.problemo")}}</h1>
        <p>{{$t("feedback.ano")}}</p>
      </div>
      <div class="feed-box" >
        <h1>{{$t("feedback.problemt")}}</h1>
        <p>{{$t("feedback.ant")}}</p>
      </div>
      <div class="feed-box" >
        <h1>{{$t("feedback.problemth")}}</h1>
        <p>{{$t("feedback.anth")}}</p>
      </div>
      <div class="feed-box" >
        <h1>{{$t("feedback.problemf")}}</h1>
        <p>{{$t("feedback.anf")}}</p>
      </div>
    </div>
    <div class="feed-boxs" v-show="show==2">
      <div v-for="(item,index) in data" :key="index" @click="detail(item)">
        <p>{{item.commentbody}}</p>
        <div class="imgs" >
          <div v-for="(imgs,imgindex ) in item.imgpath " :key="imgindex">
            <img :src="imgs" alt>
          </div>
        </div>
        <!-- <div class="back">
          <p>
            <span>回复：</span>您可以先这样干，在这样干，然后在怎么怎么公式发送九分裤代理费
          </p>
        </div> -->
      </div>
    </div>
    <button class="btnback" @click="newfeed()">
      <img src="../../assets/add.png" alt>
      <span>{{$t("feedback.addpro")}}</span>
    </button>
  </div>
</template>

<script>
import api from "@/api/Piles";
var userItem = JSON.parse(localStorage.getItem("userItem"));
export default {
  data() {
    return {
      show: 1,
      params:{
        pageSize:10,
        pageNum:1,
        chatid:userItem.openid
      },
      data:{}
    };
  },
  computed: {
  },
  mounted(){
    this.getDate();
    if(sessionStorage.getItem("tab")){
      this.show=sessionStorage.getItem("tab");
    }
    
  },
  methods: {
    getDate(){
      api.getFeedBackChatInfo(this.params).then(res=>{
        res.data.listItem.forEach(item => {
            if (item.imgpath != null) {
                item.imgpath = item.imgpath.split(",");
            }
        })
        this.data=res.data.listItem
      })
    },
    nomal() {
      this.show = 1;
      sessionStorage.setItem("tab",this.show)
    },
    feed() {
      this.show = 2;
      sessionStorage.setItem("tab",this.show)
    },
    newfeed(){
      this.$router.push('/newFeedBack');
    },
    detail(item){
      this.$router.push({name:"backDetail",query:JSON.stringify(item)});
    }
  }
};
</script>

<style lang="less" scoped>
@width75: 75rem;
.feed {
  .feed-top {
    padding: 16 / @width75 132 / @width75;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgb(238, 238, 238);
    p {
      text-align: center;
      span {
        display: block;
        color: rgb(153, 153, 153);
        font-size: 28 / @width75;
      }
      b {
        display: block;
        width: 80 / @width75;
        border-bottom: 4 / @width75 solid none;
        margin: 10 / @width75 auto 0;
      }
      .active {
        color: rgb(51, 51, 51);
      }
      .bg {
        border-bottom: 4 / @width75 solid rgb(53, 186, 182);
      }
    }
  }
  .feed-cont {
    padding: 0 39 / @width75;
    .feed-box {
      border-bottom: 1px solid rgb(244, 244, 244);
      padding: 30 / @width75 0 0;
      h1 {
        font-size: 32 / @width75;
        border-left: 6 / @width75 solid rgb(53, 186, 182);
        padding-left: 16 / @width75;
        font-weight: bold;
      }
      p {
        color: rgb(153, 153, 153);
        font-size: 24 / @width75;
        margin: 28 / @width75 0 30 / @width75;
        line-height: 28/@width75;
      }
    }
  }
  .feed-boxs {
    // padding: 0 39 / @width75 ;
    
    >div{
      border-bottom: 1px solid rgb(238, 238, 238);
      padding: 30/@width75 39/@width75;
    }
    p {
      font-size: 28 / @width75;
      line-height: 34 / @width75;
    }
    .imgs {
      display: flex;
      justify-content: start;
      img {
        width: 140 / @width75;
        margin: 30 / @width75 33 / @width75 0 0;
      }
    }
    .back {
      margin-top: 40 / @width75;
      height: 64 / @width75;
      background: rgb(245, 245, 245);
      padding: 0 36 / @width75 0 22 / @width75;
      p {
        line-height: 64 / @width75;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 24 / @width75;
        color: rgb(51, 51, 51);
        span {
          color: rgb(53, 186, 182);
        }
      }
    }
  }
  .btnback{
    display: block;
    width: 280/@width75;
    height: 80/@width75;
    line-height: 80/@width75;
    border-radius: 40/@width75;
    background: rgb(53, 186, 182);
    font-size: 32/@width75;
    color: #fff;
    margin: 30/@width75 auto 0;
    img{
      width: 31/@width75;
      margin-top: -2px;
    }
  }
}
</style>

