<template>
  <div class="newfeed">
    <div class="top">
      <x-textarea
        :max="200"
        :placeholder="$t('feedback.place')"
        @on-focus="onEvent()"
        v-model="value"
        :rows="9"
      ></x-textarea>
    </div>
    <div class="addimg">
      <p>{{$t("feedback.addpictures")}}</p>
        <el-upload
          action="http://gate.statesky.cn/wxqn/qiniuService/upload"
          list-type="picture-card"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          >
          <i class="el-icon-plus"></i>
        </el-upload>
    </div>
    <button class="sure" @click="submint">{{$t("device.determine")}}</button>
    <div v-transfer-dom>
      <confirm v-model="showcont" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm1">
        <p class="text-center">{{$t("feedback.contempty")}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showimg" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm1">
        <p class="text-center">{{$t("feedback.imgempty")}}</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { XTextarea,TransferDom, Confirm } from "vux";
import api from "../../api/Piles.js";
var userItem = JSON.parse(localStorage.getItem("userItem")); //获取微信号
export default {
  data() {
    return {
      value: "",
      dialogImageUrl: '',
      dialogVisible: false,
      imgs:[],
      showcont:false,
      showimg:false
    };
  },
  components: {
    XTextarea,
    Confirm
  },
   directives: {
    TransferDom
  },
  methods: {
    onEvent(event) {
      console.log("on", this.value);
    },
    submint(){
      if (typeof this.imgs != 'string') {
        this.imgs = this.imgs.join(",");
      }
      if(this.value==""){
        this.showcont=true;
      }
      else if(this.imgs==[]){
        this.showimg=true;
      }else{
        api.optFeedBackChatInfo({
          optType:1,
          chatid:userItem.openid,
          saveItem:{
            commentbody :this.value,
            imgpath :this.imgs,
            openid :userItem.openid,
          }
        }).then(res=>{
          if(res.data.returnCode==1){
            this.$router.push('/feedSuccess');
          }
        })
      } 
    },
    handleRemove(file, fileList) {
      this.imgs = [];
      fileList.forEach(item => {
          this.imgs.push(item.url);
      })
    },
    handleSuccess(response){
      this.imgs.push("http://" + response.url);
    },
    onConfirm1(){}
  }
};
</script>

<style lang="less" scoped>
@width75: 75rem;
.newfeed {
  height: 100%;
  .top {
    background: #fff;
    padding-bottom: 30 / @width75;
  }
  .sure{
      display: block;
      width: 674/@width75;
      height: 88/@width75;
      border-radius: 44/@width75;
      background: rgb(53, 186, 182);
      color: white;
      text-align: center;
      margin: 60/@width75 auto 0;
      font-size: 36/@width75;
  }
  .addimg{
    // display: flex;justify-content: start;
    border-top:1px solid #eeeeee;
    padding: 30/@width75 39/@width75;
    background:#fff;
    p{
      margin-bottom: 30/@width75;
      color: #999999;
    }
  }
}
.weui-cell {
  padding: 30 / @width75 39 / @width75 0;
}
</style>
<style lang="less">
@width75:75rem;
.el-upload--picture-card{
  width: 140/@width75;
  height: 140/@width75;
}
.el-upload--picture-card i {
    font-size: 28px;
    color: #8c939d;
}
.el-upload--picture-card{
  line-height:140/@width75;
}
.el-upload-list--picture-card .el-upload-list__item{
  width: 140/@width75;
  height: 140/@width75;
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