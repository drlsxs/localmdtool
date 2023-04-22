<template>
  <div>
    <Header name="文档资源配置"/>
    <div class="content">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input size="small" v-model="ruleForm.name" placeholder="请输入名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="位置" prop="position">
          <el-input size="small" v-model="ruleForm.position" placeholder="请选择文档文件夹位置"
                    autocomplete="off"></el-input>
          <el-button size="small" class="choose" @click="change">选择</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="submitForm('ruleForm')">添加</el-button>
          <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header/index.vue";
import {convertToElementTreeData, filterElementTreeData} from "@/utils";

export default {
  name: "index",
  components: {
    Header
  },
  data() {
    return {
      ruleForm: {
        name: '',
        position: '',
      },
      rules: {
        name: [
          {trigger: 'blur'}
        ],
      }
    };
  },
  methods: {

    change() {
      window.ipcRenderer.send('electronApi');
      window.ipcRenderer.receive("fromMain", (event, [path, tree]) => {
        this.ruleForm.position = path[0];
      });
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let json = JSON.stringify(this.ruleForm);
          window.ipcRenderer.send("fileWrite", ["./config/dataSourceConfig.json", json]);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    //获取项目中数据资源的配置信息
    window.ipcRenderer.send("fileopen", "./config/dataSourceConfig.json");
    window.ipcRenderer.receive("filecont", (event, [json]) => {
      this.ruleForm = JSON.parse(json);
    });
  }
}
</script>

<style scoped lang="scss">
::v-deep {
  .el-form {
    margin-top: 13px;

    .el-form-item {
      width: 90%;
      margin-bottom: 10px;

      .choose {
        //float: right;
        margin-left: 20px;
        background: #383838;
        color: white;
        border: none;
      }

      .el-input {
        width: 77%;
      }

      .el-select {
        width: 100px;

        .el-input__inner {
          color: #C0C4CC;
        }
      }

      .el-form-item__label {
        color: #D3D3D3;
      }

      .el-input__inner {
        background: #383838;
        border: none;
        color: #C0C4CC;
      }
    }
  }
}

</style>