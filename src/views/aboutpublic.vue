<template>
    <div class="about-us">
        <img src="../assets/follow.png" alt="">
    </div>
</template>
<script>
import { Cell, Group, XButton, Qrcode, XImg } from "vux";
export default {
  components: {
    Cell,
    Group,
    XButton,
    Qrcode,
    XImg
  },
  methods: {
  }
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.about-us{
	padding: 48/@width75 0 0;
	text-align: center;
	img{
		width: 654/@width75;
	}
}

</style>
