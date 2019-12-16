<!--电价管理  -->
<template>
  <div class="eleprice">
       <tab v-model="index01" prevent-default @on-before-index-change="switchTabItem">
      <tab-item >电表</tab-item>
      <tab-item>充电桩</tab-item>
  </tab>
<!-- WIFI表  ================================================================== -->
    <ul v-if="switchPrice">
      <li v-for="(item,index) in pricelist" :key="index">
        <div class="surface">
          <h1 v-if="index<9">{{"0"+(index+1)}}</h1>
          <h1 v-else>{{index+1}}</h1>
          <div class="register" v-if="item.totalused!=0">{{$t("eleprice.used")}}</div>
          <div class="register unregister" v-else>{{$t("eleprice.notused")}}</div>
          <div class="surbox">
            <div class="room">
              <h2>{{$t("eleprice.pricename")}}</h2>
              <p>{{item.pricename}}</p>
            </div>
            <div class="eleid">
              <h2>{{$t("eleprice.price")}}</h2>
              <p>{{item.pricevalue.toFixed(1)}}元/kWh</p>
            </div>
          </div>
        </div>
        <div v-transfer-dom>
          <confirm v-model="show" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm(item)">
            <p class="text-center">{{$t("eleprice.confirmdele")}}</p>
          </confirm>
        </div>
        <div class="btngroup" v-if="item.totalused == 0">
          <button @click="edit(item)">{{$t("eleprice.edit")}}</button>
          <button class="unborder" @click="dele(item)">{{$t("eleprice.delete")}}</button>
        </div>
      </li>
    </ul>
    <!-- 充电桩============================================================================ -->
    <ul v-if="!switchPrice">
      <li v-if="listitem.length !=0">
        <div class="surface">
          <h1>充电桩电价</h1>
          <div class="surbox">
            <div class="room">
              <h2>序号</h2>
            </div>
            <div class="eleid">
              <h2>价格</h2>
            </div>
          </div>
          <div class="surbox" v-for="(item ,index) in listitem" :key="index">
            <div class="room">
              <h2>{{index+1}}</h2>
            </div>
            <div class="eleid">
              <h2>{{item.price}}元/{{item.hour}}小时</h2>
            </div>
          </div>
        </div>
        <div class="btngroup">
          <button @click="edit(listitem)">{{$t("eleprice.edit")}}</button>
          <button class="unborder" @click="dele(listitem)">{{$t("eleprice.delete")}}</button>
        </div>
      </li>
      <li v-if="listitem.length ==0">
        <div class="surface">
          <h1>没有充电桩电价请新增</h1>
        </div>
      </li>
    </ul>
    <div v-transfer-dom>
          <confirm v-model="chargingShow" :title="$t('device.tips')" :confirm-text="$t('device.determine')" :cancel-text="$t('device.cancel')" @on-confirm="onConfirm(listitem)">
            <p class="text-center">{{$t("eleprice.confirmdele")}}</p>
          </confirm>
    </div>
    <x-button @click.native="add">{{$t("eleprice.add")}}</x-button>
  </div>
</template>

<script>
import { Group, XButton, TransferDom, Confirm ,Tab, TabItem, Sticky, Divider, Swiper, SwiperItem } from "vux";
import api from "../../api/Piles.js";
var id = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
export default {
  data() {
    return {
      use: true, //是否已经使用
      pricelist: "", //数据
      show: false,  //提示框
      chargingShow:false,
      index01: 0,
      switchPrice:true,
      listitem:"",
      optType:"",
    };
  },

  components: {
    Group,
    XButton,
    Confirm,
    Tab,
    TabItem,
    Sticky,
    Divider,
    Swiper,
    SwiperItem
  },
  directives: {
    TransferDom
  },
  computed: {},

  mounted() {
    this.getPricelist();
  },

  methods: {
    switchTabItem (index) {
        this.$vux.loading.show({
          text: 'loading'
        })
        setTimeout(() => {
          this.$vux.loading.hide()
          this.index01 = index
        }, 500)
        if(index==0){
          this.switchPrice = true;
          this.getPricelist();
        }else{
          this.switchPrice = false;
          this.getchargingPriceList();
        }
    },
    //  跳转到电价编辑
    add() {
      if(this.switchPrice){
        this.$router.push("/manageEleedit/0");
      }else{
        if(this.listitem.length > 0){
            this.$vux.loading.show({
              text: '已有电价'
            })
            setTimeout(() => {
              this.$vux.loading.hide()
            }, 1000) ;            
        }else{
           this.$router.push("/manageChargingEleedt/0");
        }
      }  
    },
    //   跳转到电价编辑
    edit(item) {
      if(this.switchPrice){
        this.$router.push({ path: "/manageEleedit/1", query: { id: item } });
     }else{
      if(item!=null){
        this.$router.push({ path: "/manageChargingEleedt/1", query: { id: item } });
      }else{
        console.log("没有电价信息请去新增")
      }
     }
    },
    //   获取价格列表
    getPricelist() {
      api.GetPriceList({ accountid: id }).then(res => {
        this.pricelist = res.data.listitem;
      });
    },
    getchargingPriceList(){
      api.GetchargingPriceList({ accountid: id }).then(res => {
          this.listitem = this.sortKey(res.data.listitem,'hour');
      });
    },
    sortKey(array,key){
      return array.sort(function(a,b){
      var x = a.key;
      var y = b.key;
      return ((x<y)?-1:(x>y)?1:0)
      })
    },
    //   删除
    dele() {
      if(this.switchPrice){
        this.show = true;
      }else{
        this.chargingShow = true;
      }
      
    },
    // 确认删除
    onConfirm(item) {
        if(this.switchPrice){
           api.PriceInfo({ optType: 3, item: item, accountid: id }).then(res => {
              if(res.data.success ==1){
                this.getPricelist();
              }else{
                  this.getPricelist();
              }

           });
           this.getPricelist();
        }else{
          api.CharingPriceInfo({ optType: 3, item: item, accountid: id }).then(res => {
              if(res.data.success ==1){
                 this.getchargingPriceList();
              }else{
                 this.getchargingPriceList();
              }

          });
        }
    }
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.eleprice {
  ul {
    padding: 20 / @width75 38 / @width75 88 / @width75;
    li {
      background: #fff;
      margin-bottom: 20 / @width75;
      .surface {
        padding: 20 / @width75 0 16 / @width75 30 / @width75;
        position: relative;
        border-bottom: 1px solid #f6f6f6;
        h1 {
          padding: 17 / @width75 0 16 / @width75;
          font-size: 60 / @width75;
          font-weight: bold;
        }
        .register {
          position: absolute;
          top: 40 / @width75;
          right: 0;
          width: 156 / @width75;
          height: 40 / @width75;
          line-height: 40 / @width75;
          text-align: center;
          border-radius: 20 / @width75 0 0 20 / @width75;
          background: #96d79f;
          color: #fff;
        }
        .unregister {
          background: #f29279;
        }
      }
      .surbox {
        margin-top: 20 / @width75;
        display: flex;
        .room {
          width: 140 / @width75;
          margin-right: 50 / @width75;
          h2 {
            color: #999999;
            padding: 5 / @width75 0;
          }
          p {
            padding: 6 / @width75 0 5 / @width75;
            margin-top: 2 / @width75;
          }
        }
        .eleid {
          width: 180 / @width75;
          h2 {
            color: #999999;
            padding: 5 / @width75 0;
          }
          p {
            padding: 6 / @width75 0 5 / @width75;
            margin-top: 2 / @width75;
          }
        }
      }
      .btngroup {
        display: flex;
        button {
          width: 336 / @width75;
          padding: 16 / @width75 0 18 / @width75;
          background: #fff;
          color: #35bab6;
          font-size: 32 / @width75;
          border-right: 1px solid #f4f4f4;
          display: block;
        }
        .unborder {
          border: none;
        }
        .edit {
          width: 100%;
          border-right: 0;
        }
      }
    }
  }
  .weui-btn {
    position: fixed;
    bottom: 0;
    height: 88 / @width75;
    background: #35bab7;
    color: #fff;
  }
}
</style>
