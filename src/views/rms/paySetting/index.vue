<template>
   
  <div class="app-container">
    <el-card class="detail-container" shadow="never">
      <el-form :model="queryParams" :rules="rules" ref="payForm" label-width="120px" style="width:100%" size="small">
        <el-form-item label="用户ID" prop="id">
          <el-input class="ipt" placeholder="请输入" clearable v-model.trim="queryParams.id" />
        </el-form-item>
        <el-form-item label="充值金额(฿)" prop="amount">
          <el-input class="ipt" placeholder="请输入" clearable v-model.number="queryParams.amount" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="ipt" type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.note" :maxlength="100" show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleNext('payForm')" :loading="btnLoading">确认</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { addCoin } from "@/api/paySetting.js";
import MultiUpload from "@/components/Upload/multiUpload";
export default {
  components: { MultiUpload },
  data() {
    return {
      queryParams: {},
      rules: {
        amount: [
          { required: true, message: '请输入充值金额', trigger: 'blue' },
          { type: 'number', message: '充值金额必须为数字值' }
        ],
        id: [{ required: true, message: '请输入用户id', trigger: 'blue' }],
      },
      btnLoading: false
    };
  },

  methods: {
    handleNext(formName) {
      this.$refs[formName].validate((valid, err) => {
        if (valid) {
          this.btnLoading = true;
          this.$confirm("请核实用户id以及充值金额是否正确?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(async () => {
              this.btnLoading = false;
              if (this.queryParams.amount > 0) {
                addCoin({ ...this.queryParams })
                  .then(res => {
                    this.queryParams = {}
                    this.$message({
                      type: 'success',
                      message: '充值成功!',
                      duration: 1000
                    });
                  }).catch(err => {
                    this.$message.error(err)
                  })
              } else this.$message.error('充值金额必须大于0')

            })
        }
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.detail-container {
  width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}
.ipt {
  width: 320px;
}
</style>
