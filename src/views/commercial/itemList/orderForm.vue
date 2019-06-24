<template>
  <div @touchmove.prevent>
    <scroller lock-x>
      <div>
        <h2>
          订单管理
          <!--<a class="export" @click="confirmShow = true" download href="javascript:;">导出</a>-->
        </h2>
        <ul>
          <li v-for="item in rows" :key="item.id">
            <h3><p>订单金额</p><span style="color: green;">{{item.f_sum || 0}}</span></h3>
            <div class="contentitem clearfix">
              <div style="width: 67%; float: left"><p>开始时间</p><span style="color: green;">{{item.f_start_time}}</span></div>
              <div style="width: 32%; float: right" v-if="item.f_order_type == 1"><p>订单类型</p><span style="color: orange;">充电</span></div>
              <div style="width: 32%; float: right" v-else-if="item.f_order_type == 2"><p>订单类型</p><span style="font-weight: 700;">充值</span></div>
              <div style="width: 32%; float: right" v-else-if="item.f_order_type == 3"><p>订单类型</p><span style="color: red;">退款</span></div>
              <div style="width: 67%; float: left"><p>结束时间</p><span style="color: orange;">{{item.f_end_time}}</span></div>
              <div style="width: 32%; float: right" v-if="item.f_checked == true"><p>是否结算</p><span style="color: green;">是</span></div>
              <div style="width: 32%; float: right" v-else-if="item.f_checked !== true"><p>是否结算</p><span style="color: red;">否</span></div>
            </div>
          </li>
        </ul>
        <x-button @click.native="onScrollBottom()" v-if="pagesize <= ratio">点击加载更多</x-button>
        <!--<x-button v-else-if="pagesize > ratio">数据全部加载完毕</x-button>-->
      </div>
    </scroller>


    <confirm v-model="confirmShow" :show-cancel-button="false" title="选择时间" @on-confirm="sendTime">
      <group :gutter="8">
        <datetime v-model="startTime" title="开始时间"></datetime>
        <datetime v-model="endTime" title="结束时间"></datetime>
      </group>
    </confirm>
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
        ratio: 0,

        confirmShow: false,
        startTime: '',
        endTime: '',
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
        this.$http.get(`${this.apiHost}Order/weixin/wxFindCurrentOrders.do?token=${this.token}&page=${this.pagesize}&rows=10`)
          .then(res => {
            const {rows, total} = res.data
            if (rows.length) {
              this.ratio = Math.ceil(total / 10)
              rows.forEach(item => {
                this.rows.push(item);
              })
              this.pagesize++
            }
          })
      },
      //点击弹框确认按钮
      sendTime() {
        // window.event.returnValue = false;
        window.location.hash = `platform/Order/wxExportOrders.do?token=${this.token}&f_start_date=${this.startTime}&f_end_date=${this.endTime}`
        const href = window.location.href.replace('#/', '')
        window.location.href = href.replace('ms/', '')
        // console.log(window.location.href)
        // alert(window.location)
        // `${this.apiHost}Order/wxExportOrders.do?token=${this.token}&f_start_date=${this.startTime}&f_end_date=${this.endTime}`
        // console.log(this.startTime, this.endTime)
        // console.log(window.location)
      },
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
  line-height: 2rem;
  height: 2rem;
  font-size:14px;
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
.export {
  height: 24px;
  line-height: 24px;
  margin-top: 8px;
  float: right;
  font-size: 12px;
  display: inline-block;
  padding: 0px 6px;
  background-color: #fff;
  border-radius: 5px;
}
</style>
