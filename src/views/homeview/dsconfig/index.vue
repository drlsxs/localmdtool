<template>
  <div>
    <Header name="文档资源配置"/>
    <div class="content">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input size="small"  type="password" v-model="ruleForm.name" placeholder="请输入名称"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="位置" prop="position">
          <el-input size="small"  v-model="ruleForm.position" placeholder="请选择文档文件夹位置"  autocomplete="off"></el-input>
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
      ruleForm: {
        name: '',
        position: '',
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
          alert('submit!');
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
      }
    }
  }
}

</style>