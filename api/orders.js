import request from '@/utils/request'

// 创建订单
export function createOrder(data) {
  return request({
    url: '/Orders',
    method: 'post',
    data: data,
	headers: {
	  isToken: true
	},
  })
}

// 查询订单列表
export function getOrders(data) {
  return request({
    url: '/Orders',
    method: 'get',
    data: data,
	headers: {
	  isToken: true
	},
  })
}

// 取消订单
export function cancelOrders(data) {
  return request({
    url: '/Orders/Cancel',
    method: 'post',
    data: data,
	headers: {
	  isToken: true
	},
  })
}