<template>
  <div class="comm-body">
    <!-- 返回导航 -->
    <comm-admin go="itemList"></comm-admin>
    <!-- 下拉框 -->
    <group>
      <selector title="全部"
                direction="ltr"
                :options="list"
                v-model="defaultValue"
                @on-change="getdefaultValueSite()"
                placeholder="请选择站点">
      </selector>
    </group>
    <div style="margin-top: 10px;">
      <ul class="tableinfo">
        <li class="clearfix">
          <span>充电 <strong style="color: orange">{{f_order_count || 0}}</strong> 次</span>
          <span>总消费 <strong style="color: green">{{f_sum}}</strong> 元</span>
          <span>耗电 <strong style="color: orange">0</strong> 度</span>
        </li>
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
            <span>0</span>
          </div>
          <div>
            <span>{{item.sum}}</span>
            <span>0</span>
          </div>
        </li>
      </ul>
      <!-- 点击更多 按钮 -->
      <x-button @click.native="onScrollBottom()" v-if="pagesize <= ratio && pagesizeAll <= ratio">点击加载更多</x-button>
      <x-button v-else-if="pagesize > ratio || pagesizeAll > ratio">数据全部加载完毕</x-button>
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
            rows.forEach(item => {
              this.list.push(
                {key: item.id, value: item.f_name}
              )
            })
          }
        })
    },
    // 获取所有站点信息
    getSiteInfo() {
      this.$http
        .get(`${this.apiHost}Order/weixin/wxDailyReport.do?token=${this.token}&page=${this.pagesizeAll}&rows=10`)
        .then(res => {
          const {f_order_count, f_sum, state, rows, total} = res.data
          if (rows.length > 0) {
            this.f_order_count = f_order_count
            this.f_sum = (f_sum*1).toFixed(2)
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
      this.$http
        .get(`${this.apiHost}Order/weixin/wxDailyReport.do?token=${this.token}&f_chargeStation_id=${this.defaultValue}&page=${this.pagesize}&rows=10`)
        .then(res => {
          const {rows, total,f_order_count,f_sum} = res.data
          this.f_order_count = f_order_count*1
          this.f_sum = (f_sum*1).toFixed(2)
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
    }
  }
}
</script>

<style scoped>
/*清除浮动*/
.clearfix::before, .clearfix::after {
  content:"";
  display: block;
  overflow: hidden;
  height: 0;
}
.clearfix::after {
  clear: both;
}
/**/
.comm-body {
  width: 100%;
  height: 100%;
  /*background-color: #efefef*/
}
.tableinfo {
  border-top: 1px solid #dfdfdf;
  background-color: #fff;
}
.tableinfo li {
  border-bottom: 1px solid #dfdfdf;
  padding: 4px 0;
}
.tableinfo li > span {
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
</style>
