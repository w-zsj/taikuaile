<template>
  <div class="app-container">
    <el-card class="detail-container" shadow="never">
      <el-form :model="queryParams" :rules="rules" ref="addOrderForm" label-width="120px" style="width:100%" size="small">
        <el-form-item label="是否无主件">
          <el-switch v-model="queryParams.nomainpart" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="用户ID" prop="userid" :rules="[
     { required: !queryParams.nomainpart, message: '请输入用户id', trigger: 'blue' } ]">
          <el-input class="ipt" placeholder="请输入" clearable v-model.trim="queryParams.userid" />
        </el-form-item>
        <el-form-item label="国内运单号" prop="waybillNo">
          <el-input class="ipt" placeholder="请输入" clearable v-model.trim="queryParams.waybillNo" />
        </el-form-item>
        <el-form-item label="转运单号" prop="transshipmentOrderNo">
          <el-input class="ipt" placeholder="请输入" clearable v-model.trim="queryParams.transshipmentOrderNo" />
        </el-form-item>
        <el-form-item label="重量(kg)" prop="weight">
          <el-input class="ipt" placeholder="请输入" clearable v-model.trim="queryParams.weight" />
        </el-form-item>
        <el-form-item label="长宽高(cm)" prop="size">
          <el-input class="ipt" placeholder="请输入长*宽*高" clearable v-model.trim="queryParams.size" />
        </el-form-item>
        <el-form-item label="重量(kg)" prop="weight">
          <el-input class="ipt" placeholder="请输入" clearable v-model.trim="queryParams.weight" />
        </el-form-item>
        <el-form-item label="服务费" prop="serviceCharge">
          <el-input class="ipt" placeholder="请输入" clearable v-model.trim="queryParams.serviceCharge" />
        </el-form-item>
        <el-form-item label="离开仓库日期" prop="date">
          <el-date-picker type="datetime" :placeholder="`请选择`" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" v-model="queryParams.date" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="ipt" type="textarea" :rows="2" placeholder="请输入内容" v-model.trim="queryParams.remark" :maxlength="60" show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleNext('addOrderForm')" :loading="btnLoading">取消 </el-button>
          <el-button type="primary" @click="handleNext('addOrderForm')" :loading="btnLoading">发布 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { payList, payUpdate } from "@/api/paySetting.js";
import MultiUpload from "@/components/Upload/multiUpload";
export default {
  components: { MultiUpload },
  data() {
    return {
      queryParams: {},
      rules: {
        waybillNo: [{ required: true, message: '请填写国内运单号', trigger: 'blue' }],
        transshipmentOrderNo: [{ required: true, message: '请填写转运单号', trigger: 'blue' }],
        // userid: [{ required: true, message: '请输入用户id', trigger: 'blue' }],
        weight: [{ required: true, message: '请输入包裹重量', trigger: 'blue' }],
        size: [{ required: true, message: '请输入包裹长宽高', trigger: 'blue' }],
        serviceCharge: [{ required: true, message: '请填写服务费', trigger: 'blue' }],
        date: [{ required: true, message: '请选择离仓日期', trigger: 'blue' }],
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
            .then(() => {
              this.btnLoading = false;
            })
        }
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.detail-container {
  width: 800px;
  margin: 0 auto;
}
.ipt {
  width: 320px;
}
</style>
