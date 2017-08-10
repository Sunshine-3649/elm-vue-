<template>
  <div class="cartcontrol">
    <!--添加动画  -->
    <transition name="move">
      <!--左侧-小球  -->
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <!--中间数字  -->
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <!--右侧-小球  -->
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      // 增加
      addCart(event) {
        if (!event._constructed) {
          return;
        }
        // 添加属性count初始值为1，然后点击累加
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        // 3.触发一个事件(小球点击时触发的DOM)
        this.$emit('add', event.target);
      },
      // 减少
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      opacity: 1
      transform: translate3d(0, 0, 0)
      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        // 设置inner的旋转状态
        transition: all 0.4s linear
        transform: rotate(0)
      // 给cart-decrease添加类名(进入，离开)
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
      // 动画结束时候的状态
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
         // 设置inner的旋转状态
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
</style>