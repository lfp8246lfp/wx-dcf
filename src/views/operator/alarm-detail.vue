<template>
  <div class="alarm-detail">
    <group title="处理状态">
      <radio :selected-label-style="{color: '#FF9900'}" :options="radio001" v-model="selectAlarm.dealstatus"></radio>
    </group>
    <group>
      <calendar v-model="selectAlarm.dealtime" title="处理时间:"></calendar>
    </group>
    <group title="处理内容">

      <x-textarea :max="1000" name="description" placeholder="请输入" :height="150" v-model="selectAlarm.dealresult"></x-textarea>
      <group>
        <x-button @click.native="commit" :gradients="['#1D62F0', '#19D5FD']">提交</x-button>
      </group>
    </group>
  </div>
</template>
<script>
import { Radio, Group, Calendar, XTextarea, XButton } from "vux";
import { mapState, mapGetters, mapActions } from "vuex";
import { format } from "date-fns";
export default {
  components: {
    Radio,
    Group,
    Calendar,
    XTextarea,
    XButton
  },
  mounted() {
    if (
      this.selectAlarmItem.dealstatus == 1 ||
      this.selectAlarmItem.dealstatus == 2
    ) {
      this.selectAlarm.dealstatus = this.selectAlarmItem.dealstatus;
      this.selectAlarm.dealtime = this.formatTime(
        this.selectAlarmItem.dealtime
      );
      this.selectAlarm.dealresult = this.selectAlarmItem.dealresult;
    }
      this.selectList = this.selectAlarmItem;
  },
  computed: {
    ...mapGetters(["selectAlarmItem"])
  },
  data() {
    return {
      radio001: [
        {
          key: "1",
          value: "已处理"
        },
        {
          key: "2",
          value: "未解决"
        }
      ],
      selectAlarm: {
        dealstatus: "1",
        dealtime: this.formatTime(new Date()),
        dealresult: ""
      },
      selectList: {}
    };
  },
  methods: {
    formatTime(val) {
      return format(val, "YYYY-MM-DD");
    },
    commit() {
     
      this.selectList.dealstatus = this.selectAlarm.dealstatus;
      this.selectList.dealtime = this.selectAlarm.dealtime + " " + "00:00:00";
      this.selectList.dealresult = this.selectAlarm.dealresult;

      this.$store
        .dispatch("AC_UpdateDealStatus", {saveitem: [this.selectList] })
        .then(res => {
          if (res.data.returnResult == 1) {
            this.$router.go(-1);
          }
        });
    }
  }
};
</script>
<style lang="less">
</style>


