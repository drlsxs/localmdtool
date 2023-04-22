<template>
  <div>
    <Header name="数据储存"/>
    <div class="content">
      <el-container>
        <el-aside width="200px">
          <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="树形" name="first">
              <el-tree
                  icon-class="el-icon-arrow-right"
                  :data="dictoryTree" node-key="path" @node-click="handleNodeClick">
              </el-tree>
            </el-tab-pane>
            <el-tab-pane label="列表" name="second">配置管理</el-tab-pane>
          </el-tabs>
        </el-aside>
        <el-main>
          <div class="markdown-body js_md_content" ref="cont"></div>
          <el-button size="small" class="ruku" type="primary"  @click="saveToDB">入库</el-button>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header/index.vue";
import {mapState} from "vuex";
import {convertToElementTreeData, filterElementTreeData} from "@/utils";
const marked = require("marked");
export default {
  name: "index",
  components:{
    Header
  },
  computed: {
    ...mapState(["dictoryTree"])
  },
  data() {
    return {
      activeName: 'first',
      currNode: {}, //当前节点
    };
  },
  methods: {
    saveToDB() {
      // console.log(this.currNode);
      window.ipcRenderer.send("fileSave", this.currNode);
    },
    handleClick(tab, event) {
      console.log(this.dictoryTree)
    },
    handleNodeClick(node) {
      this.currNode = node;
      const filePath = node.path;
      if (filePath !== undefined) {
        window.ipcRenderer.send("fileopen", filePath);
        window.ipcRenderer.receive("filecont", (event, [content]) => {
          const html = marked.parse(content);
          this.$refs.cont.innerHTML = html;
        });
      }
    }
  },
  mounted() {
    window.ipcRenderer.send("pathTree");
    // window.ipcRenderer.send("fileSave");
    window.ipcRenderer.receive("treeInfo", (event, [path, tree]) => {
      let index = path.lastIndexOf("\\");
      let paths = path.slice(0, index);
      let elementTree = convertToElementTreeData(tree, paths);
      elementTree = filterElementTreeData(elementTree);
      this.$store.commit('setdictoryTree', elementTree.children);
    });
  }
}
</script>

<style scoped lang="scss">
.content{
  padding: 0 !important;
  height: calc(100% - 30px) !important;
  border-bottom: 1px solid #d3d3d3;
  ::v-deep{
    .el-aside{
      overflow: hidden;
      .el-tabs {
        height: 100%;
      }
    }
    .el-main {
      padding: 0;
      position: relative;
      .ruku{
        position: absolute;
        bottom: 20px;
        right: 20px;
      }
      /* 设置滚动条的宽度和背景颜色 */
      &::-webkit-scrollbar {
        width: 5px;
        background-color: #f5f5f5;
      }

      /* 设置滚动条滑块的背景颜色和圆角 */
      &::-webkit-scrollbar-thumb {
        background-color: #999;
        border-radius: 10px;
      }

      /* 设置滚动条滑块在 hover 状态下的背景颜色 */
      &::-webkit-scrollbar-thumb:hover {
        background-color: #555;
      }
    }
    .el-tree{
      height: 466px;
      overflow: auto;
      &::-webkit-scrollbar{
        display: none;
      }
    }
  }
  ::v-deep{
    .markdown-body pre{
      &::-webkit-scrollbar{
        display: none;
      }
    }
    .markdown-body pre code, .markdown-body pre tt {
      display: inline-block;
      &::-webkit-scrollbar{
        display: none;
      }
    }
  }
  .markdown-body{
    padding: 5px;
    height: 98%;
  }
}

</style>