<template>
  <div class="comm-body" :style="commBodyStyle">
    <!-- 返回导航 -->
    <comm-admin go="itemList"></comm-admin>
    <!-- 下拉框 -->
    <group :gutter="15">
      <x-input title="全部" placeholder="请选择站点"
               v-model="defaultValue"
               @click.native="siteShow=true"
               disabled text-align="right">
      </x-input>
      <!--<selector title="全部"-->
                <!--direction="ltr"-->
                <!--:options="list"-->
                <!--:value-map="['id', 'f_name']"-->
                <!--v-model="defaultValue"-->
                <!--@on-change="getdefaultValueSite()"-->
                <!--placeholder="请选择站点">-->
      <!--</selector>-->
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
          <div>{{item.f_month}}</div>
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
      <!--<x-button v-else-if="pagesize > ratio || pagesizeAll > ratio">数据全部加载完毕</x-button>-->
    </div>
    <!-- 选择站点弹框 -->
    <confirm v-model="siteShow" class="testCon" title="请选择站点" @on-confirm="getdefaultValueSite()">
      <Tree :data="siteData"
            ref="easyTree"
            @nodeExpand="onNodeExpand($event)"
            @nodeClick="nodeClick">
      </Tree>
      <p style="position: absolute;bottom: 50px;">
        <check-icon :value.sync="cascade" size="14">是否级联选择</check-icon>
      </p>
    </confirm>
  </div>
</template>

<script>
  export default {
    name: "monthlyReport",
    data() {
      return {
        siteShow: false,
        selection: {},
        siteData:[],
        cascade: false, // 是否级联

        tableConfig: false,
        list: [], // 所有站点
        defaultValue: '', // 选择的站点id
        pagesizeAll: 1, // 总数据分页
        pagesize: 1, // 站点数据分页
        f_order_count: 0, // 总的充电次数
        f_sum: 0, // 总的消费额度
        f_kwh: 0,
        dayinfo: [], // 月报信息
        ratio: 0, // 判断 数据是否还有

        commBodyStyle: {overflow: 'auto'}
      }
    },
    watch: {
      siteShow(newVal, oldVal) {
        if (newVal) {
          this.commBodyStyle.overflow = 'hidden';
        } else {
          this.commBodyStyle.overflow = 'auto';
        }
      }
    },
    created() {
      this.judgeToken();
      // this.getAllSite();
      this.getSiteInfo();
      this.getSiteNameAll();
    },
    methods: {
      // 判断token
      judgeToken() {
        this.token = window.sessionStorage.getItem('token');
      },
      getSiteNameAll() {
        this.$http.get(`${this.apiHost}leagueBuss/findScopeByPageTree.do?token=${this.token}`)
          .then(res => {
            this.siteData = res.data
          })
      },
      onNodeExpand(event) {
        let node = event;
        if (!node.children) {
          this.getNodes(node).then(data => {
            this.$set(node, "children", data);
          });
        }
      },
      async getNodes(node) {
        if (!node.state) return false;
        const res = await this.$http.get(`${this.apiHost}leagueBuss/findScopeByPageTree.do?token=${this.token}&id=${node.id}`)
        const data = res.data;
        return new Promise(resolve => {
          if (!node) return false;
          resolve(data);
        });
      },
      nodeClick(node) {
        this.selection = node;
        if (!node.state) return false; // this.$refs.easyTree.selectNode()
        node.state=='closed'?node.state='open':node.state='closed';
        this.onNodeExpand(node)
      },
      // 获取所有站点名称
      getAllSite() {
        this.$http.get(`${this.apiHost}chargeStation/weixin/wxFindCurrentStationList.do?token=${this.token}`)
          .then(res => {
            const {rows, state} = res.data;
            if (state === true) {
              this.list = rows
            }
          })
      },
      // 获取所有站点信息
      getSiteInfo() {
        this.$http
          .get(`${this.apiHost}Order/weixin/wxMonthlyReport.do?token=${this.token}&page=${this.pagesizeAll}&rows=10`)
          .then(res => {
            // console.log(res)
            const {f_order_count, f_sum, state, rows, total,f_kwh} = res.data
            if (rows.length) {
              this.f_order_count = f_order_count
              this.f_sum = f_sum.toFixed(2)
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
        console.log(this.selection)
        const {id, rid, type, text} = this.selection;
        this.defaultValue = text;

        this.dayinfo = [];
        this.pagesize = 1;
        this.pagesizeAll = 1;
        this.$http
          .get(`${this.apiHost}Order/weixin/wxMonthlyReport.do?token=${this.token}&id=${rid}&type=${type}&cascade=${this.cascade}&page=${this.pagesize}&rows=10`)
          .then(res => {
            console.log(res);
            const {rows, total, f_order_count, f_sum, f_kwh} = res.data
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
        const {id, rid, type, text} = this.selection;
        this.$http
          .get(`${this.apiHost}Order/weixin/wxMonthlyReport.do?token=${this.token}&id=${rid}&type=${type}&cascade=${this.cascade}&page=${this.pagesize}&rows=10`)
          .then(res => {
            // console.log(res);
            const {rows, total} = res.data;
            // 判断数据是否还有
            this.ratio = Math.ceil(total / 10);
            rows.forEach(item => {
              item.sum = (item.sum*1).toFixed(2);
              item.minute = (item.minute*1).toFixed(2);
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
/**/
.comm-body {
  width: 100%;
  height: 100%;
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
  width: 27%;
  float: left;
  text-align: center;
  font-size: 14px;
}
.tableinfo li > div:nth-child(1) {
  width: 19%;
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

.testCon /deep/ .weui-dialog__bd{
  height: 400px;
  overflow: auto;
  text-align: left;
  padding-bottom: 1.6em;
}
.testCon /deep/ .weui-dialog__bd .tree{
  height: 100%;
  overflow: auto;
}
</style>
