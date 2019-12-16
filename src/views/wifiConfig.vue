<template>
  <div class="wifi">
    <div class="img">
      <p>WIFI连接配置5步骤</p>
    </div>
    <div class="content">
      <div class="left">
        <div class="line"></div>
        <div class="position"></div>
        <div class="block">1</div>
      </div>
      <div class="right">
        <p>打开设备电源</p>
      </div>
    </div>
    <!-- <div class="content">
      <div class="left">
        <div class="linea"></div>
        <div class="position"></div>
        <div class="block">2</div>
      </div>
      <div class="right">
        <p>长按按键3秒以上，页面显示“F1"</p>
      </div>
    </div>-->
    <div class="content">
      <div class="left">
        <div class="linea"></div>
        <div class="position"></div>
        <div class="block">2</div>
      </div>
      <div class="right">
        <p>按键5秒以上，显示“AP on”，指示灯快速闪烁</p>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="lineb"></div>
        <div class="position"></div>
        <div class="block">3</div>
      </div>
      <div class="right">
        <p>点“WiFi连接配置”</p>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="linec"></div>
        <div class="position"></div>
        <div class="block">4</div>
      </div>
      <div class="right">
        <p>输入WiFi密码，点击连接</p>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="lined"></div>
        <div class="position"></div>
        <div class="block">5</div>
      </div>
      <div class="right">
        <p>配置成功后，屏幕显示“SUCC”</p>
      </div>
    </div>
    <div class="guide">
      <div class="guideTop">指示灯</div>
      <div class="guideBottom">功能键</div>
    </div>

    <div class="btn_wrap">
      <x-button type="primary" class="set" @click.native="wificonfig">WIFI连接配置</x-button>
    </div>
  </div>
</template>
<script>
import wx from "weixin-js-sdk";
import { format } from "date-fns";
import { mapState, mapGetters } from "vuex";
import "@/tools/filter/filter.js";
import { timeDif, formatDate } from "@/tools/commonJs/common";
import wechat from "@/tools/wechat";
import { XButton, XHr, Divider, FlexboxItem, Flexbox } from "vux";
export default {
  components: {
    XButton,
    XHr,
    Divider,
    FlexboxItem,
    Flexbox
  },
  data() {
    return {
      code: ""
    };
  },
  methods: {
    // wifi链接配置
    wificonfig() {
      // wechat.configWXDeviceWiFi();
      wx.invoke('configWXDeviceWiFi', function (res) {
          if(res.err_msg=='configWXDeviceWiFi:ok'){
            this.$vux.toast.text("配置成功",'middle')
          }else{
            this.$vux.toast.text("配置失败",'middle')
          }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.wifi {
  .img {
    background: url(../assets/wificonnect@2x.png);
    margin: 28 / @width75 0 0 39 / @width75;
    background-size: 398 / @width75 80 / @width75;
    width: 398 / @width75;
    height: 80 / @width75;
    line-height: 80 / @width75;
    p {
      margin-left: 107 / @width75;
      font-size: 26 / @width75;
      color: white;
    }
  }
  .content {
    display: flex;
    overflow: hidden;
    height: 82 / @width75;
    margin-top: 24 / @width75;
    .left {
      width: 108 / @width75;
      height: 82 / @width75;
      line-height: 82 / @width75;
      .position {
        height: 23 / @width75;
      }
      .line {
        background: url(../assets/wifiline@2x.png);
        background-size: 62 / @width75 4 / @width75;
        width: 4 / @width75;
        height: 62 / @width75;
        position: absolute;
        left: 76 / @width75;
        top: 90 / @width75;
      }
      .linea {
        background: url(../assets/wifiline@2x.png);
        background-size: 62 / @width75 4 / @width75;
        width: 4 / @width75;
        height: 62 / @width75;
        position: absolute;
        left: 76 / @width75;
        top: 195 / @width75;
      }
      .lineb {
        background: url(../assets/wifiline@2x.png);
        background-size: 62 / @width75 4 / @width75;
        width: 4 / @width75;
        height: 62 / @width75;
        position: absolute;
        left: 76 / @width75;
        top: 300 / @width75;
      }
      .linec {
        background: url(../assets/wifiline@2x.png);
        background-size: 62 / @width75 4 / @width75;
        width: 4 / @width75;
        height: 62 / @width75;
        position: absolute;
        left: 76 / @width75;
        top: 405 / @width75;
      }
      .lined {
        background: url(../assets/wifiline@2x.png);
        background-size: 62 / @width75 4 / @width75;
        width: 4 / @width75;
        height: 62 / @width75;
        position: absolute;
        left: 76 / @width75;
        top: 515 / @width75;
      }
      .linee {
        background: url(../assets/wifiline@2x.png);
        background-size: 62 / @width75 4 / @width75;
        width: 4 / @width75;
        height: 62 / @width75;
        position: absolute;
        left: 76 / @width75;
        top: 620 / @width75;
      }
      .block {
        border-radius: 36 / @width75;
        margin-left: 60 / @width75;
        height: 36 / @width75;
        width: 36 / @width75;
        line-height: 36 / @width75;
        background: rgb(53, 186, 182);
        font-size: 26 / @width75;
        color: white;
        text-align: center;
      }
    }
    .right {
      background: url(../assets/wifi812@2x.png);
      background-size: 573 / @width75 82 / @width75;
      width: 573 / @width75;
      height: 82 / @width75;
      line-height: 82 / @width75;
      p {
        margin-left: 39 / @width75;
        font-size: 26 / @width75;
        color: rgb(51, 51, 51);
      }
    }
  }
  .guide {
    margin: 54 / @width75 0 0 0;
    background: url(../assets/23@2x.png) no-repeat;
    background-position: center center;
    background-size: 454 / @width75 253 / @width75;
    width: 750 / @width75;
    height: 253 / @width75;
    text-align: right;
    .guideTop {
      padding-right: 55 / @width75;
      font-size: 27 / @width75;
      font-weight: bold;
      color: rgb(53, 186, 182);
      padding-top: 56 / @width75;
    }
    .guideBottom {
      padding-right: 55 / @width75;
      font-size: 27 / @width75;
      font-weight: bold;
      color: rgb(53, 186, 182);
      padding-top: 82 / @width75;
    }
  }
  .btn_wrap {
    width: 100%;
    position: fixed;
    bottom: 0;
    .set {
      height: 88 / @width75;
      background: rgb(53, 186, 182);
    }
  }
}
</style>
