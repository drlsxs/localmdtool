<template>
  <div>
    <Header name="数据库配置"/>
    <div class="content">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="数据库类型" prop="dbType">
          <el-select size="small"  v-model="ruleForm.dbType">
            <el-option
                v-for="item in dbOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input size="small"  type="password" v-model="ruleForm.name" placeholder="请输入名称"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据库名称" prop="dbName">
          <el-input size="small"  v-model="ruleForm.dbName" placeholder="请输入数据库名称"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="主机" prop="host">
          <el-input size="small"  v-model="ruleForm.host" placeholder="请输入主机ip"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input size="small"  v-model="ruleForm.port" placeholder="请输入端口"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input size="small"  v-model="ruleForm.username" placeholder="请输入用户名"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input size="small"  v-model="ruleForm.password" placeholder="请输入密码"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small"  type="primary" @click="submitForm('ruleForm')">添加</el-button>
          <el-button size="small"  @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
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
      dbOption: [
        {
          value: 'mysql',
          label: 'mysql'
        }
      ],
      ruleForm: {
        name: "",
        host: "",
        port: '',
        username: '',
        password: "",
        dbType: 'mysql',
        dbName: "",
      },
      rules: {
        name: [
          { trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          window.ipcRenderer.send("toMain",this.ruleForm);
          window.ipcRenderer.receive('fromMain', (event, args) => {
            if (args == 'Database connected success') {
              alert('数据库连接成功');
              this.ruleForm = {};
            } else {
              alert('数据库连接失败');
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep{
  .el-form{
    margin-top: 13px;
    .el-form-item{
      width: 90%;
      margin-bottom: 10px;
      .el-select{
        width: 100px;
        .el-input__inner {
          color: #C0C4CC;
        }
      }
      .el-form-item__label{
        color: #D3D3D3;
      }
      .el-input__inner{
        background: #383838;
        border: none;
        color: #D3D3D3;
      }
    }
  }
}

</style>