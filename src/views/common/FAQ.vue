<template>
    <div class="FAQ">
		<div class="question-area">
			<div class="question-area-top">
				已经付了钱，设备却没有供电。
			</div>
			<div class="question-area-bottom">
				 请仔细检查，充电器插头是否与插座正确连接。
			</div>
		</div>
		<div class="question-area">
			<div class="question-area-top">
				怎么时间没到就停止充电了呢？
			</div>
			<div class="question-area-bottom">
				 因为系统会定时自动检测电池电量情况，当电量满的时候，设备会自动停止供电，这样可以防止过充等安全隐患，达到节能环保目的。
			</div>
		</div>
		<div class="question-area">
			<div class="question-area-top">
				插座拔出了，怎么就断电了呢？
			</div>
			<div class="question-area-bottom">
				 设备自动检测充电器是否拔出状态,如果2分钟内将插头插回可以继续充电，超过两分钟认定为充电结束，插座将会断电。
			</div>
		</div>

    </div>
</template>

<style lang="less" scoped>
@width75: 75rem;
.FAQ {
  padding-top: 20 / @width75;
  .question-area {
    padding-top: 30 / @width75;
    padding-bottom: 30 / @width75;
    border-radius: 5 / @width75;
    width: 710 / @width75;
    margin: 0 auto;
    overflow: hidden;
    background: #ffffff;
    margin-bottom: 20 / @width75;
    .question-area-top {
      line-height: 44 / @width75;
      padding-right: 24 / @width75;
      padding-left: 102 / @width75;
      font-size: 28 / @width75;
      color: #000000;
      background: url(../../assets/icon/Section/question@2x.png) no-repeat 20 /
        @width75 center;
      background-size: 42 / @width75 42 / @width75;
      margin-bottom: 24 / @width75;
      letter-spacing: 2 / @width75;
    }
    .question-area-bottom {
      padding-right: 24 / @width75;
      line-height: 44 / @width75;
      padding-left: 102 / @width75;
      font-size: 28 / @width75;
      color: #666666;
      background: url(../../assets/icon/Section/Answer@2x.png) no-repeat 20 /
        @width75 top;
      background-size: 42 / @width75 42 / @width75;
      letter-spacing: 2 / @width75;
    }
  }
}
</style>


