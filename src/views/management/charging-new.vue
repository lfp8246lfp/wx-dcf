<!-- 添加新的设备 -->
<template>
  <div class="eleedit">
    <group class="edit">
      <x-input title="通讯地址" v-model="data.optStationInfo.commaddress" placeholder="请输入电表编号"></x-input>
      <x-input title="充电站名称"  type="text" v-model="data.optStationInfo.disc" placeholder="名字为必填"></x-input>
      <x-input title="充电站编号" type="text" v-model="data.optStationInfo.version" placeholder="请输入充电站编号"></x-input>
      <x-input title="安装位置"  type="text" v-model="data.optStationInfo.installer" placeholder="请填写安装位置"></x-input>
      <x-input title="纬度" type="text" v-model="data.optStationInfo.dimension" readonly></x-input>
      <x-input title="经度" type="text" v-model="data.optStationInfo.longitude" readonly></x-input>
      <x-input title="插座数量" v-model="chargingnum" placeholder="插座数量可快速选择" v-if="showChargenum"></x-input>
      <x-input title=""  readonly v-if="showChargenum"></x-input>
      <group title="快速选择" v-if="showChargenum">
              <radio title="title" :options="chargingType"  :selected-label-style="{color: '#FF9900'}" v-model="chargingnum"></radio>
      </group>
       <!--<x-input title="" type="text" readonly></x-input>
        <group title="电站类型">
              <radio title="title" :options="carType" :selected-label-style="{color: '#FF9900'}" v-model="data.optStationInfo.apptype"></radio>
      </group> -->
    </group>
    <x-button @click.native="eleedit" class="eleedit-btn">确定</x-button>

    <div v-transfer-dom>
      <confirm v-model="commaddressshow" title="提示" @on-confirm="onConfirm">
        <p class="text-center">请填写8位电表编号</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="exist" title="提示" @on-confirm="onConfirm">
        <p class="text-center">电表号已存在</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Group, XButton, XInput, Cell, Radio, TransferDom, Confirm } from "vux";
var   locationAddress    = JSON.parse(sessionStorage.getItem("Location"));
import api from "../../api/Piles.js";
import wx from 'weixin-js-sdk';
var id = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
export default {
  data() {
    return {
      meternameshow: false, //房间号提示
      commaddressshow: false, //电表编号提示
      exist: false, //存在提示
      radio001: [],
      radioData: "",
      commaddress: "", //电表编号
      metername: "", //房间号
      alarmenergy: 20,
      show: "", //按钮切换
      items: "" ,//传递过来的数据
      optType:"",
      showChargenum:true,
      commaddress :"",
      data: {
        optStationInfo: {
        rtuid          : "",
        commaddress    : "",
        disc           : "",
        version        : "",
        installer      : "",
        longitude      : locationAddress.longitude,
        dimension      : locationAddress.latitude,
        apptype        : "1",
        ischangeaddress: 0,
        },
      }, 
      datas:{
      },
      chargingnum:"",//插座数量
      carType: [
        {
          key  : "1",
          value: "电瓶车"
        },
        {
          key  : "2",
          value: "电动汽车"
        }
      ],  
      chargingType:[
        {
          key:"10",
          value:"10路"
        },
        {
          key:"20",
          value :"20路"
        }
      ],
    };
  },
  directives: {
    TransferDom
  },
  components: {
    Group,
    XButton,
    XInput,
    Cell,
    Radio,
    Confirm,
    TransferDom
  }, 
  computed: {
  },
  mounted() {
        //  wx.getLocation({
        //     type   : 'gcj02',          // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        //     success: function (res) {
        //         sessionStorage.setItem("Location", JSON.stringify(res));
        //         console.log(111111);
        //         console.log(res);
        //     }
        // });
        this.obj    = this.$route.query.funditem;
        if(this.obj != null){//新增
                this.data.optStationInfo ={
                rtuid          :this.obj.rtuid,
                commaddress    : this.obj.commaddress,
                disc           : this.obj.disc,
                version        :this.obj.version,
                installer      : this.obj.installer,
                longitude      : locationAddress.longitude,
                dimension      : locationAddress.latitude,
                ischangeaddress: 0,
                apptype        : "1"
            }
            this.showChargenum = false;
            this.commaddress = this.obj.commaddress;
        }else{
          this.showChargenum = true;
        }
      },
  methods: {
      OptStation() {
        this.datas = {
              optType: this.optType,
              accountid:id,
              obj    : this.data.optStationInfo,
              chargingnum:this.chargingnum
          }
          console.log(this.datas); 
          if(this.optType==1){
            delete this.datas.obj.rtuid;
          }else if(this.optType == 2){
            delete this.datas.chargingnum;
            if(this.commaddress == this.datas.obj.commaddress){
              this.datas.obj.ischangeaddress =0;
            }else{
               this.datas.obj.ischangeaddress =0;
            }
          }
          this.$store
            .dispatch("AC_OptStation",this.datas)
            .then(res => {
              if (res.data.returnResult == 1) {
                this.$store.commit("UPDATE_TOAST", "操作成功");
                this.$router.push({ path: "/chargeCar" });
              } else {
                this.$store.commit("UPDATE_TOAST", "操作失败");
              }
            });
    },
    // 确定事件
    eleedit: function(event) {
      var _this = this;
      var commaddress = this.data.optStationInfo.commaddress;
      //    判断只能是8位数字的正则表达式
      var re1 = /^\d{8}$/;
      if (commaddress == "" || !re1.test(commaddress)) {
        this.commaddressshow = true;
      } else {
          
          if(this.data.optStationInfo.rtuid!=null &&this.data.optStationInfo.rtuid!=""){
            //更新
            this.optType="2";
            this.OptStation();
          }else{
            //新增
            this.optType="1";
            this.OptStation();
          }
      }
    },
    // 确定事件（只是个形式）
    onConfirm() {}
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.eleedit {
  .eleedit-btn {
    width: 674 / @width75;
    height: 88 / @width75;
    line-height: 88 / @width75;
    background: #35bab7;
    color: #fff;
    text-align: center;
    margin: 60 / @width75 auto;
    border-radius: 44 / @width75;
    font-size: 36 / @width75 !important;
  }
}
</style>
<style lang="less" >
@width75: 75rem;
.edit {
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
  }
  .vux-label {
    width: 200 / @width75;
    font-size: 32 / @width75;
    margin-right: 40 / @width75;
  }
  .weui-cell__ft {
    color: #000;
    font-size: 32 / @width75;
  }
  .weui-label {
    font-size: 32 / @width75;
    width: 275 / @width75 !important;
    margin-right: 40 / @width75;
  }
  .weui-input {
    font-size: 32 / @width75;
    padding-left: 0;
  }
  .weui-cell__hd {
    label {
      color: black;
    }
  }
  .weui-cells .weui-cells__title {
  font-size: 30 / @width75;
  position : relative;
  bottom   : 35 / @width75;
  }
}
.new {
  .weui-cells__title {
    height: 48 / @width75;
    line-height: 48 / @width75;
    padding: 7 / @width75 0 6 / @width75;
    padding-left: 38 / @width75;
    margin: 0;
    font-size: 32 / @width75;
  }
}
</style>
