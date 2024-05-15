import request from '@/utils/request'

// 获取上传token
export function createUploadToken(data) {
  return request({
    url: '/Upload/CreateUploadToken',
    method: 'post',
    data: data,
  })
}