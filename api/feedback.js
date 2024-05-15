import request from '@/utils/request'


// 添加反馈
export function addFeedback(data) {
  return request({
    url: '/Feedback',
    method: 'post',
    data: data,
	headers: {
	  isToken: true
	},
  })
}

// 查询反馈列表
export function getFeedbacks(data) {
  return request({
    url: '/Feedback',
    method: 'get',
    data: data,
	headers: {
	  isToken: true
	},
  })
}