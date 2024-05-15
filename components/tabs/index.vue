<template>
	<view class='tabs flex c-center' :style="{backgroundColor: background}">
		<view class="tabs-item fg1"
		:class="{'active' : currentTab === index}"
		v-for="(item, index) in tabs"
		:key="index"
		@click="onSetTab(index)">
			<text :id="'tab' + index" :style="{color: color}">{{ item.text }}</text>
            <!-- <text :id="'tab' + index">{{ item.text }}</text> -->
		</view>
		<view v-if="isShow"
		class="active-bar"
		:style="{left: activeBar.left, right: activeBar.right, backgroundColor: barColor}"></view>
	</view>
</template>

<script>
	export default {
		props: {
			tabs: {
			  type: Array,
			  default: () => []
			},
			current: {
			  type: Number,
			  default: 0
			},
			background: {
				type: String,
				default: '#FFF'
			},
			color: {
				type: String,
				default: '#666666'
			},
			barColor: {
				type: String,
				default: '#666666'
			},
			left: {
				type: Number,
				default: 0
			},
			right: {
				type: Number,
				default: 0
			}
		},
		computed: {

		},
		data() {
			return {
				isShow: false,
				currentTab: 0,
				activeBar: {
				  left: 0,
				  right: 0
				}
			}
		},
		watch: {
			current(val) {
				this.currentTab = val
				this.setActiveBar()
			}
		},
		onReady() {
			this.currentTab = this.current
			this.setActiveBar()
		},
		methods: {
			onSetTab(index) {
			  index = index * 1
			  let currentTab = this.currentTab
			  if (index === currentTab) {
				return false
			  }
			  this.currentTab = index
			  this.setActiveBar(index < currentTab ? "left" : "right")
			  this.$emit('change', index)
			},
			setActiveBar: function (direction) {
				const query = uni.createSelectorQuery()
				query.select(`#tab >>> #tab${this.currentTab}`).boundingClientRect(rect => {
					if (!rect) {
						return
					}
					let left = rect.left - uni.upx2px(this.left) + 'px'
					let right = uni.getSystemInfoSync().windowWidth - uni.upx2px(this.right) - rect.right + 'px'
					if (direction) {
					  if (direction === 'left') {
						this.activeBar.left = left
						setTimeout(() => {
							this.activeBar.right = right
						}, 75)
					  } else {
						this.activeBar.right = right
						setTimeout(() => {
						  this.activeBar.left = left
						}, 75)
					  }
					} else {
					  this.activeBar.left = left
					  this.activeBar.right = right
					}
					this.isShow = true
				}).exec()
			}
		}
	}
</script>

<style lang="scss">
.tabs {
    height: 90upx;
    line-height: 90upx;
    top: 0;
    left: 0;
    right: 0;
    background-color: #1D91EE;
    font-size: 26upx;
    text-align: center;
    position: fixed;
    z-index: 2;
	display: flex;
	justify-content: space-around;
    .tabs-item {
        height: 100%;
        text {
            line-height: 34upx;
            vertical-align: middle;
            display: inline-block;
        }
    }
}
.tabs .tabs-item text {
	opacity: 0.7;
    color:rgba(255,255,255,0.5);
}
.tabs .tabs-item.active {
    font-size: 30upx;
    font-weight: bold;
    color:rgba(255,255,255,1);
}
.tabs .tabs-item.active text {	
    opacity: 1;
    color:rgba(255,255,255,1);
}

.active-bar {
    position: absolute;
    bottom: 0;
    height: 6upx;
    left: 0;
    right: 10upx;
    transition: left .15s, right .15s;
}
</style>
