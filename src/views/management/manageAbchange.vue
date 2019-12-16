<!-- 异常告警改变     -->
<template>
  <div class="abchange">
    <group :title="$t('abchange.processingstate')" class="processtate">
      <radio :options="radio" @on-change="change" v-model="value"></radio>
    </group>
    <group :title="$t('abchange.processingtime')" class="processtime processtate">
      <datetime v-model="dealtime" @on-confirm="changetime"></datetime>
    </group>
    <group :title="$t('abchange.processingcontents')" class="processtate processcont">
      <x-textarea :max="1000" name="detail" :placeholder="$t('abchange.input')" :height="224" v-model="dealresult"></x-textarea>
    </group>
    <x-button @click.native="sub" class="abchange-btn">{{$t("abchange.submission")}}</x-button>
  </div>
</template>

<script>
import { Radio, Group, Datetime, XTextarea, XButton } from "vux";
import api from "../../api/Piles.js";
import { format } from "date-fns";
var id = JSON.parse(localStorage.getItem("operatorUserItem")).accountid;
export default {
  data() {
    return {
      radio: [ //单选
        {
          key  : 1,
          value: this.$t("ab.processed")
        },
        {
          key  : 2,
          value: this.$t("ab.unsolved")
        }
      ],
      dealtime  : this.formatTime(new Date()),   //处理时间
      handlesub : "",                            //传递的参数
      eventObj  : "",                            //传递过来的对象
      dealstatus: 0,                             //处理状态
      dealresult: "",                            //处理结果
      value     : 0                              //处理状态默认值
    };
  },

  components: {
    Radio,
    Group,
    Datetime,
    XTextarea,
    XButton
  },

  computed: {},

  mounted() {
    this.eventObj = this.$route.query.eventObj;

    if (this.eventObj.dealresult != null) {
      this.dealresult = this.eventObj.dealresult;
    }
    // if(this.eventObj.dealtime!=null){
    //     this.dealtime=this.formatTime(this.eventObj.dealtime);
    //     console.log( this.dealtime)
    //   }
    this.$nextTick(() => {
      if (this.eventObj.dealtime != null) {
        this.dealtime = this.formatTime(this.eventObj.dealtime);
        console.log(this.dealtime);
      }
    });
    this.value = this.eventObj.dealstatus;
  },

  methods: {
    // 日期格式化
    formatTime(val) {
      return format(val, "YYYY-MM-DD");
    },
    // 处理状态选择
    change(value) {
      this.dealstatus = value;
    },
    // 处理时间改变
    changetime(value) {
      this.dealtime = value;
    },
    // 提交
    sub() {
      api
        .GetAlarmStatus({
          saveitem: [
            {
              rtuid      : this.eventObj.rtuid,
              eventtime  : this.eventObj.eventtime,
              eventitemid: this.eventObj.eventitemid,
              eventdata  : this.eventObj.eventdata,
              dealstatus : this.dealstatus,
              dealtime   : this.dealtime + " 00:00:00",
              dealresult : this.dealresult,
              eventnote  : id
            }
          ]
        })
        .then(res => {
          console.log(res.msg);
          if (res.msg == "success") {
            this.$router.back(-1);
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.weui-btn {
  width        : 674 / @width75;
  height       : 88 / @width75;
  text-align   : center;
  line-height  : 88 / @width75;
  background   : #35bab9;
  color        : #fff;
  border-radius: 44 / @width75;
  margin-top   : 10 / @width75;
  font-size    : 36 / @width75 !important;
}
</style>
<style lang='less'>
@width75: 75rem;
.processtate {
  .weui-cells__title {
    height      : 68 / @width75;
    line-height : 68 / @width75;
    padding-left: 38 / @width75;
    margin      : 0;
    font-size   : 28 / @width75;
    border-top  : 1px solid #eeeeee;
  }
  .weui-cell {
    padding  : 24 / @width75 38 / @width75;
    font-size: 28 / @width75;
    color    : #000;
  }
}
.processtime {
  .weui-cell__ft {
    text-align: left;
  }
  .vux-cell-value {
    font-size: 32 / @width75;
    color    : #000;
  }
  .weui-cell_access .weui-cell__ft:after {
    width : 14 / @width75;
    height: 14 / @width75;
  }
}
.processcont {
  .weui-cells:after {
    display: none;
  }
}
</style>
