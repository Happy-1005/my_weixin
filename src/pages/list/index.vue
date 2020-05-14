<template>
  <view>
    <!-- 筛选 -->
    <view class="filter">
      <text class="active">综合</text>
      <text>销量</text>
      <text>价格</text>
    </view>
    <!-- 商品列表 -->
    <scroll-view class="goods" scroll-y @scrolltolower="getMore">
      <view class="item" @click="goDetail(item.goods_id)" v-for="item in goodsList" :key="item.goods_id">
        <!-- 商品图片 -->
        <image class="pic" :src="item.goods_small_logo"></image>
        <!-- 商品信息 -->
        <view class="meta">
          <view class="name">{{item.goods_name}}</view>
          <view class="price">
            <text>￥</text>{{item.goods_price}}<text>.00</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  export default {
    data(){
      return{
        query:'',
        pagenum:1,//页数索引
        pagesize:7 ,//每页长度
        goodsList:[],
        flag:'请求完成'
      }
    },
    onLoad(e){
      //获取数据
      this.query = e.query
      //请求
      this.get_data()
    },
    methods: {
      //发请求获取页面数据
      async get_data(){
        //请求未完成        
        if(this.flag=='请求未完'){
          return
        }
        this.flag='请求未完'
        console.log(this.flag)
        const res = await this.$request({
            url:'/api/public/v1/goods/search',
            data:{
                query:this.query,
                pagenum:this.pagenum,
                pagesize:this.pagesize
            }
          })

          //请求完成
          this.flag='请求完成'
          console.log(this.flag)
          this.goodsList= res.message.goods
          //覆盖原数组
          this.goodsList= this.goodsList.concat(res.message.goods)
      },
      //页面跳转
      goDetail (id) {
        uni.navigateTo({
          url: '/pages/goods/index?id='+id
        })
      },
      //触底加载新数据
      getMore(){
        //1.页码加1
        this.pagenum++
        //2.加载新数据
        this.get_data()
      }
    }
  }
</script>

<style scoped lang="less">
  .filter {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    border-bottom: 1rpx solid #ddd;

    /* #ifdef H5 */
    position: relative;
    z-index: 99;
    /* #endif */

    text {
      flex: 1;
      text-align: center;
      font-size: 30rpx;
      color: #333;

      &.active {
        color: #ea4451;
      }
    }
  }
  
  .goods {
    position: absolute;
    width: 100%;
    top: 97rpx;
    bottom: 0;
  }

  .item {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 20rpx;
    border-bottom: 1rpx solid #eee;

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
  }
</style>
