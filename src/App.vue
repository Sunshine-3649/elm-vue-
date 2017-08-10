<template>
  <div>
    <!--头部组件  -->
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <!--视图变化区  -->
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

 <script type="text/ecmascript-6">
  // 外部调用的方法
  import {urlParse} from 'common/js/util';
  import header from 'components/header/header.vue';

  const ERR_OK = 0;

  export default {
    data() {
      return {
        seller: {
          // 请求的参数（商家名称）
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },
    created() {
      // 页面创建时发送ajax请求
      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          // 合并两个对象
          this.seller = Object.assign({}, this.seller, response.data);
        }
      });
    },
    components: {
      // header是关键字所以用v-header
      'v-header': header
    }
  };

</script>

<style lang="stylus" rel="stylesheet/stylus">
  // 引用混合样式
  @import "./common/stylus/mixin.styl"

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    // border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
