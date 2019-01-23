<template>
  <div @touchmove.prevent>
    <scroller lock-x>
      <div>
        <h2>充值订单</h2>
        <ul>
          <li v-for="item in rows"
              :key="item.id">
            <h3><p>充值金额</p><span>{{item.f_sum}}元</span></h3>
            <div class="contentitem clearfix">
              <div style="width: 67%; float: left"><p>充值时间</p><span>{{item.f_start_time}}</span></div>
              <div style="width: 32%; float: right"><p>赠送金额</p><span>{{item.f_added_sum || 0}}元</span></div>
            </div>
          </li>
        </ul>
        <x-button @click.native="onScrollBottom()" v-if="pagesize <= ratio">点击加载更多</x-button>
        <x-button v-else-if="pagesize > ratio">数据全部加载完毕</x-button>
      </div>
    </scroller>
  </div>
</template>

<script>
  export default {
    name: "expense",
    data () {
      return {
        rows: [],
        token: '',
        pagesize: 1,
        showPositionValue: false,
        massage: '数据全部加载完毕',
        ratio: 0
      }
    },
    created () {
      this.judgeToken();
      this.getIndent();
    },
    // 拿token
    methods: {
      judgeToken() {
        this.token = window.sessionStorage.getItem('token');
      },
      onScrollBottom () {
        this.getIndent()
      },
      getIndent () {
        this.$http.get(this.apiHost + `Order/weixin/findOrderByMember.do?token=${this.token}&f_order_type=2&page=${this.pagesize}&rows=10`)
          .then(res => {
            const {rows, total} = res.data
            this.ratio = Math.ceil(total / 10)
            rows.forEach(item => {
              item.f_sum = item.f_sum.toFixed(2)
              this.rows.push(item);
            })
            this.pagesize++
          })
      }
    }
  }
</script>

<style scoped>
  .clearfix::before, .clearfix::after {
    content:"";
    display: table;
    overflow: hidden;
    height: 0;
  }
  .clearfix::after {
    clear: both;
  }
  ul > li {
    list-style: none;
    padding-bottom: 5px;
  }
  ul {
    width: 100%;
  }
  ul>li {
    margin:0 20px;
    background-color: #fff;
    border-bottom: 1px solid #efefef;
  }
  h2 {
    background-color: #eee;
    padding: 0 10px;
    border-bottom: 2px double black;
  }
  ul > li > h3 {
    line-height: 2rem;
    height: 2rem;
    font-size: 1rem;
    font-weight: 400;
  }
  ul > li > h3 p {
    float: left;
  }
  ul > li > h3 span {
    float: right;
  }
  .contentitem > div {
    color: #999;
    font-size: 0.7rem;
    height: 1rem;
    line-height: 1rem;
    float: left;
  }
  .contentitem > div p {
    float: left;
  }
  .contentitem > div span {
    float: right;
    margin-right: 20px;
  }
  .contentitem > div:nth-child(2n) span {
    float: right;
    margin-right: 0px;
  }
  button {
    width: 100%;
    background-color: transparent;
    font-size: 16px;
  }
  .weui-btn:after {
    border: none;
  }
  .weui-btn_default:not(.weui-btn_disabled):active {
    background-color: transparent;
  }
</style>

