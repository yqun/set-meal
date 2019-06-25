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
h2 {
  height: 40px;
  line-height: 40px;
  font-weight: 400;
  font-size: 16px;
  color: #39bafc;
  padding: 0 20px;
  position: relative;
}
h2::before {
  content: '';
  display: block;
  width: 2px;
  height: 16px;
  background-color: #39bafc;
  position: absolute;
  top: 12px;
  left: 10px;
}
ul {
  box-sizing: border-box;
  padding: 0 10px;
}
ul > li {
  list-style: none;
  background-color: #fff;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  box-shadow: 0px 0px 4px 0px rgba(207,227,228,1);
}
ul > li > h3 {
  line-height: 32px;
  height: 32px;
  font-size: 16px;
  font-weight: 400;
  position: relative;
}
ul > li > h3 p {
  float: left;
}
ul > li > h3 span {
  color: orange;
  float: right;
}
ul > li > h3 i {
  display: block;
  float: right;
  font-style: normal;
  font-size: 12px;
  line-height: 1rem;
  /*border: 1px solid #ccc;*/
  border-radius: 5px;
  background-color: red;
  color: #fff;
  padding: 2px 4px;
  position: relative;
  top: 5px;
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

