<template>
  <el-menu
      default-active="/dbconfig"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      router
      @close="handleClose">
    <el-menu-item index="/dbconfig" >
      <i class="el-icon-s-data"></i>
      <span slot="title">数据库配置</span>
    </el-menu-item>
    <el-menu-item index="/dsconfig">
      <i class="el-icon-document"></i>
      <span slot="title">文档资源位置</span>
    </el-menu-item>
    <el-menu-item index="/storage">
      <i class="el-icon-coin"></i>
      <span slot="title">数据入库</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="el-icon-position"></i>
      <span slot="title">文章发布</span>
    </el-menu-item>
    <el-menu-item index="/setting">
      <i class="el-icon-setting"></i>
      <span slot="title">系统设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "Menu",
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped lang="scss">
.el-menu {
  border-right: 1px solid transparent;
}

</style>