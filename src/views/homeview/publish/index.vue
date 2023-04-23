<template>
  <div>
    <Header name="发布"/>
  </div>
</template>

<script>
import Header from "@/components/Header/index.vue";
export default {
  name: "index",
  components:{
    Header
  },
  data() {
    return {
      queryString:{
        pageNum: 1,
        pageSize: 10,
        filename: '',
      }
    };
  },
  mounted() {
    window.ipcRenderer.send("getPages", this.queryString);
    window.ipcRenderer.receive("fromMain", (event, [data]) => {
      console.log(data, 124);
    });
  }
}
</script>

<style scoped>

</style>