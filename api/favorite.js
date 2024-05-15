import request from '@/utils/request'


// 查询用户收藏
export function getFavorites(data) {
  return request({
    url: '/UserFavorites',
    method: 'get',
    data: data,
	headers: {
	  isToken: true
	},
  })
}

// 删除用户收藏
export function deleteFavorites(data) {
  return request({
    url: '/UserFavorites/Delete',
    method: 'post',
    data: data,
	headers: {
	  isToken: true
	},
  })
}