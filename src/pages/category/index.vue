<template>
  <view>
    <!-- 搜索 -->
    <search />
    <!-- 分类 -->
    <view class="category">
      <!-- 顶级分类 -->
      <view class="sup">
        <scroll-view scroll-y>
          <text :class="{'active':ac_index===index}"
          @click="tap(index)" 
          v-for="(item,index) in arr" 
          :key="item.cat_id">{{item.cat_name}}
          </text>
        </scroll-view>
      </view>
      <!-- 子级分类 -->
      <view class="sub">
        <scroll-view scroll-y>
          <!-- 封面图 -->
          <image src="http://static.botue.com/ugo/uploads/category.png" class="thumb"></image>

          <!-- 二级导航 -->
          <view class="children" v-for="item in arr[ac_index].children" :key="item.cat_name">
            <view class="title">{{item.cat_name}}</view>

            <!-- 品牌 -->
            <!-- 三级导航 -->
            <view class="brands">
              <navigator :url="'/pages/list/index?query='+product.cat_name" v-for="product in item.children" :key="product.cat_id">
                <image :src="product.cat_icon"></image>
                <text>{{product.cat_name}}</text>
              </navigator>
            </view>

          </view> 

        </scroll-view>
      </view>
      
    </view>
  </view>
</template>

<script>
  import search from '@/components/search';

  export default {
    data(){
      return{
        arr:[],
        //默认下标
        ac_index:0
     }
    },
    components: {
      search
    },
    onLoad(){
      this.getData()
    },
    methods:{
     async getData(){
        const res = await this.$request({
          url:'/api/public/v1/categories'
        })
        this.arr=res.message
      },
      //当前索引下标
      tap(index){
        this.ac_index=index
      }
    }
  }
</script>

<style scoped lang="less">
  scroll-view {
    height: 100%;
  }

  .category {
    display: flex;
    width: 100%;
    position: absolute;
    top: 100rpx;
    bottom: 0;

    .sup {
      width: 196rpx;
      background-color: #f4f4f4;

      text {
        display: block;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        font-size: 27rpx;
        color: #333;
        border-bottom: 1rpx solid #eee;

        &:last-child {
          border-bottom: none;
        }
        
        &.active {
          background-color: #FFF;
          color: #ea4451;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 8rpx;
            height: 60rpx;
            transform: translateY(-50%);
            background-color: #ea4451;

            position: absolute;
            left: 0;
            top: 50%;
          }
        }
      }
    }

    .sub {
      flex: 1;
      padding: 20rpx 18rpx;

      .thumb {
        width: 100%;
        height: 180rpx;
      }

      .children {
        text-align: center;
        color: #333;

        .title {
          display: inline-block;
          margin: 40rpx 0 20rpx;
          font-size: 30rpx;

          &::before {
            content: '/';
            margin-right: 20rpx;
            color: #666;
          }

          &::after {
            content: '/';
            margin-left: 20rpx;
            color: #666;
          }
        }
      }

      .brands {
        display: flex;
        flex-wrap: wrap;

        navigator {
          width: 33%;
          margin-bottom: 20rpx;
        }

        image {
          width: 120rpx;
          height: 120rpx;
        }

        text {
          display: block;
          font-size: 24rpx;
        }
      }
    }
  }
</style>
