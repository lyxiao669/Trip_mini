<template>
	<view class="message-record">
		<view class="message-container">
			<view class="item" v-for="(item,index) of data">
				<view class="content" :key="item.id">{{item.content}}</view>
				
				<view class="reply-default">
					<text>{{item.createDate}}</text>
					<text class="status">{{status[item.status]}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getFeedbacks } from '@/api/feedback'
	export default {
		components:{
			
		},
		data() {
			return {
				data: {
					
				},
				status:[
					'待处理','已处理'
				]
			};
		},
		methods:{
			async viewMessage(){
				const viewRes = await getFeedbacks()
				console.log('viewRes',viewRes)
				this.data = viewRes
			}
		},
		onShow() {
			this.viewMessage()
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;
	}
	.message-container{
		.item{
			padding: 0 30upx;
			background-color: #FFFFFF;
			margin-bottom: 20upx;
			.content,.reply-default{
				padding: 30upx 0;
			}
			.content{
				font-size: 32upx;
				color: #333333;
				border-bottom: 1upx #EFEFEF solid;
			}
			.reply-default{
				font-size: 28upx;
				color: #999999;
				display: flex;
				justify-content: space-between;
			}
			.reply-content{
				font-size: 32upx;
				color: #333333;
			}
		}
	}
</style>
