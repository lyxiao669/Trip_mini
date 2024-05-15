<template>
	<view class="contailner">
		<view class="station-list" @click="toDetail">
			<view class="left">
				<image :src="images[0]" mode=""></image>
				<!-- <view v-if="data.isHaveActivity" class="activityTag">活动</view> -->
			</view>
			<view class="mid">
				<view class="title">
					<text class="title-text">{{data.spotName}}</text>
					<text class="title-text loading" v-if="!data.spotName">加载中...</text>
					<view class="tag">
						<slot name="label">
							<text class="tag-label">人气：{{data.likes}}</text>
						</slot>
					</view>
<!-- 					<text class="rate" v-if="data.likes">
						{{data.likes}}分
					</text> -->
					
				</view>
				<view v-if="data.openingHours" class="open-date">
					开放时间：{{data.openingHours}}
					<!-- <text class="distance">
						{{Math.round(data.distance/1000)}}km
					</text> -->
					
				</view>
				<view class="phone" v-if="data.telephone">服务电话：{{data.telephone}}</view>
				<view class="fill"></view>
				<view class="tag">
					<!-- <slot name="label"> -->
						<!-- <template v-for="(tag,index) in data.contents">
							<text class="tag-label" v-if="index<4" :key="tag.id">{{tag.text}}</text>
						</template> -->
						<text>{{data.address}}</text>
					<!-- </slot> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "stationList",
		props: {
			distance: {
				type: Number,
				default: 0
			},
			data: {
				type: Object,
				default: () => {
					return {
						id: 0,
						spotName: '',
						provinceName: '',
						cityName: '',
						description: '',
						ticketPrice: 0,
						latitude: 0,
						longitude: 0,
						images: '',
						likes: 0,
						address: '',
						telephone: '',
						openingHours: ''
					}
				}
			}
		},
		data() {
			return {
				contentTag: []
			};
		},
		computed:{
			images(){
				return this.$props.data.images.split(',')
			}
		},
		methods: {
			toDetail() {
				this.$emit('toDetail', this.$props.data.id)
			}
		},
		mounted() {
			// this.data.images = this.data.images.split(',')
			// console.log("data::",this.data)
			// this.contentTag = JSON.parse(this.stationData.contentJson)
		},
		watch: {
			stationData(val) {
				// this.contentTag = JSON.parse(this.stationData.contentJson)
				// console.log('contentTag',this.contentTag)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.contailner{
	}
	.station-list {
		// height: 240rpx;
		background: #F7F7F7;
		border-radius: 10rpx;
		// margin-bottom: 20upx; 
		display: flex;
		padding: 30upx;

		.left {
			width: 200upx;
			height: 200upx;
			// margin: 0 20upx;
			margin-right: 20upx;
			background-color: gray;
			border-radius: 10upx;
			position: relative;
			flex-shrink: 1;

			image {
				width: 200upx;
				height: 100%;
				border-radius: 10upx;
			}

			.activityTag {
				position: absolute;
				top: 0;
				color: #FFFFFF;
				font-size: 20rpx;
				text-align: center;
				width: 72upx;
				height: 32upx;
				line-height: 32upx;
				margin: 10upx;
				background-image: linear-gradient(113deg, #FF3425 31%, #FFBC17 100%);
				border-radius: 4px;
			}
		}

		.mid {
			display: flex;
			flex-direction: column;
			flex-grow: 1;

			.title {
				display: flex;
				justify-content: space-between;

				.loading {
					color: #d1d1d1;
					align-items: flex-start;
				}

				.title-text {
					flex: .8;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box; //作为弹性伸缩盒子模型显示。
					-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
					-webkit-line-clamp: 1; //显示的行
				}

				font-size: 32rpx;
				color: #333333;
				font-weight: 600;
				letter-spacing: -0.78rpx;
				// margin-top: 20upx;

				.rate {
					font-size: 32rpx;
					color: #FF2C1D;
					float: right;
					margin-right: 20upx;
				}
			}

			.open-date,
			.phone {
				font-size: 22rpx;
				color: #999999;
				margin: 10upx 0;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box; //作为弹性伸缩盒子模型显示。
				-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
				-webkit-line-clamp: 1; //显示的行
				.distance {
					float: right;
					margin-right: 20upx;
				}
			}

			.fill {
				flex-grow: 1;
			}

			.tag {
				// margin-bottom: 20upx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box; //作为弹性伸缩盒子模型显示。
				-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
				-webkit-line-clamp: 1; //显示的行
			}

			.tag-label {
				font-size: 20rpx;
				color: #FF8252;
				padding: 4upx 10upx;
				background-color: #ffffff;
				border-radius: 4rpx;
				margin-right: 10upx;
			}
		}

	}
</style>