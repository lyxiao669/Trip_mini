<template>
  <view class="normal-login-container">
	  <!-- <image style="width: 100rpx;height: 100rpx;" :src="globalConfig.appInfo.logo" mode="widthFix"> -->
<!--    <view class="logo-content align-center justify-center flex">
	  <div  class="getAvatarContailner">
		  <button class="getAvatar" open-type="chooseAvatar" @chooseavatar="onChooseAvatar"></button>
		  <image v-if="!loginForm.avatar" style="width: 100rpx;height: 100rpx;" src="@/static/images/not_avatar.png" mode="widthFix">
		  <image v-else style="width: 100rpx;height: 100rpx;" :src="loginForm.avatar" mode="widthFix">
			  <p>点击设置头像</p>
	  </div>
      </image>
    </view> -->
    <view class="login-form-content">
      <view class="input-item flex align-center">
        <view class="iconfont icon-user icon"></view>
        <input v-model="loginForm.username" class="input" type="text" placeholder="请输入账号" maxlength="30" />
      </view>
      <view class="input-item flex align-center">
        <view class="iconfont icon-password icon"></view>
        <input v-model="loginForm.password" type="password" class="input" placeholder="请输入密码" maxlength="20" />
      </view>
      <view class="action-btn">
        <button @click="handleLogin"  class="login-btn cu-btn block bg-blue lg round">登录</button>
      </view>
      <view class="reg text-center" v-if="register">
        <text class="text-grey1">没有账号？</text>
        <text @click="handleUserRegister" class="text-blue">立即注册</text>
      </view>
    </view>
     
  </view>
</template>

<script>
  import { getCodeImg } from '@/api/login'

  export default {
    data() {
      return {
        codeUrl: "",
        captchaEnabled: true,
        // 用户注册开关
        register: true,
        globalConfig: getApp().globalData.config,
        loginForm: {
          username: "",
          password: "",
          // avatar: "",
        },
		avatar:''
      }
    },
    created() {
		
    },
    methods: {
		//获取用户头像
		onChooseAvatar(e){
			this.loginForm.avatar = e.detail.avatarUrl
		},
      // 用户注册
      handleUserRegister() {
        this.$tab.redirectTo(`/pages/register`)
      },
      // 登录方法
      async handleLogin() {
        if (this.loginForm.username === "") {
          this.$modal.msgError("请输入您的账号")
        } else if (this.loginForm.password === "") {
          this.$modal.msgError("请输入您的密码")
        } else {
          this.$modal.loading("登录中，请耐心等待...")
          this.pwdLogin()
        }
      },
      // 密码登录
      async pwdLogin() {
        this.$store.dispatch('Login', this.loginForm).then(() => {
          this.$modal.closeLoading()
          this.loginSuccess()
        })
      },
      // 登录成功后，处理函数
      loginSuccess(result) {
        // 设置用户信息
        this.$store.dispatch('GetInfo').then(res => {
          this.$tab.reLaunch('/pages/index')
        })
		uni.reLaunch({
			url:'/pages/home/home'
		})
      }
    }
  }
</script>

<style lang="scss">
  page {
    background-color: #ffffff;
  }

  .normal-login-container {
    width: 100%;

    .logo-content {
      width: 100%;
      font-size: 21px;
      text-align: center;
      padding-top: 15%;

      image {
        border-radius: 4px;
      }

      .title {
        margin-left: 10px;
      }
    }

    .login-form-content {
      text-align: center;
      margin: 20px auto;
      margin-top: 15%;
      width: 80%;

      .input-item {
        margin: 20px auto;
        background-color: #f5f6f7;
        height: 45px;
        border-radius: 20px;

        .icon {
          font-size: 38rpx;
          margin-left: 10px;
          color: #999;
        }

        .input {
          width: 100%;
          font-size: 14px;
          line-height: 20px;
          text-align: left;
          padding-left: 15px;
        }

      }

      .login-btn {
        margin-top: 40px;
        height: 45px;
      }
      
      .reg {
        margin-top: 15px;
      }
      
      .xieyi {
        color: #333;
        margin-top: 20px;
      }
      
      .login-code {
        height: 38px;
        float: right;
      
        .login-code-img {
          height: 38px;
          position: absolute;
          margin-left: 10px;
          width: 200rpx;
        }
      }
    }
  }

.getAvatarContailner{
	position: relative;
	.getAvatar{
		position: absolute;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
	p{
		font-size: 24rpx;
	}
}

</style>
