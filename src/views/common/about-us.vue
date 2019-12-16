<template>
    <div class="about-us">
        <img src="../../assets/aboutus@2x.png" alt="" class="logo">
		<img src="../../assets/invalidName@2x.png" alt="" class="cont">
		<p>
			{{$t("meterlow.longcont")}}
		</p>
    </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  computed: {},

  mounted() {},

  methods: {}
};
</script>
<style lang="less" scoped>
@width75: 75rem;
.about-us{
	padding-top: 220/@width75;
	.logo{
		width: 225/@width75;
		display: block;
		margin: 0 auto;
	}
	.cont{
		margin: 32/@width75  auto 72/@width75;
		width: 158/@width75;
		display: block;
	}
	p{
		padding: 0 67/@width75;
		font-size: 32/@width75;
		color: #666666;
		text-indent: 2em;
	}
}

</style>
