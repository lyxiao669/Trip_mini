<template>
	<view>
		<view class="searchBar" @click="toSearch">
			<view class="fill">
				<icon class="icon-small" type="search" size="18"></icon>
				<input class="inp" type="text" v-model="valueText"  :placeholder="label" confirm-type="search" @confirm="doSearch" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"search",
		props:{
			label:{
				type:String,
				default:'搜索'
			},
			value:{
				type:String,
				default:''
			},
		},
		data() {
			return {
				valueText:''
			};
		},
		methods:{
			toSearch(){
				this.$emit('toSearch')
			},
			doSearch(e){
				this.$emit('doSearch',this.valueText)
				console.log(this.valueText)
			}
		},
		mounted() {
			
		},
		watch:{
			value(val){
				this.valueText = val
			}
		}
	}
</script>

<style lang="scss" scoped>
	.searchBar {
		background: #EFEFEF;
		border-radius: 36rpx;
		.fill {
			padding: 16upx 26upx;
	
		}
	
		icon {
			vertical-align: middle;
		}
	
		.inp {
			font-size: 28rpx;
			color: #CCCCCC;
			letter-spacing: -0.68rpx;
			display: inline-block;
			vertical-align: middle;
			padding-left: 20upx;
			width: 90%;
		}
	}
	
</style>
