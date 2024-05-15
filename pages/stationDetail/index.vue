<template>
	<view class="station-detail">
		<!-- <nav-bar useScroll></nav-bar> -->
		<view class="main-img">
			<image :src="spotData.images[0]" @click="clickImg(spotData.images)" mode="aspectFill"
				style="width: 100%;height: 100%;"></image>
		</view>
		<view class="show-station-info">
			<view class="station-info">
				<view class="content">
					<view class="station-title">{{spotData.spotName}}</view>
					<view class="rate-and-date">
						<view class="rate">
							<!-- <rate :value="stationInfo.score" :cutomClass="rateClass" class="rateClass"></rate> -->
							<view class="ticket" v-if="spotData.ticketPrice > 0">
								门票：
								<text class="price">￥{{spotData.ticketPrice}}</text>
							</view>
							<view class="ticket" v-else>
								门票：
								<text class="price">免费</text>
							</view>
						</view>
						<view class="open-date">开放时间：{{spotData.openingHours}}</view>
					</view>
					<view class="bottom-content">
						<view class="left">
							<view class="location">景点地址：{{spotData.address}}</view>
							<view class="phone">服务电话：{{spotData.telephone}}</view>
						</view>
						<view class="right">
							<view class="navigation" @click="toMap">
								<image src="../../static/images/icon/icon_navigation@3x.png"></image>
								<text>导航</text>
								<view class="fill"></view>
							</view>
							<view class="call" @click="doCall">
								<image src="../../static/images/icon/icon_call@3x.png"></image>
								<view>拨打</view>
							</view>
						</view>
					</view>
				</view>
				<view class="scroll-view">
					<scroll-view scroll-x="true" style="height: 128upx;" show-scrollbar="false">
						<image v-for="(img,imgsIndex) in spotData.images" :key="imgsIndex" mode="aspectFill"
							:src="img+'?imageView2/1/w/200/h/200/interlace/1'" @click="clickImg(spotData.images)">
						</image>
					</scroll-view>
				</view>
			</view>
			<view class="conten-box">
				<view class="service-content">
					<view class="title">公告信息</view>
					<view class="feature-service-text" v-if="spotData.notice">
						<u-parse :content="spotData.notice"></u-parse>
					</view>
					<view class="feature-service-text" v-else>
						无
					</view>
				</view>
			</view>
			<view class="service-box conten-box">
				<view class="service-content">
					<view class="title">景点内容</view>
					<view class="module">
						<view class="label" v-for="(content,index) of stationInfo.contents" :key="index">
							<!-- <image :src="content.icon" mode=""></image>
							<view class="text">{{content.text}}</view> -->

						</view>
					</view>
					<u-parse :content="spotData.description"></u-parse>
				</view>
			</view>
<!-- 			<view class="conten-box">
				<view class="service-content">
					<view class="title">特色服务</view>
					<view class="feature-service-text" v-if="spotData.characteristicService">
						{{spotData.characteristicService}}
					</view>
					<view class="feature-service-text" v-else>
						无
					</view>
				</view>
			</view> -->


			<view class="bottom-bar">
				<view class="content">
					<view class="contact" @click="doLike">
						<template v-if="!isLike">
							<image class="contact-icon" src="@/static/images/icon/like.png" mode=""></image>
							<view>收藏</view>
						</template>
						<template v-else>
							<image class="contact-icon" src="@/static/images/icon/liked.png" mode=""></image>
							<view>已收藏</view>
						</template>
					</view>
					<view class="attend">
						<view class="btn-attend" @click="doBuy" v-if="spotData.ticketPrice > 0">购买门票</view>
						<view class="btn-attend btn-block" v-else>免费</view>
					</view>
				</view>
			</view>
			<view class="bottom-fill"></view>
		</view>


	</view>

</template>

<script>
	import uParse from '@/components/u-parse/u-parse.vue'
	import {
		getSpotById,
		addFavorite,
		deleteFavorites,
		isFavorite
	} from '@/api/scenicSpots'

	import {
		createOrder
	} from '@/api/orders'
	export default {
		components: {
			uParse

		},
		data() {
			return {
				spotData: {},
				isLike: null,
			}
		},
		computed: {

		},
		methods: {
			onPageScroll(e) {
				this.scrollTop = e.scrollTop
			},
			//获取服务站详情信信息
			async GetData(id) {
				let res = await getSpotById({
					id: id
				})
				res.images = res.images.split(',')
				this.spotData = res

			},
			//点击图片预览
			clickImg(url) {
				uni.previewImage({
					urls: url,
				})
			},
			// 购买门票
			async doBuy() {
				uni.showModal({
					title: '购买门票',
					content: '购买门票24小时后将默认订单完成，请注意安排出行时间',
					success:async res=> {
						if (res.confirm) {
							this.creatOrder()
						} else{
							
						}
					}
				})
			},
			// 创建订单
			async creatOrder(id){
				let cRes = await createOrder({
					spotId:this.spotData.id
				})
				
				uni.showToast({
					title: cRes.message,
				})
			},
			//点击导航
			toMap(latitude, longitude, name) {
				const params = {
					latitude: this.spotData.latitude,
					longitude: this.spotData.longitude,
					name: this.spotData.spotName
				}
				uni.openLocation(params)
			},
			//打电话
			doCall() {
				uni.makePhoneCall({
					phoneNumber: this.spotData.telephone.toString(),
				})
			},
			// 点击收藏
			async doLike() {
				let res;
				if(this.isLike){
					res = await deleteFavorites({
						spotId: this.spotData.id,
					})
				}else{
					res = await addFavorite({
						spotId: this.spotData.id,
					}); 
				}
				uni.showToast({
					title: res.message,
				})
				this.checkFavorite(this.spotData.id)

			},
			// 检查是否收藏
			async checkFavorite(id) {
				let res = await isFavorite({
					spotId: id
				})
				this.isLike = res
			}
		},
		onLoad(options) {
			let id = options.id
			this.GetData(id);
			this.checkFavorite(id)
		}
	}
</script>

<style lang="scss" scoped>
	scroll-view {
		white-space: nowrap; 
		margin-left: 30upx;
		padding-bottom: 30upx;

		image {
			width: 256upx;
			height: 144upx;
			margin-right: 10upx;
		}
	}

	.main-img {
		width: 100%;
		height: 666upx;
		background-color: #eee;
	}

	.show-station-info {
		background-color: #F7F7F7;
		position: absolute;
		top: 480upx;
		width: 100%;
	}

	.station-info {
		background: #ffffff;
		border-radius: 30upx 30upx 0 0;
		overflow: hidden;

		.station-title {
			font-size: 36rpx;
			color: #333333;
			letter-spacing: -0.86rpx;
			padding-top: 30upx;
			font-weight: 600;
		}

		.rate-and-date {
			display: flex;
			justify-content: space-between;
			margin: 20upx 0;

			.price {
				color: #ee0a24;

			}

			.open-date {
				font-size: 24rpx;
				color: #333333;
			}
		}

		.bottom-content {
			display: flex;
			justify-content: space-between;

			.left {
				.phone {
					margin-top: 10upx;
				}
			}

			.right {
				display: flex;

				image {
					width: 48upx;
					height: 48upx;
				}

				.navigation,
				.call {
					display: flex;
					flex-direction: column;
					align-items: center;
					margin: 10upx 0;
					font-size: 20rpx;
					color: #999999;
				}

				.call {
					padding-left: 15upx;
				}

				.navigation {
					padding: 0 34upx;

					position: relative;

					.fill {
						position: absolute;
						width: 100upx;
						height: 58upx;
						top: 50%;
						transform: translate(0, -50%);
						border-left: 2upx solid #EFEFEF;
						border-right: 2upx solid #EFEFEF;
					}
				}
			}
		}
	}

	.content {
		margin: 0 30upx;
	}

	.service-box,
	.conten-box {
		margin: 0;
		margin: 20upx 0;
		background-color: #FFFFFF;
	}

	.service-content {
		padding: 30upx;


		.title {
			font-size: 28rpx;
			color: #333333;
			font-weight: 500;
			margin-bottom: 30upx;
		}

		.module {
			display: grid;
			grid-template-columns: 25% 25% 25% 25%;
			grid-row-gap: 30upx;
			text-align: center;
			font-size: 24rpx;
			color: #333333;

			image {
				width: 70rpx;
				height: 70rpx;
			}
		}
	}

	.feature-service-text {
		font-size: 30rpx;
		color: #666666;
		letter-spacing: 2rpx;
		margin-top: 20upx;
	}

	.new-activity {
		.activity-card {
			padding-bottom: 30upx;
		}

		.activity-card:last-child {
			padding-bottom: 0upx;
		}

		.new-activity-list {
			padding: 0;
			border-bottom: 2upx solid #EFEFEF;
		}

		.more {
			margin-top: 30upx;
			text-align: center;

			image {
				width: 32upx;
				height: 32upx;
				display: inline-block;
				vertical-align: middle;
			}

			.text {
				font-size: 28rpx;
				color: #999999;
				vertical-align: middle;
			}
		}
	}

	.comment-box {
		position: relative;
		padding-bottom: 220upx;

		.title {
			display: flex;
			justify-content: space-between;
		}

		.title-text {
			.number {
				color: #999999;
			}
		}

		.all-comment {
			color: #FF692F;

			.right-arrow {
				width: 14upx;
				height: 14upx;
				vertical-align: middle;
				color: #FF692F;
			}

			.label {
				vertical-align: middle;
			}
		}

		.want-evaluate {
			display: flex;
			justify-content: center;
			position: absolute;
			left: 50%;
			transform: translate(-50%, -50%);
			bottom: 0;

			text {
				width: 470upx;
				height: 88upx;
				color: #FFFFFF;
				background-color: #FF4136;
				text-align: center;
				line-height: 88upx;
				border-radius: 44px;
				box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.1);
			}
		}
	}

	.comment-tag {

		// margin-top: 20upx;
		text {
			margin-top: 10upx;
			display: inline-block;
			font-size: 24rpx;
			color: #666666;
			letter-spacing: -0.58rpx;
			padding: 12upx 20upx;
			background: #F4F4F4;
			border-radius: 28rpx;
			margin-right: 20upx;
		}
	}

	.comment-content-box {
		display: flex;
		margin: 40upx 0;

		.avatar {
			image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 10rpx;
			}
		}
	}

	.comment-content {
		margin-left: 20upx;

		image {
			width: 190rpx;
			height: 190rpx;
			margin-right: 10upx;
		}

		.label {
			margin: 20upx 0;
		}

		.rate-and-date {
			height: 80rpx;
			display: flex;
			flex-direction: column;

			.userName {
				font-size: 28rpx;
				color: #0856B1;
				letter-spacing: -0.68rpx;
			}

			.rate {
				display: flex;
				justify-content: space-between;

			}

			.date {
				font-size: 28rpx;
				color: #999999;
				letter-spacing: -0.68rpx;
			}
		}
	}

	.bottom-bar {
		width: 100%;
		height: 120upx;
		background-color: #ffffff;
		box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.10);
		position: fixed;
		bottom: 0;

		.content {
			display: flex;
			justify-content: space-around;
			text-align: center;
			margin: 0 30upx;
		}

		.contact {
			font-size: 20rpx;
			color: #999999;
			letter-spacing: -0.48rpx;
			margin: 30upx 0 30upx 0upx;

			image {
				width: 50upx;
				height: 50upx;
			}


		}

		.attend {
			padding: 20upx 0upx 20upx 30upx;

			.btn-attend {
				width: 538upx;
				height: 88upx;
				line-height: 88upx;
				font-size: 30rpx;
				color: #FFFFFF;
				border-radius: 44rpx;
				background-color: #FF4136;
				position: relative;
			}

			.btn-block {
				color: #FFFFFF;
				background-color: #999999;
			}
		}

		.attend::before {
			content: '';
			width: 2upx;
			height: 48upx;
			border-left: 2upx solid #EFEFEF;
			float: left;
			margin-top: 20upx;
			position: relative;
			right: 30upx;
		}

	}

	.bottom-fill {
		background-color: #ffffff;
		padding-top: 130upx;
	}
</style>