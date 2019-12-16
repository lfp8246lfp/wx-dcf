<template>
  <div class="equipment">
    <div class="information">
      <div class="detail">
        <p class="one">{{$t("putrecord.software")}}</p>
        <p class="two">{{this.funditem.softversion}}</p>
      </div>
      <div class="detail">
        <p class="one">{{$t("putrecord.hardware")}}</p>
        <p class="two">{{this.funditem.deviceversion}}</p>
      </div>
      <div class="detail">
        <p class="one">{{$t("putrecord.manufacturer")}}</p>
        <p class="two">{{$t("putrecord.commpany")}}</p>
      </div>
      <div class="detail">
        <p class="one">{{$t("putrecord.contactnumber")}}</p>
        <p class="two">400-161-8011</p>
      </div>
    </div>
    <div>
      <img src="../assets/company@2x.png">
    </div>
  </div>
</template>
<script>
var userItem = JSON.parse(localStorage.getItem("userItem"));
export default {
  data() {
    return {
      funditem: ""
    };
  },
  mounted() {
    this.funditem = this.$route.query.funditem;
    console.log(this.funditem);
  }
};
</script>

<style lang="less" scoped>
@width75: 75rem;
.information {
  text-align: center;
  margin-top: 100 / @width75;
  .detail {
    font-size: 28 / @width75;
    margin-top: 120 / @width75;
    .one {
      font-weight: bold;
      color: black;
    }
    .two {
      margin-top: 16 / @width75;
      color: rgb(102, 102, 102);
    }
  }
}
.equipment {
  text-align: center;
  img {
    margin-top: 203 / @width75;
    width: 386 / @width75;
    height: 96 / @width75;
  }
  .content {
    margin-top: 68 / @width75;
    p {
      font-size: 28 / @width75;
      color: rgb(51, 51, 51);
      margin-top: 30 / @width75;
      span {
        color: rgb(102, 102, 102);
      }
    }
  }
}
</style>
