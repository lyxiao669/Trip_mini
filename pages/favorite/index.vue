<template>
	<view class="contailner">
		<template v-for="(item,index) in stationData">
			<view class="stationList">
				<van-swipe-cell right-width="60" @click="onDelete($event,item)">
					<van-cell-group>
						<stationList :data="item" @toDetail="toDetail(item)" :key="index">
						</stationList>
					</van-cell-group>
					<view slot="right" class="van-swipe-cell__right delete_cell">
						<text class="delete_text">删除</text>
					</view>
				</van-swipe-cell>
			</view>
		</template>
	</view>
</template>

<script>
	import stationList from '../../components/stationList/index.vue'
	import {
		getFavorites,deleteFavorites
	} from '@/api/favorite'
	export default {
		components: {
			stationList
		},
		data() {
			return {
				stationData: [],
			}
		},
		methods: {
			// 获取收藏列表
			async getFavorites() {
				const res = await getFavorites()
				this.stationData = res
			},
			// 跳转景区
			toDetail(data) {
				uni.navigateTo({
					url: '/pages/stationDetail/index?id=' + data.spotId
				})
			},
			async onDelete(e,data){
				let res = await deleteFavorites({
					spotId:data.spotId
				})
				if(!res){
					uni.showToast({
						title:'取消收藏'
					})
					this.getFavorites()
				}
				
				// console.log("data::",data)
			}

		},
		onLoad() {

		},
		onShow() {
			this.getFavorites()
		}
	}
</script>

<style lang="scss" scoped>
	.contailner {
		// margin: 30upx;
		min-height: 100vh;
		// background-color: #F5F5F5;
		background-color: #FFF;
	}

	.stationList {
		margin-bottom: 20upx;
		background-color: #FFF;
	}

	.delete_cell {
		height: 100%;
		width: 120upx;
		background-color: red;
		display: flex;
		justify-content: center;
		align-items: center;

		.delete_text {
			color: #FFF;
			font-size: 32upx;
			// text-align: center;
		}
	}
</style>