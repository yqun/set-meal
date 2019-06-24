<template>
  <div class="comm-body">
    <!-- 返回导航 -->
    <comm-admin go="itemList"></comm-admin>
    <!-- 下拉框 -->
    <group :gutter="15">
      <selector title="全部"
                direction="ltr"
                :options="list"
                :value-map="['id', 'f_name']"
                v-model="defaultValue"
                @on-change="getdefaultValueSite()"
                placeholder="请选择站点">
      </selector>
    </group>
    <div>
      <div class="clearfix totalSum">
        <span>充电 <strong style="color: orange">{{f_order_count || 0}}</strong> 次</span>
        <span>总消费 <strong style="color: green">{{f_sum || 0}}</strong> 元</span>
        <span>耗电 <strong style="color: orange">{{f_kwh || 0}}</strong> 度</span>
      </div>
      <ul class="tableinfo">
        <li class="clearfix">
          <div>日期</div>
          <div>
            <span>充电次数</span>
            <span>活跃用户</span>
          </div>
          <div>
            <span>平均时长</span>
            <span>平均功率</span>
          </div>
          <div>
            <span>消费总额</span>
            <span>消耗电量</span>
          </div>
        </li>
        <li class="clearfix" v-for="(item,index) in dayinfo" :key="index">
          <div>{{item.f_date}}</div>
          <div>
            <span>{{item.ordercount}}</span>
            <span>{{item.usercount}}</span>
          </div>
          <div>
            <span>{{item.minute}}</span>
            <span>{{(item.power*1).toFixed(2)}}</span>
          </div>
          <div>
            <span>{{item.sum}}</span>
            <span>{{(item.kwh*1).toFixed(2)}}</span>
          </div>
        </li>
        <li v-if="dayinfo.length == 0" style="text-align: center;">数据为空</li>
      </ul>
      <!-- 点击更多 按钮 -->
      <x-button @click.native="onScrollBottom()" v-if="pagesize <= ratio && pagesizeAll <= ratio">点击加载更多</x-button>
      <!--<x-button v-else-if="pagesize > ratio || pagesizeAll > ratio"></x-button>-->
    </div>
  </div>
</template>

<script>

export default {
  name: "dailyReport",
  data() {
    return {
      tableConfig: false,
      list: [], // 所有站点
      defaultValue: '', // 选择的站点id
      pagesizeAll: 1, // 总数据分页
      pagesize: 1, // 站点数据分页
      f_order_count: 0, // 总的充电次数
      f_sum: 0, // 总的消费额度
      f_kwh: 0,
      dayinfo: [], // 日报信息
      ratio: 0, // 判断 数据是否还有
    }
  },
  created() {
    this.judgeToken()
    this.getAllSite()
    this.getSiteInfo()
  },
  methods: {
    // 判断token
    judgeToken() {
      this.token = window.sessionStorage.getItem('token');
    },
    // 获取所有站点名称
    getAllSite() {
      this.$http
        .get(`${this.apiHost}chargeStation/weixin/wxFindCurrentStationList.do?token=${this.token}`)
        .then(res => {
          const {rows, state} = res.data
          if (state === true) {
            this.list = rows
          }
        })
    },
    // 获取所有站点信息
    getSiteInfo() {
      this.$http
        .get(`${this.apiHost}Order/weixin/wxDailyReport.do?token=${this.token}&page=${this.pagesizeAll}&rows=10`)
        .then(res => {
          // console.log(res)
          const {f_order_count, f_sum, state, rows, total,f_kwh} = res.data
          if (rows.length > 0) {
            this.f_order_count = f_order_count
            this.f_sum = (f_sum*1).toFixed(2)
            this.f_kwh = (f_kwh*1).toFixed(2)
            // 判断数据是否还有
            this.ratio = Math.ceil(total / 10)
            rows.forEach(item => {
              item.sum = (item.sum*1).toFixed(2)
              item.minute = (item.minute*1).toFixed(2)
              this.dayinfo.push(item);
            })
            this.pagesizeAll++
          }
        })
    },
    // 选择站点  清空渲染的数据
    getdefaultValueSite() {
      this.dayinfo = []
      this.pagesize = 1
      this.pagesizeAll = 1
      this.$http
        .get(`${this.apiHost}Order/weixin/wxDailyReport.do?token=${this.token}&f_chargeStation_id=${this.defaultValue}&page=${this.pagesize}&rows=10`)
        .then(res => {
          // console.log(res)
          const {rows, total,f_order_count,f_sum, f_kwh} = res.data
          this.f_order_count = f_order_count*1
          this.f_sum = (f_sum*1).toFixed(2)
          this.f_kwh = (f_kwh*1).toFixed(2)
          // 判断数据是否还有
          this.ratio = Math.ceil(total / 10)
          // 判断  数据是否存在
          if (rows.length) {
            rows.forEach(item => {
              item.sum = (item.sum*1).toFixed(2)
              item.minute = (item.minute*1).toFixed(2)
              this.dayinfo.push(item)
            })
          }
          this.pagesize++
        })
    },
    // 根据 选择的站点id 点击分页 获取 站点信息
    getPageSite() {
      this.$http
        .get(`${this.apiHost}Order/weixin/wxDailyReport.do?token=${this.token}&f_chargeStation_id=${this.defaultValue}&page=${this.pagesize}&rows=10`)
        .then(res => {
          const {rows, total} = res.data
          // 判断数据是否还有
          this.ratio = Math.ceil(total / 10)
          rows.forEach(item => {
            item.sum = (item.sum*1).toFixed(2)
            item.minute = (item.minute*1).toFixed(2)
            this.dayinfo.push(item);
          })
          this.pagesize++
        })
    },
    // 点击加载更多
    onScrollBottom() {
      if (this.defaultValue) {
        this.getPageSite()
      } else {
        this.getSiteInfo()
      }
    },

  }
}
</script>

<style scoped>
/**/
.comm-body {
  width: 100%;
  height: 100%;
  /*background-color: #efefef*/
}
.totalSum {
  height: 40px;
  line-height: 40px;
}
.tableinfo li {
  background-color: #fff;
  border-bottom: 1px solid #dfdfdf;
  padding: 4px 0;
}
.tableinfo li > span,
.totalSum > span {
  display: block;
  float: left;
  width: 33.33%;
  text-align: center;
  font-size: 14px;
}
.tableinfo li > div {
  width: 25%;
  float: left;
  text-align: center;
  font-size: 14px;
}
.tableinfo li > div:nth-child(1) {
  line-height: 45px;
}
.tableinfo li > div > span {
  display: block;
}
/* 按钮 */
button {
  width: 100%;
  background-color: #fff;
  font-size: 16px;
}
.weui-btn:after {
  border: none;
}
.weui-btn_default:not(.weui-btn_disabled):active {
  background-color: transparent;
}
/**/
.vux-x-icon {
  fill: #fff;
  float: right;
  position: relative;
  right: 10px;
  top: 12px;
}
i.confirm {
  float: right;
  position: relative;
  right: 20px;
}
i.confirm::after,
i.confirm::before {
  content: '';
  display: inline-block;
  width: 2px;
  height: 16px;
  background-color: #fff;
  position: absolute;
}
i.confirm::before {
  width: 16px;
  height: 2px;
  top: 24px;
  left: -10px;
}
i.confirm::after {
  top: 17px;
  left: -3px;
}
</style>
