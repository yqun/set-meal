<template>
  <div v-html="aliPayContent">
    <!-- v-html="aliPayContent" -->
    <!--{{aliPayContent}}-->
    <!--<a :href="toAddress" target="_blank">baidu</a>-->
  </div>
</template>

<script>
export default {
  name: "aliPay",
  data() {
    const aliPayContent = this.$route.query.form;
    // const subStr = aliPayContent.split('>')[0];
    // const str = 'action=';
    // const index = subStr.indexOf(str);
    // let toAddress = subStr.substr(index + str.length + 1, subStr.length - str.length - 43);
    // console.log(toAddress)
    return {
      aliPayContent,
    }
  },
  mounted() {
    this.$nextTick(() => {
      document.forms[0].submit();
    })
  },
}
</script>

<style scoped>

</style>
