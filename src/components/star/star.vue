<template>
  <div class="star" :class="starType">
    <span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item" :key="index"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';

  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType() {
        return 'star-' + this.size;
      },
      itemClasses() {
        let result = [];
        // 根据分数先向上取整然后除2，得到要表达的分数
        let score = Math.floor(this.score * 2) / 2;
        // 是否有小数
        let hasDecimal = score % 1 !== 0;
        // 取整数
        let integer = Math.floor(score);
        // 整星
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }
        // 半星
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        // 星星不满五颗，补齐
        while (result.length < LENGTH) {
          result.push(CLS_OFF);
        }
        return result;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .star
    font-size: 0
    // 公共的样式
    .star-item
      display: inline-block
      background-repeat: no-repeat
    // 相对与绑定的类名，根据传入的size的值取不同的类名
    &.star-48
      // 不同的样式分开写
      .star-item
        width: 20px
        height: 20px
        margin-right: 22px
        background-size: 20px 20px
        // 去掉最后一个的margin-right
        &:last-child
          margin-right: 0
        // 添加.on/.half/.off来显示背景图片
        &.on
          bg-image('star48_on')
        &.half
          bg-image('star48_half')
        &.off
          bg-image('star48_off')
    &.star-36
      .star-item
        width: 15px
        height: 15px
        margin-right: 6px
        background-size: 15px 15px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star36_on')
        &.half
          bg-image('star36_half')
        &.off
          bg-image('star36_off')
    &.star-24
      .star-item
        width: 10px
        height: 10px
        margin-right: 3px
        background-size: 10px 10px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star24_on')
        &.half
          bg-image('star24_half')
        &.off
          bg-image('star24_off')
</style>