/* 小程序页面方法 */

import { imgUrl } from '@/apis/api'
export default {
	/* 基础分享 */
	onShareAppMessage() {
		if (!this.hasShare) {
			let pages = getCurrentPages()
			let page = pages[pages.length - 1]
			let path = page.route + '?'
			let params = page.options || {}
			
			let userData = this.$store.state.user.userData
			if (userData && userData.id) {
				params.parentId = userData.id
			}
			
			for (let k in params) {
				path += `${k}=${encodeURIComponent(params[k])}&`
			}
			path = path.substr(0, path.length - 1)
			
			let config = this.$store.state.config.config
			return {
				path: path,
				imageUrl: config ? config.shareImg : '',
				title: config ? config.shareTitle : ''
			}
		}
	}
}