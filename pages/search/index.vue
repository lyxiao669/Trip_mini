<template>
	<view class="contailner">
		<view class="search-bar">
			<search label="搜索景点" @doSearch="doSearch"></search>
		</view>
		<view class="history">
			<view class="bar">
				<text class="history-search">历史搜索</text>
				<image class="del-icon" src="@/static/images/icon/icon_del@3x.png" @click="clean"></image>
			</view>
			<view class="history-list">
				<text class="history-text" v-for="(item,index) of historyData" :key="index" @click="doSearch(item)">{{item}}</text>
			</view>
		</view>
		<view class="nearby-station">
			<view class="bar">
				<text class="nearby-station-title">搜索结果</text>
				<!-- <text class="more" @click="toMore">查看更多</text> -->
			</view>
			<view class="stationList">
				<template v-for="(item,index) in stationData">
					<stationList :data="item" @toDetail="toDetail(item)" :key="index">
					</stationList>
				</template>
			</view>
			<!-- <list></list> -->
		</view>
	</view>
</template>

<script>

	import search from '../../components/search/index.vue'
	import stationList from '../../components/stationList/index.vue'
	import {
		getSpotList
	} from '@/api/scenicSpots'
	export default {
		components: {
			search,
			stationList
		},
		data() {
			return {
				historyData: [],
				table: {
					list: []
				},
				stationData: [],
			}
		},
		methods: {
			//点击搜索
			doSearch(val) {
				// 检查是否重复
				let noRepeat = this.historyData.find(function(value,index,arr){
					return value == val
				})
				// 加入历史记录
				if(!noRepeat&&val!=''){
					this.historyData.unshift(val)
				}
				// uni.navigateTo({
				// 	url: '../station/station?keyword=' + val
				// })
				
				this.getSpots(val,"")
			},
			// 获取景区列表
			async getSpots(keyword, city) {
				const spotData = await getSpotList(keyword, city)
				this.stationData = spotData.data
			},
			// 跳转景区
			toDetail(data) {
				// console.log("Id::", id)
				uni.navigateTo({
					url: '/pages/stationDetail/index?id=' + data.id
				})
			},
			//清除历史记录
			clean(){
				this.historyData = [] 
			},

		},
		onLoad() {

		}
	}
</script>

<style lang="scss" scoped>
	.contailner {
		padding: 30upx;
		min-height: 100vh;
		// background-color: #F5F5F5;
		background-color: #FFF;
	}

	.search-bar {
		// margin: 20upx 30upx 0 30upx;
	}

	.history {
		margin: 30upx 0 20upx 0;

		.history-search {
			display: inline-block;
			vertical-align: middle;
			font-size: 28rpx;
			color: #333333;
			font-weight: 600;
		}

		.del-icon {
			width: 40upx;
			height: 40upx;
			vertical-align: middle;
			float: right;
		}

		.history-list {
			margin-top: 20upx;

			.history-text {
				display: inline-block;
				padding: 10upx 20upx;
				font-size: 26rpx;
				color: #666666;
				background: #F5F5F5;
				border-radius: 37rpx;
				margin: 0 20upx 20upx 0;
			}
		}
	}

	.nearby-station {
		margin-top: 110upx;

		.bar {
			display: flex;
			justify-content: space-between;

			.more {
				color: #5e5e5e;
				font-size: 28upx;
			}
		}

		.nearby-station-title {
			font-size: 28upx;
			color: #333333;
			font-weight: 600;
		}

		.stationList {
			margin: 20upx 0;
		}
	}
</style>
