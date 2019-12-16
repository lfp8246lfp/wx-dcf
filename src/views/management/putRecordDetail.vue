<!--提现记录详情  -->
<template>
  <div class="putRecordDetail">
    <div class="de-top">
        <p>{{$t("put.amount")}}</p>
        <h1>{{data.rechargevalue}}</h1>
        <div class="de-mess">
            <p>{{$t("putrecord.method")}}</p>
            <span>{{chageType(data.withdrawtype)}}</span>
        </div>
        <div class="de-mess">
            <p>{{$t('put.name')}}</p>
            <span>{{data.payid}}</span>
        </div>
        <div class="de-mess">
            <p>{{$t('abchange.processingtime')}}</p>
            <span>{{formatTime(data.withdrawdate)}}</span>
        </div>
    </div>
    <div class="de-btn">
        <p>{{$t("abchange.processingprogress")}}</p>
        <div class="progress">
            <div class="cont">
                <div class="circle" :class="{circleColor:isColor==4||isColor==3||isColor==2||isColor==1}"></div>
                <div class="text">
                    <p>{{$t("putrecord.application")}}</p>
                    <!-- <span>2018-11-19</span> -->
                </div>  
            </div>
            <div class="line" :class="{lineColor:isColor==4||isColor==3||isColor==2}"></div>
            <div class="cont">
                <div class="circle" :class="{circleColor:isColor==4||isColor==3||isColor==2}"></div>
                <div class="text">
                    <p>{{$t("putrecord.audit")}}</p>
                    <!-- <span>2018-11-19</span> -->
                </div>  
            </div>
            <div class="line" :class="{lineColor:isColor==4||isColor==3}"></div>
            <div class="cont">
                <div class="circle" :class="{circleColor:isColor==4||isColor==3}"></div>
                <div class="text">
                    <p>{{$t("putrecord.payment")}}</p>
                    <!-- <span>2018-11-19</span> -->
                </div>  
            </div>
            <div class="line" :class="{lineColor:isColor==4}"></div>
            <div class="cont">
                <div class="circle" :class="{circleColor:isColor==4}"></div>
                <div class="text">
                    <p>{{$t("putrecord.terminal")}}</p>
                    <!-- <span>2018-11-19</span> -->
                </div>  
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import api from "../../api/Piles.js";
import { format } from "date-fns";
import {
    Flow, FlowState, FlowLine
} from "vux";
export default {
  data() {
    return {
        withdrawlogid:'',
        isColor:false,
        data:{}
    };
  },
  components: {
   Flow, FlowState, FlowLine
  },

  computed: {},

  mounted() {
    this.withdrawlogid=this.$route.params.id;
    this.getWithdRawLog()
  },

  methods: {
    getWithdRawLog(){
        api.querySingleWithdRawLog({
            withdrawlogid:this.withdrawlogid
        }).then(res=>{
            this.data=res.data.withdRawLogItems;
            this.isColor=res.data.withdRawLogItems.rechargetype;
        })
    },
    formatTime(val) {
      return format(val, "YYYY-MM-DD HH:mm:ss");
    },
    chageType(val){
        if(val==3){
            return this.$t("putrecord.wechat")
        }
    }
  }
};
</script>
<style lang='less' scoped>
@width75: 75rem;
.de-top{
    padding: 34/@width75 39/@width75 0;
    p{
        font-size: 28/@width75;
        color: rgb(153, 153, 153);
        text-align: center;
    }
    h1{
        font-size: 60/@width75;
        text-align: center;
        margin: 30/@width75 0 60/@width75
    }
    .de-mess{
        display: flex;
        justify-content: space-between;
        font-size: 28/@width75;
        padding-bottom: 34/@width75;
        p{
            color: rgb(153, 153, 153);
        }
    }
}
.de-btn{
    border-top: 20/@width75 solid rgb(240, 240, 240);
    padding: 34/@width75 39/@width75 0;
    p{
        font-size: 32/@width75;
        color: rgb(51, 51, 51)
    }
}
.progress{
    margin-top: 64/@width75;
    .cont{
        position: relative;
        .circle{
            width: 32/@width75;
            height: 32/@width75;
            background: rgb(204, 204, 204);
            border-radius: 16/@width75;
        }
        .text{
            position: absolute;
            top: 0;
            left: 60/@width75;
        }
        p{
            font-size: 28/@width75;
            color: rgb(51, 51, 51);
            margin-bottom: 18/@width75;
        }
        span{
            font-size: 24/@width75;
            color: rgb(153, 153, 153);
        }
        .circleColor{
            background: rgb(53, 186, 182);
        }
    }
    .line{
        width: 3px;
        height: 120/@width75;
        background: rgb(204, 204, 204);
        margin-left: 14/@width75;
    }
    .lineColor{
        background: rgb(53, 186, 182);
    }
}
</style>