<template>
  <view class="wrapper">
    <!-- 收货信息 -->
    <view class="shipment">
      <block v-if="addr">
        <view class="dt">收货人: </view>
        <view class="dd meta">
          <text class="name">{{addr.userName}}</text>
          <text class="phone">{{addr.telNumber}}</text>
        </view>
        <view class="dt">收货地址:</view>
        <view class="dd">{{addr.detail}}</view>
      </block>
      <!-- 默认显示按钮 没有地址 点击后 若有地址按钮则隐藏 -->
      <button v-else type="primary" @tap="get_addr">获取收货地址</button>
    </view>
    <!-- 购物车 -->
    <view class="carts">
      <view class="item">
        <!-- 店铺名称 -->
        <view class="shopname">优购生活馆</view>
        <view class="goods" v-for="(item,index) in cartList" :key="item.goods_id">
          <!-- 商品图片 -->
          <image class="pic" :src="item.goods_small_logo"></image>
          <!-- 商品信息 -->
          <view class="meta">
            <view class="name">{{item.goods_name}}</view>
            <view class="price">
              <text>￥</text>{{item.goods_price}}<text>.00</text>
            </view>
            <!-- 加减 -->
            <view class="amount">
              <text class="reduce" @tap="change_numb(-1,index)">-</text>
              <input type="number" :value="item.goods_number" class="number">
              <text class="plus" @tap="change_numb(1,index)">+</text>
            </view>
          </view>
          <!-- 选框 -->
          <view class="checkbox">
            <icon type="success" size="20" :color="item.goods_buy?'#ea4451':'#ccc'" @click="change_click(index)"></icon>
          </view>
        </view>
      </view>
    </view>
    <!-- 其它 -->
    <view class="extra">
      <label class="checkall">
        <icon type="success" :color="is?'#ea4451':'#ccc'" size="20" @click="ck_all"></icon>
        全选
      </label>
      <view class="total">
        合计: <text>￥</text><label>{{sum}}</label><text>.00</text>
      </view>
      <view class="pay" @tap="create_order">结算({{click_all.length}})</view>
    </view>
  </view>
</template>

<script>
  export default {
    data(){
      return{
        cartList:[],
        //默认收货地址
        addr:null
      }
    },
    computed:{
      //反选的思维 
      // 当选中的商品的数量 和所有的商品数量进行比较 长度一样则为全选 反之 不为全选
      click_all(){
        //定义一个数组 把选中的商品筛选出来
        var arr = []
        //遍历当前列表
        this.cartList.forEach(function(item){
          if(item.goods_buy){
            arr.push(item)
          }
        })
        return arr
      },
      //是否反选
      is(){
       return this.click_all.length===this.cartList.length
      },
      //总价 
      sum(){
        var zongjia = 0
        //选中商品的单价  x  数量 的总和
        this.click_all.forEach(function(item){
          zongjia += item.goods_price*item.goods_number
        })
        return zongjia 
      }
    },
    onShow(){
      //请求数据 渲染页面
      this.cartList = uni.getStorageSync('list')||[]
    },
    methods:{
      //获取收货地址
      get_addr(){
        uni.chooseAddress({
          success:(res)=>{
            this.addr=res
            this.addr.detail = res.provinceName + res.cityName + res.countyName + res.detailInfo
          }
        })
      },
      //全选按钮
      ck_all(){
        //1.拿到当前的全选状态
        var ck = !this.is
        //2.把点击之后的状态   赋值给全部数据上
        this.cartList.forEach(function(item){
          item.goods_buy=ck
        })
        //3.存回到本地
        uni.setStorageSync('list',this.cartList)
      },
      //改变选中状态
      change_click(index){
        this.cartList[index].goods_buy=!this.cartList[index].goods_buy
        //改变状态 保存到本地
        uni.setStorageSync('list',this.cartList)
      },
      //改变商品的数量
      change_numb(step,index){
        //3.判断加 减的边界值
        if(step===-1&&this.cartList[index].goods_number==1) {return}
                //此处的100为测试值
        if(step===1&&this.cartList[index].goods_number==10) {return}
        //1.改变数量
        this.cartList[index].goods_number += step
        //2.更改数量 存回本地
        uni.setStorageSync('list',this.cartList)
      },
      //结算
      create_order(){
        //1.判断收货地址
        if(!this.addr){
          uni.showToast({title:'请选择收货地址',icon:'none'})
          return
        }
        //2.判断是否有选择商品
        if(this.click_all.length===0){
          uni.showToast({title:'请选择购买的商品',icon:'none'})
          return
        }
        //3.是否有token
        if(!uni.getStorageSync('token')){
          uni.navigateTo({
            url:"/pages/auth/index"
          })
          return
        }
        //4.以上条件都满足
        //创建订单 跳转到订单页面 获取数据
        //以下代码需要获取到token才能进行
       /* const {message,meta} = await this.request({
            url:"/api/public/v1/my/orders/create",
            method:"POST",
            header:{"Authorization" : uni.getStorageSync("token")},
            data:{
                order_price:this.sum,
                consignee_addr:this.addr.details,
                goods:this.ck_carts
            }
        });

        // 订单创建成功:去订单页
        if (meta.status==200) {
            
            // 清除购物车数据的数据 （业务上）
            // 清空掉
            uni.removeStorageSync("carts");
            
            // 转跳页面
            uni.navigateTo({
                url:"/pages/order/index"
            }); 
        } */
      }
    }
 
  }
</script>

<style scoped lang="less">
  .shipment {
    height: 100rpx;
    line-height: 2;
    padding: 30rpx 30rpx 40rpx 30rpx;
    font-size: 27rpx;
    color: #333;
    background-color: #fff;
    background-image: url(http://static.botue.com/ugo/images/cart_border%402x.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;

    .dt {
      width: 140rpx;
      float: left;
      clear: both;
    }

    .dd {
      padding-left: 160rpx;
    }

    .meta {
      padding-right: 50rpx;
    }

    text.phone {
      float: right;
    }
  }

  .carts {
    background-color: #f4f4f4;
    padding-bottom: 110rpx;
    overflow: hidden;

    .shopname {
      padding: 30rpx;
      margin-top: 20rpx;
      font-size: 30rpx;
      color: #333;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
    }

    .goods {
      display: flex;
      padding: 30rpx 20rpx 30rpx 0;
      margin-left: 100rpx;
      border-bottom: 1rpx solid #eee;
      background-color: #fff;
  
      position: relative;

      .checkbox {
        width: 101rpx;
        height: 100%;
        background-color: #fff;

        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        left: -100rpx;
        top: 0;
      }

      &:last-child {
        border-bottom: none;
      }

      .pic {
        width: 200rpx;
        height: 200rpx;
        margin-right: 30rpx;
      }

      .meta {
        flex: 1;
        font-size: 27rpx;
        color: #333;
        position: relative;
      }

      .name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .price {
        position: absolute;
        bottom: 0;

        color: #ea4451;
        font-size: 33rpx;

        text {
          font-size: 22rpx;
        }
      }

      .amount {
        position: absolute;
        bottom: 0;
        right: 20rpx;

        height: 48rpx;
        text-align: center;
        border: 1rpx solid #ddd;
        border-radius: 8rpx;

        display: flex;
        align-items: center;

        text {
          display: block;
          width: 60rpx;
          line-height: 48rpx;
          font-size: 36rpx;
          color: #ddd;
          text-align: center;
        }

        input {
          width: 60rpx;
          height: 48rpx;
          min-height: 48rpx;
          font-size: 27rpx;
          border-left: 1rpx solid #ddd;
          border-right: 1rpx solid #ddd;
        }
      }
    }
  }

  .extra {
    position: fixed;
    bottom: 0;
    /* #ifdef H5 */
    bottom: 50px;
    /* #endif */
    left: 0;
    z-index: 9;

    width: 750rpx;
    height: 96rpx;
    text-align: center;
    line-height: 96rpx;
    font-size: 36rpx;
    border-top: 1rpx solid #eee;
    background-color: #fff;
    color: #333;
    display: flex;

    .checkall {
      width: 140rpx;
      line-height: 1;
      margin-left: 25rpx;
      display: flex;
      align-items: center;

      icon {
        margin-right: 20rpx;
      }
    }

    .total {
      display: flex;
      justify-content: center;
      flex: 1;

      label, text {
        color: #ea4451;
        vertical-align: bottom;
        position: relative;
        bottom: -2rpx;
      }

      text {
        position: relative;
        bottom: -3rpx;
        font-size: 24rpx;

        &:first-child {
          margin-left: 10rpx;
        }
      }
    }

    .pay {
      width: 200rpx;
      background-color: #ea4451;
      color: #fff;
    }
  }
</style>

