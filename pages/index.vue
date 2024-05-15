<template>
  <view class="content">
    <image class="logo" src="@/static/logo.png"></image>
    <view class="text-area">
      <text class="title">Hello RuoYi</text>
    </view>
  </view>
</template>

<script>
  export default {
    onLoad: function() {
    },
	onShow() {
		uni.getLocation({
			type: 'gcj02',
			success: res => {
				console.log("location::", res)
			},
			fail:fail =>{
				console.log("fail::",fail)
			},
		})
		// this.getDistance()
		// const logStatus = await this.$store.dispatch('user/getUserData')
		// let markers = this.$store.state.system.markers
		// if (this.covers.length < 1 && this.requestCount > 0) {
		// 	this.getServiceStation(this.latitude, this.longitude)
		// }
	
	},
  }
</script>

<style>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .logo {
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
  }

  .text-area {
    display: flex;
    justify-content: center;
  }

  .title {
    font-size: 36rpx;
    color: #8f8f94;
  }
</style>
