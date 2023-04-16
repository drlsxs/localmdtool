<template>
  <div class="header">
    {{name}}
  </div>
</template>

<script>
export default {
  name: "index",
  props:{
    name:{
      type:String,
      default: '配置',
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  height: 30px;
  background: #383838;
  text-align: center;
  line-height: 30px;
  color: #D3D3D3;
}

</style>