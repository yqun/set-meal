<template>
  <div class="comm-body" @touchmove.prevent>
    <!-- 返回导航 -->
    <comm-admin go="commercial"></comm-admin>
    <!-- 搜索框 -->
    <div class="search"><input type="text" v-model="searchValue" placeholder="搜索"></div>
    <!-- 内容 -->
    <div class="content">
      <p><x-button type="primary" mini>添加费率</x-button></p>
      <ul class="container">
        <li>
          <div>
            一元两小时
            <x-button type="warn" mini>删除</x-button>
            <x-button type="primary" mini>修改</x-button>
          </div>
          <span>北京市海淀区至高美术馆</span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
  export default {
    name: "siteAdmin",
    data() {
      return {
        searchValue: ''
      }
    }
  }
</script>

<style scoped>
.comm-body {
  width: 100%;
  height: 100%;
  background-color: #efefef;
}
.search {
  padding: 5px 10px;
  border-bottom: 1px solid #dfdfdf;
}
.search input {
  width: 100%;
  height: 24px;
  border-radius: 3px;
  background-color: #fff;
  border: none;
  outline: none;
  text-align: center;
  line-height: 20px;
  font-size: 14px;
}
.content {
  margin-top: 10px;
  padding-left: 10px;
  background-color: #fff;
  /*height: 400px;*/
  /*height: 100%;*/
}
.content > p {
  padding: 10px 0;
  border-bottom: 1px solid #efefef;
}
.container li {
  padding: 10px 10px 10px 0;
  border-bottom: 1px solid #efefef;
}
.container li > div {
  /*font-weight: 400;*/
  font-size: 18px;
  color: #333;
}
.container li > div button {
  float: right;
  margin-left: 5px;
}
.weui-btn + .weui-btn {
  margin-top: 0;
}
.container li > span {
  display: block;
  width: 100%;
  margin-top: 4px;
  font-size: 14px;
  color: #aaa;
}
</style>
