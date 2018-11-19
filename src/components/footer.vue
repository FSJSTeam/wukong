<template>
  <footer class="wk-footer">
    中科天齐-Copyright @ 2018 宁波中科天齐信息技术有限公司
  </footer>
</template>

<script>
export default {
  name: 'WkFooter'
}
</script>

<style lang="scss" scoped>
@import "~static/styles/common";

.wk-footer {
  // position: fixed;
  // right: 0;
  // bottom: 0;
  // left: 0;
  float: left;
  z-index: 6;
  width: 100%;
  height: $footerHeight;
  line-height: $footerHeight;
  text-align: center;
  font-size: 16px ;
  color: #333;
  background-color: #edf0f5 ;
  border-top: 1px solid #c8d3e6;
}
</style>
