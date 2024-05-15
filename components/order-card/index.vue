<template>
	<view class="activity-card">
		<view class="top-status">
			<text class="date">{{data.orderDate}}</text>
			<text v-if="data.status==0" class="status">待出行</text>
			<text v-if="data.status==1" class="status no-started">已完成</text>
			<text v-if="data.status==2" class="status on">已取消</text>
		</view>
		<view class="content">
			<view class="left">
				<image :src="images[0]" mode=""></image>
			</view>
			<view class="right">
				<view class="title">{{data.spotName}}</view>
				<!-- <view class="date">活动开始时间：{{data.orderDate}}</view> -->
				<view class="date">订单在24小时后自动完成，请注意安排出行时间</view>
			</view>
		</view>
		<view class="opretor">
			<view v-if="data.status==0" class="button" @click="cancel">取消行程</view>
			<view class="toDetail button" @click="toDetail">查看详情</view>

		</view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		props: {
			data: {
				type: Object,
				default: {
					orderId: 0,
					orderDate: '',
					status: 0,
					userId: 0,
					userName: '',
					avatar: '',
					spotName: '',
					provinceName: '',
					cityName: '',
					likes: 0,
					description: '',
					ticketPrice: 0,
					latitude: 0,
					longitude: 0,
					images: '',
					address: '',
					telephone: '',
					openingHours: ''
				}
			}
		},
		computed:{
			images(){
				return this.$props.data.images.split(',')
			}
		},
		methods: {
			toDetail() {
				// console.log(this.data)
				this.$emit('getDetail', this.data.activitysId)
			},
			cancel() {
				this.$emit('cancel', this.data.activitysId)
			},
		},
		onLoad() {
		},
		mounted() {
			// this.$props.data.images = this.$props.data.images.split(',')
			// console.log("this.$props.data::",this.$props.data)
		}
	}
</script>

<style lang="scss" scoped>
	.activity-card {
		padding: 0 30upx;
		background-color: #FFFFFF;
	}

	.top-status {
		display: flex;
		justify-content: space-between;
		font-size: 28upx;
		color: #999999;
		height: 82upx;
		line-height: 82upx;

		.status {
			color: #FF4136;
		}

		.no-started {
			color: #8D8D8D;
		}

		.on {
			color: #00BF6E;
		}

		.end {
			color: #8D8D8D;
		}
	}

	.content {
		display: flex;
		padding: 20upx 0;
		border-top: 2upx #EFEFEF solid;
		border-bottom: 2upx #EFEFEF solid;

		.left {
			width: 140upx;
			height: 140upx;

			image {
				width: 140upx;
				height: 140upx;
				border-radius: 10px;
			}
		}

		.right {
			margin-left: 20upx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.title {
				color: #333333;
				font-size: 28upx;
			}

			.date {
				font-size: 24upx;
				color: #999999;
			}
		}
	}

	.opretor {
		padding: 20upx 0;
		display: flex;
		justify-content: flex-end;

		.button {
			margin-left: 20upx;
			color: #666666;
			border: 2px solid #979DA6;
			width: 152upx;
			height: 58upx;
			line-height: 58upx;
			text-align: center;
			border-radius: 29px;
		}

		.toDetail {
			color: #FF4136;
			border: 2px solid #FF4136;
		}
	}
</style>