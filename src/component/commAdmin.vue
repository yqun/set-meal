<template>
  <div class="comm-header">
    <i @click="$router.go(-1)" class="iconfont icon-jiantouarrowhead7"></i>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "commAdmin",
  props: ['go']
}
</script>

<style scoped>
.comm-header {
  height: 50px;
  line-height: 50px;
  background-color: #10AEFF;
}
.comm-header i {
  color: #fff;
  margin-left: 10px;
  font-size: 24px;
}
</style>
