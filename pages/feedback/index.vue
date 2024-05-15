<template>
	<view class="message-board">
		<view class="content-box">
			<view class="content">
				<textarea class="borard" maxlength="180" v-model="dataForm.content" placeholder="请填写您的反馈内容" />
			</view>
		</view>
		<view class="user-info">
<!-- 			<view class="name label">
				<text class="text">姓名</text>
				<input v-model="dataForm.contactName" type="text" class="inp" placeholder="请输入姓名(选填)"/>
			</view> -->
			<view class="phone label">
				<text class="text">手机号</text>
				<input v-model="dataForm.phone" type="number" maxlength="11" class="inp" placeholder="请输入手机号(必填)"/>
			</view>
		</view>
		<view class="submit" @click="submit">提交
			<!-- <auth></auth> -->
		</view>
		<view class="record" @click="toRecord">反馈记录</view>
	</view>
</template>

<script>
	import { addFeedback } from '@/api/feedback'
	export default {
		components:{
			// auth
		},
		data() {
			return {
				dataForm: {
					phone: '',
					content: '',
				}
			};
		},
		methods:{
			async submit(){
				if(this.dataForm.phone == '' || this.dataForm.content == ''){
					uni.showToast({
						title:'请填写必要信息',
						icon:'none'
					})
				}else{
					const addRes = await addFeedback(this.dataForm)
					console.log('addRes::',addRes)
					if(addRes.success){
						uni.showToast({
							title:addRes.message,
							icon:'none'
						})
					}
				}
				
			},
			toRecord(){
				uni.navigateTo({
					url:'/pages/feedback/record/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;
	}

	.content-box {
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
		height: 314upx;
		.content{
			margin: 0  30upx;
			padding-top: 30upx;
		}
		textarea {
			// padding: 0 30upx;
			width: 100%;
			font-size: 32rpx;
		}
	}
	.user-info{
		background-color: #FFFFFF;
		margin-top: 20upx;
		.label{
			margin: 0 30upx;
			display: flex;
			padding: 30upx 0;
			position: relative;
			.text{
				font-size: 32rpx;
				color: #333333;
			}
			.inp{
				font-size: 32rpx;
				position: absolute;
				left: 126upx;
			}
		}
		.name{
			border-bottom: 2upx solid #EFEFEF;
		}
	}
	.submit{
		margin: 40upx 30upx 0 30upx;
		height: 88upx;
		background-color: #FF4136;
		border-radius: 44rpx;
		line-height: 88upx;
		font-size: 30rpx;
		color: #FFFFFF;
		text-align: center;
		position: relative;
	}
	.record{
		font-size: 28upx;
		margin-top: 30upx;
		color: #999999;
		text-align: center;
	}
</style>
