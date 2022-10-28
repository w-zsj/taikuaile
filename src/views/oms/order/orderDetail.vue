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
          <el-input class="ipt" placeholder="请输入" clearable v-model.trim="queryParams.nickName" />
        </el-form-item>
        <el-form-item label="国内运单号" prop="deliverySn">
          <el-input class="ipt" placeholder="请输入" clearable v-model.trim="queryParams.deliverySn" />
        </el-form-item>
        <el-form-item label="转运单号" prop="transshipmentOrderNo">
          <el-input class="ipt" placeholder="请输入" clearable v-model.trim="queryParams.transshipmentOrderNo" />
        </el-form-item>
        <el-form-item label="长(cm)" prop="length">
          <el-input class="ipt" placeholder="请输入长" clearable v-model.trim="queryParams.length" />
        </el-form-item>
        <el-form-item label="宽(cm)" prop="width">
          <el-input class="ipt" placeholder="请输入宽" clearable v-model.trim="queryParams.width" />
        </el-form-item>
        <el-form-item label="高(cm)" prop="height">
          <el-input class="ipt" placeholder="请输入高" clearable v-model.trim="queryParams.height" />
        </el-form-item>
        <el-form-item label="重量(kg)" prop="weight">
          <el-input class="ipt" placeholder="请输入" clearable v-model.trim="queryParams.weight" />
        </el-form-item>
        <el-form-item label="服务费(฿)" prop="serviceFee">
          <el-input class="ipt" placeholder="请输入" clearable v-model.trim="queryParams.serviceFee" />
        </el-form-item>
        <el-form-item label="最总运费" prop="totalAmount">
          <el-input class="ipt" placeholder="请填写最终运费" clearable v-model.trim="queryParams.totalAmount" />
        </el-form-item>
        <el-form-item label="泰国收件人信息" prop="serviceCharge">
          <el-input class="ipt" placeholder="请填写泰国收件人信息(姓名，电话，详细地址三项信息请换行)" type="textarea" :rows="4" clearable v-model="queryParams.detailAddr" />
        </el-form-item>
        <el-form-item label="离开仓库日期" prop="deliveryTime">
          <el-date-picker type="datetime" :placeholder="`请选择`" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" v-model="queryParams.deliveryTime" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="ipt" type="textarea" :rows="2" placeholder="请输入内容" v-model.trim="queryParams.note" :maxlength="60" show-word-limit>
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
import { addOrder } from "@/api/order";
export default {
  data() {
    return {
      queryParams: {},
      rules: {
        deliverySn: [{ required: true, message: '请填写国内运单号', trigger: 'blue' }],
        transshipmentOrderNo: [{ required: true, message: '请填写转运单号', trigger: 'blue' }],
        weight: [{ required: true, message: '请输入包裹重量', trigger: 'blue' }],
        length: [{ required: true, message: '请输入包裹长', trigger: 'blue' }],
        width: [{ required: true, message: '请输入包裹宽', trigger: 'blue' }],
        height: [{ required: true, message: '请输入包裹高', trigger: 'blue' }],
        serviceFee: [{ required: true, message: '请填写服务费', trigger: 'blue' }],
        deliveryTime: [{ required: true, message: '请选择离仓日期', trigger: 'blue' }],
        totalAmount: [{ required: true, message: '请填写最终运费', trigger: 'blue' }],
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
              let detailAddr
              if (this.queryParams.detailAddr) {
                let [receiverName, receiverPhone, receiverDetailAddress] = this.queryParams.detailAddr.split('\n');
                this.queryParams = { ...this.queryParams, receiverName, receiverPhone, receiverDetailAddress };
                delete this.queryParams.detailAddr;

              }
              console.log('this.queryParams', this.queryParams)
              addOrder(this.queryParams).then(res => {

              })
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
