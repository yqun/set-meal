<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
html, body, #app {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
body {
  background-color: #fff;
}
</style>
