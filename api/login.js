import request from '@/utils/request'

// 登录方法
export function login(UserName, Password) {
  const data = {
    UserName,
    Password,
  }
  return request({
    url: '/Users/login',
    method: 'get',
    data: {
		UserName,
		Password
	}
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/Users/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/Users/UserInfo',
    method: 'get',
	headers: {
	  isToken: true
	},
  })
}

// 退出方法
export function logout() {
  return request({
    'url': '/logout',
    'method': 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    'url': '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}
