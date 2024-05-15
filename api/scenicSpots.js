import request from '@/utils/request'

// 获取景区列表
export function getSpotList(KeyWord, cityName) {
  return request({
    url: '/ScenicSpots',
    method: 'get',
    data: {
		KeyWord,
		cityName,
	}
  })
}

// 获取景区详情
export function getSpotById(data) {
  return request({
    url: '/ScenicSpots/ScenicSpotDetail',
    method: 'get',
    data: data
  })
}

// 添加收藏
export function addFavorite(data) {
  return request({
    url: '/UserFavorites',
    method: 'post',
    data: data,
	headers: {
	  isToken: true
	},
  })
}

// 检查用户是否收藏
export function isFavorite(data) {
  return request({
    url: '/UserFavorites/CheckFavorite',
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