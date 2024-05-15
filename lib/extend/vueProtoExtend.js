/* Vue原型扩展 */
import { cloneObj } from '@/lib/utils/util'
import { verify } from '@/lib/utils/verify'
const extend = {
	install(Vue) {
		/** loading 方法 */
		Vue.prototype.showPageLoading = function(ref = 'loading') {
			this.$refs[ref] && this.$refs[ref].showLoading()
		}
		Vue.prototype.hidePageLoading = function(ref = 'loading') {
			this.$refs[ref] && this.$refs[ref].hideLoading()
		}
		/* 检查登录 */
		Vue.prototype.yCheckLogin = function() {
			if (!this.$store.state.user.userData) {
				uni.navigateTo({
					url: '/pages/auth/auth'
				})
				return false
			}
			return true
		}
		/* 设置用户信息 */
		Vue.prototype.ySetUserData = function() {
			this.userData = this.$store.state.user.userData
		}
		/* 询问 */
		Vue.prototype.showModal = function(title = '', content = '', showCancel = true) {
			return new Promise((resolve) => {
				uni.showModal({
					title,
					content,
					showCancel,
					success: res => {
						if (!res.confirm) {
							resolve(false)
						} else {
							resolve(true)
						}
					}
				})
			})
		}
		/* 检查表单数据 */
		Vue.prototype.validForm = function(data, rules = []) {
			let message  = ''
			for (let i=0,l=rules.length;i<l;i++) {
				let rule = rules[i]
				let value = data[rule.key]
				if (rule.expression && typeof rule.expression === 'function') {
					// 存在表达式
					if (rule.expression.call(this, data)) {
						message = rule.text
						break
					}
				} else if (rule.verify) {
					// 需要调用校验
					if (!verify(rule.verify, value)) {
						message = rule.text
						break
					}
				} else {
					// 校验是否存在
					if (value === '' || value == null) {
						message = rule.text
						break
					}
				}
			}
			if (message) {
				uni.showToast({
					title: message,
					icon: 'none'
				})
				return false
			} else {
				return true
			}
		}
		/* JSON 复制对象 */
		Vue.prototype.cloneObj = cloneObj
		// 挂载静态属性
		Vue.prototype.ISIOS = uni.getSystemInfoSync().system.toLowerCase().indexOf('ios') > -1
	}
}

export default extend