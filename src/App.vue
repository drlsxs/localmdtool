<template>
  <div id="app">
    <router-view/>
  </div>
</template>


<script>
export default {
  mounted() {
    window.ipcRenderer.send("appMounted");
  }
}
</script>

<style lang="scss">

</style>
