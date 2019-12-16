<template>
  <div class="myMoney">
    <div class="icon-box">
      <span class="iconfont icon-money">
        &#xe618;
      </span>
    </div>
    <p>手机余额</p>
    <h3>¥{{userInfos.balancevlaue}}</h3>
    <box gap="10px 10px">
      <x-button :gradients="['#1D62F0', '#19D5FD']" class="btn" >
          <router-link to="/balanceRecharge">
        充值</router-link>
        
       </x-button>
    </box>
    <div class="bottom">
  
      <!-- <router-link :to="{name: 'rechargeRecord',params:{rechargetype:1}}" class="herf">
        账单明细</router-link> -->

    </div>

  </div>
</template>
<script>
import { XButton, Box } from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  components: {
    XButton,
    Box
  },
  computed:{
     ...mapGetters(['userInfos'])
  },
  mounted(){
  
  },
  methods: {

  },
  data() {
    return {};
  }
};
</script>

<style scoped lang="less">

.myMoney {
  background: white;
  height: 100%;
  text-align: center;
  position: relative;
  font-size: 40px;
  .icon-money {
    color: orangered;
    font-size: 200px;
  }
  h3 {
    font-size: 80px;
  }
  .btn {
     font-size: 40px;
    a{
      display: inline-block;
      width: 100%;
      height: 100%;
      color: white
     
    }
  }
  .bottom {
    position: absolute;
    bottom: 40px;
    left: 0;
    right: 0;
    margin: auto;
    a {
      display: block;
      width: 100%;
      height: 64px;
      color: #1d62f0;
    }
  }
}
</style>
