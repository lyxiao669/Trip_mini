<template>
	<view class="normal-login-container">
		<view class="logo-content align-center justify-center flex">
			<!-- <image style="width: 100rpx;height: 100rpx;" :src="globalConfig.appInfo.logo" mode="widthFix">
      </image> -->
			<div class="getAvatarContailner">
				<button class="getAvatar" open-type="chooseAvatar" @chooseavatar="onChooseAvatar"
					@click="getUser"></button>
				<image v-if="!registerForm.Avatar" style="width: 100rpx;height: 100rpx;"
					src="@/static/images/not_avatar.png" mode="widthFix">
					<image v-else style="width: 100rpx;height: 100rpx;" :src="registerForm.Avatar" mode="widthFix">
						<p>点击设置头像</p>
			</div>
		</view>
		<view class="login-form-content">
			<view class="input-item flex align-center">
				<view class="iconfont icon-user icon"></view>
				<input v-model="registerForm.UserName" class="input" type="text" placeholder="请输入账号" maxlength="30" />
			</view>
			<view class="input-item flex align-center">
				<view class="iconfont icon-password icon"></view>
				<input v-model="registerForm.Password " type="password" class="input" placeholder="请输入密码"
					maxlength="20" />
			</view>
			<view class="input-item flex align-center">
				<view class="iconfont icon-password icon"></view>
				<input v-model="registerForm.confirmPassword" type="password" class="input" placeholder="请输入重复密码"
					maxlength="20" />
			</view>
			<view class="action-btn">
				<button @click="handleRegister()" class="register-btn cu-btn block bg-blue lg round">注册</button>
			</view>
		</view>
		<view class="xieyi text-center">
			<text @click="handleUserLogin" class="text-blue">使用已有账号登录</text>
		</view>
	</view>

</template>

<script>
	import {
		getCodeImg,
		register
	} from '@/api/login'
	import {
		createUploadToken
	} from '@/api/upload'
	export default {
		data() {
			return {
				codeUrl: "",
				captchaEnabled: true,
				globalConfig: getApp().globalData.config,
				registerForm: {
					UserName: "",
					Password: "",
					confirmPassword: "",
					Avatar: "",
				},
				qiniuToken: '',
				imgKey: ''
			}
		},
		created() {

		},
		methods: {
			async getUploadToken() {
				let token = await createUploadToken()
				this.qiniuToken = token
				return token;
			},
			async uploadImg(file,token) {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						method: "POST",
						url: 'https://up-z2.qiniup.com', // 此处为华北地区
						name: 'file',
						filePath: file,
						formData: {
							token: token, 
						},
						success: function(res) {
							let key = JSON.parse(res.data).key;
							resolve(key); 
						},
						fail: function(res) {
							console.log(res);
							reject(res); 
						}
					});
				});
			},
			//获取用户头像，上传到七牛云
			async onChooseAvatar(e) {
				wx.getUserProfile({
					desc: '获取用户信息',
					success: res => {
						console.log("res::", res)
					}
				})
				let avatar = e.detail.avatarUrl
				let token = await this.getUploadToken();
				let imgKey = await this.uploadImg(avatar,token);
				this.registerForm.Avatar = "http://www.webxiaoyou.top/" + imgKey;
			},
			// 用户登录
			handleUserLogin() {
				this.$tab.navigateTo(`/pages/login`)
			},
			// 注册方法
			async handleRegister() {
				if (this.registerForm.UserName === "") {
					this.$modal.msgError("请输入您的账号")
				} else if (this.registerForm.Password === "") {
					this.$modal.msgError("请输入您的密码")
				} else if (this.registerForm.confirmPassword === "") {
					this.$modal.msgError("请再次输入您的密码")
				} else if (this.registerForm.Password !== this.registerForm.confirmPassword) {
					this.$modal.msgError("两次输入的密码不一致")
				} else if (this.registerForm.Avatar === "") {
					this.$modal.msgError("请设置头像")
				} else {
					this.$modal.loading("注册中，请耐心等待...")
					this.register()
				}
			},
			// 用户注册
			async register() {
				let formData = {
					UserName: this.registerForm.UserName,
					Password: this.registerForm.Password,
					Avatar: this.registerForm.Avatar
				}
				register(this.registerForm).then(res => {
					this.$modal.closeLoading()
					uni.showModal({
						title: "系统提示",
						content: "恭喜你，您的账号 " + this.registerForm.UserName + " 注册成功！",
						success: function(res) {
							if (res.confirm) {
								uni.redirectTo({
									url: `/pages/login`
								});
							}
						}
					})
				})
			},
			// 注册成功后，处理函数
			registerSuccess(result) {
				// 设置用户信息
				this.$store.dispatch('GetInfo').then(res => {
					this.$tab.reLaunch('/pages/index')
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ffffff;
	}

	.normal-login-container {
		width: 100%;

		.logo-content {
			width: 100%;
			font-size: 21px;
			text-align: center;
			padding-top: 15%;

			image {
				border-radius: 4px;
			}

			.title {
				margin-left: 10px;
			}
		}

		.login-form-content {
			text-align: center;
			margin: 20px auto;
			margin-top: 15%;
			width: 80%;

			.input-item {
				margin: 20px auto;
				background-color: #f5f6f7;
				height: 45px;
				border-radius: 20px;

				.icon {
					font-size: 38rpx;
					margin-left: 10px;
					color: #999;
				}

				.input {
					width: 100%;
					font-size: 14px;
					line-height: 20px;
					text-align: left;
					padding-left: 15px;
				}

			}

			.register-btn {
				margin-top: 40px;
				height: 45px;
			}

			.xieyi {
				color: #333;
				margin-top: 20px;
			}

			.login-code {
				height: 38px;
				float: right;

				.login-code-img {
					height: 38px;
					position: absolute;
					margin-left: 10px;
					width: 200rpx;
				}
			}
		}
	}


	.getAvatarContailner {
		position: relative;

		.getAvatar {
			position: absolute;
			width: 100%;
			height: 100%;
			opacity: 0;
		}

		p {
			font-size: 24rpx;
		}
	}
</style>