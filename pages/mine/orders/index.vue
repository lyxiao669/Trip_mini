<template>
	<view class="my-activity">
		<!-- <swiper-tab :tabs="tabs" barColor="#FF692F" activeColor="#FF692F" @change="onChangeTab"></swiper-tab> -->
		<!-- <template v-for="(item,index) in table.list"> -->
		<tabs id="tab" :tabs="tabs" :current="active" @change="onChangeTab"></tabs>

		<div class="list-contailner">
			<template v-for="(item,index) in spotList">
				<view class="card-list">
					<order-card :key="index" :data="item" @getDetail="toDetail(item)" @cancel="doCancel(item.orderId)"></order-card>
				</view>
			</template>
		</div>
		<!-- </template> -->
		<!-- <list :status="table.status" noDataImg='/static/empty-img/blank-list@3x.png' text='暂无数据' @retry='getPageList'> -->
		<!-- </list> -->
	</view>
</template>

<script>
	// import swiperTab from '@/components/swiper-tab'
	import orderCard from '@/components/order-card'
	import tabs from '@/components/tabs'
	import {
		getOrders,cancelOrders
	} from '@/api/orders.js'
	export default {
		components: {
			orderCard,
			tabs,
		},
		data() {
			return {
				tabs: [{
						id: 0,
						text: '全部',
						status: null
					},
					{
						id: 1,
						text: '待出行',
						status: 0,
						color: '#7E6AFF'
					},
					{
						id: 2,
						text: '已完成',
						status: 1,
						color: '#FEA962'
					},
					{
						id: 3,
						text: '已取消',
						status: 2,
						color: '#1D91EE'
					},
				],
				active: 1,
				spotList: []
			};
		},
		computed: {

		},
		methods: {
			// 获取订单列表
			async getOrders(index) {
				let res = await getOrders({
					status: index
				})
				this.spotList = res
				console.log("orders::", res)
			},
			toDetail(e) {
				uni.navigateTo({
					url: '/pages/stationDetail/index?id=' + e.spotId
				})
			},
			//取消报名
			async doCancel(id) {
				uni.showModal({
					title:'提示',
					content:'确认取消行程',
					success:async res=>{
						let cRes = await cancelOrders({
							orderId:id
						})
						
						uni.showToast({
							title:cRes.message
						})
						if(cRes.success){
							this.getOrders(this.active - 1)
						}
						
					}
				})

			},
			// 切换tab
			onChangeTab(index) {
				this.active = index
				let status = index - 1
				this.getOrders(status)
			}
		},
		onLoad(options) {
			let index = Number(options.status)
			this.active = index
			let status = index - 1
			this.getOrders(status)
		},
		onShow() {
			// this.onChangeTab(this.tabIndex==''?'':this.tabIndex)
			// this.resetList()
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;
	}
	.list-contailner{
		padding-top: 90upx;
	}
	.card-list {
		margin-top: 20upx;
	}
</style>