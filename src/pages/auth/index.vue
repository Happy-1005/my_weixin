<template>
  <view>
    <button type="primary" open-type="getUserInfo" @getuserinfo="btn_userInfo">微信登录</button>
  </view>
</template>

<script>
  export default {
    methods:{
      //获取用户信息：
        // 1.需要用户主动点击按钮，进行获取用户信息；
        // 2.一旦用户曾经点击过允许获取，下次再进入小程序的时候，不需要经过用户同意，直接通过JS api 方式就可以获取用户的信息；

      //代码：先用 JS api 获取下用户的信息，看能不能获取到；
        //如果能获取到：用户曾经主动点击允许获取过；(如果能获取到 代表用户点击过)
        //如果不能获取：用户现在没有授权允许获取（没有点击）；显示按钮，让用户去点击按钮，登录之后 在获取；
      async get_uesrInfo(){
        const [err,res] = await uni.getUserInfo()
        if(res){
          this.get_token(res)
        }
        
      },
      // 1.需要用户主动点击按钮，进行获取用户信息；
      btn_userInfo(e){
        // console.log(e.detail);
        this.get_token(e.detail)
      },
      //获取token
      async get_token(data){
        //获取code信息
        const [err,codeObj] =  await uni.login()
        //调接口
        const {message} = await this.$request({
            url:'/api/public/v1/users/wxlogin',
            method:'POST',
            data:{
              code:codeObj.code,
              encryptedData:data.encryptedData,
              iv:data.iv,
              rawData:data.rawData,
              signature:data.signature,
            }
        })
        console.log(message)
        //把token存入本地
        uni.setStorageSync('token',message.token)  
        //返回购物车结算
        uni.navigateBack()     
      }
    },
    onLoad(){
      this.get_uesrInfo()
    }
  }
</script>

<style lang="less" scoped>
  button {
    width: 600rpx;
    margin: 200rpx auto 0;
  }
</style>