<template>
	<view class="mine-container" :style="{height: `${windowHeight}px`}">
		<!--顶部个人信息栏-->
		<view class="header-section">
			<view class="flex padding justify-between">
				<view class="flex align-center">
					<view v-if="!avatar" class="cu-avatar xl round bg-white">
						<view class="iconfont icon-people text-gray icon"></view>
					</view>
					<image v-if="avatar" @click="handleToAvatar" :src="avatar" class="cu-avatar xl round"
						mode="widthFix">
					</image>
					<view v-if="!name" @click="handleToLogin" class="login-tip">
						点击登录
					</view>
					<view v-if="name" @click="handleToInfo" class="user-info">
						<view class="u_title">
							用户名：{{ name }}
						</view>
					</view>
				</view>
				<view v-show="name" @click="handleLogout" class="flex align-center">
					<text>退出登录</text>
					<view class="iconfont icon-right"></view>
				</view>
			</view>
		</view>

		<view class="content-section">
			<view class="mine-actions grid col-4 text-center">
				<view class="action-item" @click="toOrders(0)">
					<view class="iconfont icon-quanbudingdan text-pink icon"></view>
					<text class="text">全部订单</text>
				</view>
				<view class="action-item" @click="toOrders(1)">
					<view class="iconfont icon-daishiyong- text-blue icon"></view>
					<text class="text">待出行</text>
				</view>
				<view class="action-item" @click="toOrders(2)">
					<view class="iconfont icon-yiwancheng text-mauve icon"></view>
					<text class="text">已核销</text>
				</view>
				<view class="action-item" @click="toOrders(3)">
					<view class="iconfont  icon-yiqianshou text-green icon"></view>
					<text class="text">已取消</text>
				</view>
			</view>

			<view class="menu-list">
				<!-- <view class="list-cell list-cell-arrow" @click="handleToEditInfo">
          <view class="menu-item-box">
            <view class="iconfont icon-user menu-icon"></view>
            <view>编辑资料</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow" @click="handleHelp">
          <view class="menu-item-box">
            <view class="iconfont icon-help menu-icon"></view>
            <view>常见问题</view>
          </view>
        </view> -->
				<view class="list-cell list-cell-arrow" @click="toFavorites">
					<view class="menu-item-box">
						<view class="iconfont icon-aixin menu-icon"></view>
						<view>收藏夹</view>
					</view>
				</view>
				<view class="list-cell list-cell-arrow" @click="handleToFeedback">
					<view class="menu-item-box">
						<view class="iconfont icon-setting menu-icon"></view>
						<view>反馈</view>
					</view>
				</view>
<!-- 				<view class="list-cell list-cell-arrow" @click="handleToSetting">
					<view class="menu-item-box">
						<view class="iconfont icon-setting menu-icon"></view>
						<view>应用设置</view>
					</view>
				</view> -->
			</view>

		</view>
	</view>
</template>

<script>
	import storage from '@/utils/storage'

	export default {
		data() {
			return {
				// name: '',
				// avatar:'',
				version: getApp().globalData.config.appInfo.version
			}
		},
		computed: {
			avatar() {
				return this.$store.state.user.avatar
			},
			name(){
				return this.$store.state.user.name
			},
			windowHeight() {
				return uni.getSystemInfoSync().windowHeight - 50
			}
		},
		methods: {
			// 去到收藏夹
			toFavorites() {
				uni.navigateTo({
					url: '/pages/favorite/index'
				})
			},
			// 去到订单页面
			toOrders(status) {
				uni.navigateTo({
					url: '/pages/mine/orders/index?status=' + status
				})
			},
			// 去到反馈页面
			handleToFeedback(){
				this.$tab.navigateTo('/pages/feedback/index')
			},
			handleToInfo() {
				this.$tab.navigateTo('/pages/mine/info/index')
			},
			handleToEditInfo() {
				this.$tab.navigateTo('/pages/mine/info/edit')
			},
			handleToSetting() {
				this.$tab.navigateTo('/pages/mine/setting/index')
			},
			handleToLogin() {
				this.$tab.reLaunch('/pages/login')
			},
			handleToAvatar() {
				this.$tab.navigateTo('/pages/mine/avatar/index')
			},
			handleLogout() {
				this.$modal.confirm('确定注销并退出系统吗？').then(() => {
					this.$store.dispatch('LogOut').then(() => {
						this.$tab.reLaunch('/pages/index')
					})
				})
			},
		},
		onShow() {
			// this.avatar = this.$store.state.user.avatar
			// this.name = this.$store.state.user.name
			// console.log("this.$store.state.user::",this.$store.state.user)
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f6f7;
	}

	.mine-container {
		width: 100%;
		height: 100%;


		.header-section {
			padding: 15px 15px 45px 15px;
			background-color: #3c96f3;
			color: white;

			.login-tip {
				font-size: 18px;
				margin-left: 10px;
			}

			.cu-avatar {
				border: 2px solid #eaeaea;

				.icon {
					font-size: 40px;
				}
			}

			.user-info {
				margin-left: 15px;

				.u_title {
					font-size: 18px;
					line-height: 30px;
				}
			}
		}

		.content-section {
			position: relative;
			top: -50px;

			.mine-actions {
				margin: 15px 15px;
				padding: 20px 0px;
				border-radius: 8px;
				background-color: white;

				.action-item {
					.icon {
						font-size: 28px;
					}

					.text {
						display: block;
						font-size: 13px;
						margin: 8px 0px;
					}
				}
			}
		}
	}
</style>