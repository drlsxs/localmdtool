<template>
  <div>
    <Header name="发布"/>
    <div class="content">
      <el-form inline :model="queryString" class="demo-form-inline">
        <el-input @keydown.enter.native="handlePage" size="small" v-model="queryString.filename"  :placeholder="'请输入文章名称'"></el-input>
        <el-button size="small"  type="primary" style="margin-left: 10px;" @click="handlePage">搜索</el-button>
        <el-button size="small"  type="info" style="margin-left: 10px;" @click="handlePublish">发布</el-button>
      </el-form>
      <el-table
          :data="tableData"
          style="width: 100%"
          max-height="400"
          @row-click="handleRow"
          @selection-change="handleSelectionChange"
      >
        <el-table-column
            type="selection"
            fixed
            width="55">
        </el-table-column>
        <el-table-column
            prop="filename"
            label="文件名"
            width="150">
        </el-table-column>
        <el-table-column
            prop="size"
            label="大小"
            width="80">
        </el-table-column>
        <el-table-column
            prop="type"
            label="平台"
            width="150">
        </el-table-column>
        <el-table-column
            prop="mtime"
            label="修改时间"
            :formatter="formatTime"
            width="150"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header/index.vue";
import {DateUtils} from "@/utils";

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
      },
      tableData: [],
      multipleSelection: [],
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    formatTime(row, column, cellValue, index) {
      return DateUtils().Date2Str(row.mtime);
    },
    handlePage() {
      window.ipcRenderer.send("getPages", this.queryString);
      window.ipcRenderer.receive("fromMain", (event, [data]) => {
        console.log(data.list);
        this.tableData = data.list;
      });
    },
    handleRow(row) {
    },
    handlePublish() {
      let pageIds = this.multipleSelection.map(it => it.id);
      window.ipcRenderer.send("publish",{pageIds, plat_id: 1});
      this.$message.success("文章批量发布成功");
    },
  },
  mounted() {
    this.handlePage();
  }
}
</script>

<style scoped lang="scss">
.content {
  padding: 5px !important;
  ::v-deep{
    .el-input {
      width: 40%;
    }
    .el-form{
      padding: 10px 0;
    }
    .el-table--scrollable-y .el-table__body-wrapper {
      /* 设置滚动条的宽度和背景颜色 */
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
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
  }
}

</style>