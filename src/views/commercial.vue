<template>
  <div class="comm-body" @touchmove.prevent>
    <!-- 返回导航 -->
    <comm-admin go="/personal"></comm-admin>
    <group title="" gutter="0">
      <cell title="站点管理" link="/siteAdmin"></cell>
      <cell title="电桩管理" link="/chargAdmin"></cell>
      <cell title="收费方式"></cell> <!-- link="/chargeWay" -->
      <cell title="提现记录" link="/itemList"></cell>
      <cell title="注册电桩" link="/register/0"></cell>
    </group>
  </div>
</template>

<script>
export default {
  name: "commercial",
  data() {
    return {
      token: ''
    }
  },
  created() {
    this.judgeToken();
  },
  methods: {
    // 判断token
    judgeToken() {
      this.token = window.sessionStorage.getItem('token');
    },
  }
}
</script>

<style scoped>
.comm-body {
  width: 100%;
  height: 100%;
  background-color: #efefef;
}
/* cell */
/deep/ .weui-cells {
  font-size: 16px;
}
</style>
