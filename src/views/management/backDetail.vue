<template>
  <div class="backdetail">
    <div class="box">
      <div class="list">
        <h1>{{$t("feedback.me")}}</h1>
        <p class="time">{{formatTime(data.createtime)}}</p>
        <p class="cnt">{{data.commentbody}}</p>
        <div class="imgs">
          <div v-for="(imgs,index ) in data.imgpath " :key="index">
            <img :src="imgs" alt>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
export default {
  data() {
    return {
      data: {}
    };
  },
  mounted() {
    this.data = JSON.parse(this.$route.query);
    // console.log(this.data);
  },
  components: {},
  methods: {
      // 日期格式化
    formatTime(val) {
      return format(val, "MM-DD HH:MM:ss");
    },
  }
};
</script>

<style lang="less" scoped>
@width75: 75rem;
.backdetail {
  padding: 0 39 / @width75;
  .list {
    padding: 29 / @width75 0 0;
    h1 {
      font-size: 30 / @width75;
      font-weight: bold;
    }
    .time {
      font-size: 24 / @width75;
      color: rgb(153, 153, 153);
      margin: 10 / @width75 0 19 / @width75;
    }
    .cnt {
      font-size: 28 / @width75;
      color: rgb(51, 51, 51);
      line-height: 32 / @width75;
      margin-bottom: 30 / @width75;
    }
    .imgs {
      display: flex;
      justify-content: start;
    }
    img {
      width: 140 / @width75;
      height: 140 / @width75;
      margin: 0 33 / @width75 0 0;
    }
  }
}
</style>

