<template>
  <div>
    <div class="goods">
      <!--左侧列表栏  -->
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <!--9.设置currentIndex和当前的索引值进行对比，如果为true就显示高亮 （.current）  -->
          <!--10.添加点击事件传入索引值 （$event: 取消BScroll的默认事件） -->
          <li v-for="(item,index) in goods" class="menu-item" :key="index" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)" ref="menuList">
            <span class="text border-1px">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <!--右侧商品栏  -->
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="(item, index) in goods" :key="index" class="food-list" ref="foodList">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="(food, index) in item.foods" :key="index" @click="selectFood(food,$event)" class="food-item border-1px">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <!--extra: 额外的  -->
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol @add="addFood" :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!--底部购物车  -->
      <!--deliveryPrice：配送费  -->
      <!--minPrice：起送费  -->
      <shopcart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
    </div>
    <!--点击购物车显示的详情列表  -->
    <food @add="addFood" :food="selectedFood" ref="food"></food>
  </div>
</template>

 <script type="text/ecmascript-6">
// 1.导入要用的BScroll
import BScroll from 'better-scroll';
import shopcart from 'components/shopcart/shopcart';
import cartcontrol from 'components/cartcontrol/cartcontrol';
import food from 'components/food/food';

const ERR_OK = 0;

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [], // 设置高度的区间值
      scrollY: 0, // y轴的初始值
      selectedFood: {}
    };
  },
  computed: {
    // 8.获取当前的索引
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        // 获得一个区间
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        // 返回这个区间对应的索引值(注意是个闭区间)
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          this._followScroll(i);
          return i;
        }
      }
      return 0;
    },
    // 通过计算属性检测数据food.count的变化
    selectFoods() {
      let foods = [];
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

    this.$http.get('/api/goods').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.goods = response.data;
        // 在修改数据之后立即使待 DOM 更新(调用原生DOM事件需要放在$nextTick())
        this.$nextTick(() => {
          // 初始化scroll
          this._initScroll();
          // 计算右侧的高度区间
          this._calculateHeight();
        });
      }
    });
  },
  methods: {
    // 点击左侧的菜单栏，传入index，和event
    selectMenu(index, event) {
      // 12.只有自定义事件才可以触发下边的事件。
      if (!event._constructed) {
        // pc上没有这个事件，所以直接返回。
        // event._constructed为BScroll派发的事件为true
        return;
      }
      // 获取DOM节点
      let foodList = this.$refs.foodList;
      let el = foodList[index];
      // 调用BScroll的方法（DOM，时间）
      this.foodsScroll.scrollToElement(el, 300);
    },
    // 点击右侧的商品栏
    selectFood(food, event) {
      if (!event._constructed) {
        return;
      }
      this.selectedFood = food;
      this.$refs.food.show();
    },
    addFood(target) {
      this._drop(target);
    },
    _drop(target) {
      // 体验优化,异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target);
      });
    },
    // 2.引用组件库new Bscroll(DOM,obj)
    _initScroll() {
      this.meunScroll = new BScroll(this.$refs.menuWrapper, {
        // 11.默认阻止默认事件。添加click: true
        click: true
      });

      // 6.添加一个属性probeType；3,能实时告诉我们位置
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        // 添加商品时触发click事件
        click: true,
        probeType: 3
      });

      // 7.通过监听可以到的滚动的位置
      this.foodsScroll.on('scroll', (pos) => {
        // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
        if (pos.y <= 0) {
          this.scrollY = Math.abs(Math.round(pos.y));
        }
      });
    },
    _calculateHeight() {
      // 3.获取所有的li标签
      let foodList = this.$refs.foodList;
      let height = 0;
      // 4.把第一个高度放入数组
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        // 5.获取每一个li标签的高度，添加到数组中
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    _followScroll(index) {
      let menuList = this.$refs.menuList;
      let el = menuList[index];
      this.meunScroll.scrollToElement(el, 300, 0, -100);
    }
  },
  components: {
    shopcart,
    cartcontrol,
    food
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
