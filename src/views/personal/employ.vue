<template>
  <div>
    <form-preview header-label="正在使用"
                  header-value="11"
                  :body-items="list">
    </form-preview>
  </div>
</template>

<script>
  export default {
    name: "enshrine",
    data () {
      return {
        list: [{
          label: '商品',
          value: '电动打蛋机'
        }, {
          label: '标题标题',
          value: '名字名字名字'
        }, {
          label: '标题标题',
          value: '很长很长的名字很长很长的名字很长很长的名字很长很长的名字很长很长的名字'
        }]
      }
    },
    methods: {

    }
  }
</script>

<style scoped>

</style>
