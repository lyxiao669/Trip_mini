<template>
	<view class="container">
		<van-nav-bar title="首页" bind:click-left="onClickLeft" bind:click-right="onClickRight">
			<template slot="left">
				<div @click="showArea">
					<text>{{locationCity}}</text>
					<van-icon name="arrow-down" />
				</div>
			</template>
		</van-nav-bar>

		<van-area v-show="isShowArea" :area-list="areaList" columns-num="2" title="选择城市" @confirm="onChangeArea"
			@cancel="showArea" />

		<view class="map">
			<map show-location @markertap="chooseMarker" @bindpoitap="doTouchPoi" :latitude="latitude"
				:longitude="longitude" :markers="covers">
			</map>
			<image class="weather" src="/static/icons/icon_weather@3x.png" mode="" @click="toWeatherApp"></image>
		</view>
		<view class="station" :style="{top: scrollerHeight,transition:animetion}" ref="station">
			<view class="content">
				<view class="slider-content" @touchstart="doTouchStart" @touchmove.stop="doTouchMove"
					@touchend.stop="doTouchLeave">
					<view class="touchBar"></view>
					<view class="searchBar">
						<search @toSearch="toSearch"></search>
					</view>
				</view>

				<van-divider contentPosition="center"
					customStyle="color: #1989fa; border-color: #1989fa; font-size: 18upx;">
					热门推荐
				</van-divider>
				<view class="page-section-spacing">
					<view class="list">
						<template v-for="(item,index) in stationData">
							<stationList :data="item" @toDetail="toDetail(item)" :key="index">
							</stationList>
						</template>
					</view>
					<list :status="table.status" noDataImg='/static/empty-img/blank-list@3x.png' text='暂无数据'
						@retry='getPageList'></list>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import search from '../../components/search/index.vue'
	import stationList from '../../components/stationList/index.vue'
	import ListPage from '../../lib/class/createList.js';
	import VanArea from '../../wxcomponents/vant/area/index.js'
	import {
		getSpotList
	} from '@/api/scenicSpots'
	// import citys from '../../lib/city.json'
	import {
		areaList
	} from '../../lib/citys.js';
	var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
	var qqmapsdk;
	const THRES_HOLDER = 200 // 滑动阈值，超过则窗口固定在下，小于固定在上
	const TOP_HOLDER = 100 //窗口距离顶部的距离(窗口在屏幕上方)
	const BOTTOM_HOLDER = 350 //窗口距离顶部的距离(窗口在屏幕下方)

	export default {
		components: {
			stationList,
			search,
			VanArea
		},
		data() {
			return {
				areaList,
				isShowArea: false,
				stationData: [],
				stationList: [],
				table: {
					list: []
				},
				distance: '',
				scrollerHeight: '55%',
				animetion: '0.5s',
				diffHeightAbs: '',
				diffHeight: '',
				latitude: 0,
				longitude: 0,
				requestCount: 0,
				covers: [],
				marked: null,
				touchStartTime: 0,
				heigthNow: 0,
				locationCity: '获取位置',

			}
		},
		computed: {

		},

		methods: {
			// 点击展开地址
			showArea() {
				this.isShowArea = !this.isShowArea
			},
			// 确定修改地址
			onChangeArea(val) {
				// console.log("val::", val)
				const city = val.detail.values[1].name
				this.locationCity = city
				this.showArea()
				this.getSpots("", city)
			},
			// 获取景区列表
			async getSpots(keyword, city) {
				const spotData = await getSpotList(keyword, city)
				this.stationData = spotData.data

				console.log("this.stationData", this.stationData)
			},
			//点击标记点
			async chooseMarker(e) {
				let markerId = e.detail.markerId
				let p = this.$store.state.system.position

				const oldCover = this.covers.find(item => item.id == this.marked)
				const newCover = this.covers.find(item => item.id == markerId)
				oldCover.width = 44
				oldCover.height = 44
				this.marked = markerId
				let station = await GetServiceStationAjax({
					Id: markerId,
					Latitude: p.latitude,
					Longitude: p.longitude,

				})
				this.stationData = station.data[0]
				// setIsHavaActivity.call(this,[this.stationData.id], station.data)

				setContents.call(this, [this.stationData.id], station.data)
				newCover.label.content = station.data[0].stationName
			},


			//获取服务站
			async getServiceStation(latitude, longitude) {
				const stationRes = await GetServiceStationAjax({
					Latitude: latitude,
					Longitude: longitude,
					PageSize: 999,
					min: 0,
					max: 0
				})
				let res = stationRes.data
				this.$store.commit('system/updatepCacheStations', res)
				// res.sort(function(a, b) {
				// 	return a.distance - b.distance
				// })

				this.stationData = stationRes.data[0]
				this.stationList = stationRes.data.slice(1, 10)

				let listId = this.stationList.map(item => {
					return item.id
				})

				setIsHavaActivity.call(this, [this.stationData.id], res)
				setContents.call(this, [this.stationData.id], res)

				for (let i of res) {
					let marker = {
						id: i.id,
						latitude: i.latitude,
						longitude: i.longitude,
						iconPath: '/static/icons/icon_location-select@3x.png',
						width: 44,
						height: 44,
						title: i.stationName
					}
					this.covers.push(marker)

				}
				this.$store.commit('system/updatepMarkers', this.covers)
				let firstMarker = this.covers.find(item => item.id == stationRes.data[0].id)
				this.marked = firstMarker.id
				// firstMarker.width = 64
				// firstMarker.height = 64
				// firstMarker.label.color = '#A42C25'
				// firstMarker.label.content = stationRes.data[0].stationName
			},
			//获取当前位置信息
			async getDistance() {
				uni.getLocation({
					type: 'gcj02',
					success: async res => {
						//逆地址解析  坐标转地址信息
						qqmapsdk.reverseGeocoder({
							location: {
								latitude: await res.latitude,
								longitude: await res.longitude
							},
							success: cityRes => {
								const city = cityRes.result.ad_info.city
								this.locationCity = cityRes.result.ad_info.city
								this.getSpots("", city)
							},
							fail: function(error) {
								console.error(error);
							}
						});

						this.latitude = res.latitude
						this.longitude = res.longitude
						let position = {
							latitude: res.latitude,
							longitude: res.longitude
						}
						this.latitude = await res.latitude
						this.longitude = await res.longitude
						this.requestCount += 1
						this.$store.commit('system/updatepPosition', position)

						this.setDeafaultParams()
						this.addParams({
							Latitude: res.latitude,
							Longitude: res.longitude,
							min: 0,
							max: 0
						})
						this.resetList()
					}
				})
			},
			// 触屏开始
			doTouchStart(e) {
				let windowHeight = e.changedTouches[0].clientY //获取点击时鼠标的位置
				let theNode = uni.createSelectorQuery().select(".station")
				this.touchStartTime = Date.now()
				//获取当前窗口位置
				theNode.boundingClientRect((data) => {
					let heightNow = data.top
					this.heigthNow = data.top
					let diffVal = windowHeight - heightNow
					this.diffHeight = diffVal
				}).exec()
			},
			// 滑动
			doTouchMove(e) {
				let h = e.touches[0].clientY
				const endTime = Date.now()
				if (endTime - this.touchStartTime > 2000) {
					return
					// 如果手指滑动的距离超过2s 就默认不合法
				}
				// 根据滑动的距离，模块固定的位置变化
				if (h < this.heigthNow && this.diffHeight > 7) {
					this.scrollerHeight = '15%'
				} else {
					this.scrollerHeight = '55%'
				}
			},
			// 触屏结束
			doTouchLeave(e) {
				// const endTime = Date.now()
				// if (endTime - this.touchStartTime > 2000){
				//     return
				// 	// 如果手指滑动的距离超过2s 就默认不合法
				// }

				// let h = e.changedTouches[0].clientY
				// if (h < this.heigthNow && this.diffHeight>30) {
				// 	this.scrollerHeight = '15%'
				// } else {
				// 	this.scrollerHeight = '55%'
				// }
			},
			// 去到更多站点
			toMore() {
				uni.navigateTo({
					url: '/pages/station/station'
				})
			},
			// 去到天气小程序
			toWeatherApp() {
				// console.log('跳转成功')
				uni.navigateToMiniProgram({
					appId: 'wxed419e1cbcc2078e',
					success(res) {
						console.log('跳转成功', res)
					},
				})
			},
			toSearch() {
				uni.navigateTo({
					url: '/pages/search/index'
				})
			},
			toUrl(url) {
				console.log('url', url)
				uni.navigateTo({
					url: url
				})
			},
			toDetail(data) {
				// console.log("Id::", id)
				uni.navigateTo({
					url: '/pages/stationDetail/index?id=' + data.id
				})
			},
		},
		async onShow() {
			this.getSpots("", this.locationCity)
			// const logStatus = await this.$store.dispatch('user/getUserData')
			// let markers = this.$store.state.system.markers
			// if (this.covers.length < 1 && this.requestCount > 0) {
			// 	this.getServiceStation(this.latitude, this.longitude)
			// }


		},
		onLoad() {
			this.getDistance()
			/// 初始化腾讯地图
			qqmapsdk = new QQMapWX({
				key: 'OOJBZ-M5MK3-OQR3H-3NAC5-FCDST-2EBS3'
			});
		},
		watch: {
			covers() {

			}
		}
	}
</script>

<style lang="scss">
	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}

	.container {
		height: 100%;
	}

	.map {
		position: relative;

		map {
			width: 100%;
			height: 60vh;
		}

		.weather {
			width: 100upx;
			height: 100upx;
			position: absolute;
			right: 30upx;
			top: 30upx;
		}
	}

	.station {
		transition: 0.5s;
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
		position: fixed;
		// top: 50%;
		bottom: 0;
		box-shadow: 0 -2px 8px 0 rgba(0, 0, 0, 0.10);
		border-radius: 30rpx;
	}

	.page-section-spacing {
		position: relative;
		height: 100%;

		.list {
			height: 60%;
			overflow: auto;

			.more-tips {
				color: #999999;
				font-size: 24upx;
				text-align: center;
				padding-bottom: 30upx;
			}
		}

	}

	.content {
		margin: 0 30upx;
		height: 100%;

		.nav-bar {
			display: flex;
			justify-content: space-between;
			margin: 30upx 0 40upx 0;
			text-align: center;

			image {
				width: 90upx;
				height: 90upx;
			}
		}

		.touchBar {
			width: 70upx;
			height: 8upx;
			background: #D8D8D8;
			border-radius: 4rpx;
			margin: 0 auto;
			position: relative;
			top: 10upx;
			margin-top: 10upx;
		}

		.searchBar {
			background: #EFEFEF;
			border-radius: 36rpx;
			margin-top: 30upx;
		}


	}

	.station-list {
		height: 240rpx;
		background: #F7F7F7;
		border-radius: 10rpx;
		margin-bottom: 20upx;
		display: flex;
	}



	.nav-bar-img {
		height: 100%;
		position: relative;
	}

	.nav-img {
		height: 80%;
		display: flex;
		align-items: center;
	}
</style>