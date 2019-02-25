<template>
  <div class="comm-body">
    <!-- 返回导航 -->
    <comm-admin go="commercial"></comm-admin>
    <div class="addSite clearfix">
      <x-button type="primary" mini link="/addSite/0">新增</x-button>
    </div>
    <ul class="container">
      <li v-if="siteList.length === 0" style="border-bottom: none; text-align: center;">数据为空</li>
      <li class="clearfix"
          v-else
          v-for="(item) in siteList" :key="item.id">
        <div>
          {{item.f_name}}
          <p>
            闲:<i style="color: green">{{item.f_work_state_1}}个</i>
            充:<i style="color: orange">{{item.f_work_state_2}}个</i>
            坏:<i style="color: red">{{item.f_work_state_4}}个</i>
          </p>
        </div>
        <div>
          <span>
            充电总额: <strong style="color: orange">{{item.sum || 0}}</strong>
            日均充电额: <strong style="color: green">{{item.dailySum || 0}}</strong>
            充电总次数: <strong style="color: orange">{{item.orderCount || 0}}</strong>
          </span>
          <div class="clearfix container-btn">
            <x-button type="primary" mini @click.native="downLine(item.id)">编辑</x-button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "siteAdmin",
    data() {
      return {
        startTime: 'TODAY', // 选择的日期
        endTime: 'TODAY', // 选择的日期
        defaultValue: '', // 选择的站点
        token: '',
        siteList: [], // 渲染的数据
      }
    },
    created () {
      this.judgeToken();
      this.getAllSite()
    },
    methods: {
      // 判断token
      judgeToken() {
        this.token = window.sessionStorage.getItem('token');
      },
      // 获取所有站点
      getAllSite() {
        this.$http
          .get(`${this.apiHost}chargeStation/weixin/wxFindCurrenStations.do?token=${this.token}`)
          .then(res => {
            const {state, rows} = res.data
            if (state == true) {
              rows.forEach(item => {
                if (item.dailySum) {
                  item.sum = item.sum.toFixed(2)
                  item.dailySum = item.dailySum.toFixed(2)
                }
              })
              this.siteList = rows
            }
          })
      },
      downLine (id) {
        this.$router.push(`/addSite/${id}`)
      },
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
.comm-body {
  width: 100%;
  height: 100%;
  background-color: #efefef
}
.addSite {
  background-color: #fff;
  border-bottom: 1px solid #ccc;
}
.addSite button {
  float: right;
  margin: 10px 10px;
}
.container {
  padding: 0 0 0 10px;
  background-color: #fff;
}
.container div button {
  float: right;
  margin-left: 10px;
}
.weui-btn + .weui-btn {
  margin-top: 0;
}
.container li {
  padding: 10px 10px 10px 0;
  border-bottom: 1px solid #dfdfdf;
}
.container li > div {
  box-sizing: border-box;
  font-size: 18px;
}
.container li span {
  display: block;
  font-size: 14px;
  color: #aaa;
  margin-top: 10px;
  float: left;
  width: 65%;
}
.container li p{
  float: right;
}
.container li p i {
  font-style: normal;
}
.container strong {
  font-weight: 400;
  margin-right: 5px;
}
.container .container-btn {
  float: left;
  width: 35%;
  margin-top: 10px;
}
</style>
