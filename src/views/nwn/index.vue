<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="运单号：">
            <el-input v-model="listQuery.deliverySn" class="input-width" clearable placeholder="请输入运单号"></el-input>
          </el-form-item>
          <el-form-item label="转运单号：">
            <el-input v-model="listQuery.outDeliverySn" class="input-width" clearable placeholder="请输入转运单号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="float: right" type="primary" @click="handleSearchList()" size="small">
              查询搜索</el-button>
            <el-button style="float: right; margin-right: 15px" @click="handleResetSearch()" size="small">
              重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-card class="operate-container" shadow="never">
        <div class="">
          <el-table ref="homeAdvertiseTable" :max-height="tableHeight" :data="list" style="width: 100%" v-loading="listLoading" border>
            <el-table-column label="序号" width="60" align="center" fixed="left">
              <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column label="订单号" align="center" width="180">
              <template slot-scope="scope">{{ scope.row.orderSn }}</template>
            </el-table-column>
            <el-table-column label="用户ID" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.nickName }}</template>
            </el-table-column>
            <el-table-column label="运单号" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.deliverySn }}</template>
            </el-table-column>
            <el-table-column label="转运单号" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.outDeliverySn }}</template>
            </el-table-column>
            <el-table-column label="重量(kg)" align="center" width="150">
              <template slot-scope="scope">{{scope.row.weight }}</template>
            </el-table-column>
            <el-table-column label="长宽高(cm)" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.length*scope.row.width*scope.row.height }}</template>
            </el-table-column>
            <el-table-column label="服务费(฿)" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.serviceFee || "-" }}</template>
            </el-table-column>
            <el-table-column label="最终运费(฿)" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.totalAmount || "-" }}</template>
            </el-table-column>

            <el-table-column label="离开仓库日期" align="center" width="180">
              <template slot-scope="scope">{{ scope.row.deliveryTime || "-" }}</template>
            </el-table-column>
            <el-table-column label="泰国收件人信息" align="center" width="200">
              <template slot-scope="scope">
                <div style="text-align:left;">
                  <div>姓名：{{scope.row.receiverName}}</div>
                  <div>手机：{{scope.row.receiverPhone}}</div>
                  <div>地址：{{scope.row.receiverDetailAddress}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="物流状态" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.status |statusTxt }}</template>
            </el-table-column>
            <el-table-column label="备注" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.note}}</template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="warning" @click="changeAudit( scope.row)">审核</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[5, 10, 15]" :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="审核" :visible.sync="audit.dialogVisible" width="30%">
      <div style="margin-bottom: 20px">
        <span style="vertical-align: top">审核状态：</span>
        <el-radio-group v-model="audit.status">
          <el-radio :label="1">审核通过</el-radio>
          <el-radio :label="0">审核不通过</el-radio>
        </el-radio-group>
      </div>
      <span style="vertical-align: top">操作备注：</span>
      <el-input style="width: 80%" type="textarea" :rows="5" placeholder="请输入内容" v-model="audit.note">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="audit.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAuditOrderConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList, orderApprove } from "@/api/order";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  nobody: true
};
export default {
  name: "homeAdvertiseList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableHeight: 0, // 表格高度
      list: [],
      total: 0,
      listLoading: false,

      audit: {
        // 审核订单
        dialogVisible: false,
        status: 1,
        note: "",
        id: "",
        orderSn: '',
      },
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.$nextTick(() => {
      const h = document.body.clientHeight;
      this.tableHeight = h - 100;
    });
  },
  filters: {
    statusTxt(status) {
      if (!status) return '已入库';
      switch (Number(status)) {
        case 1:
          return '已入库';
        case 2:
          return '运输中';
        case 3:
          return '派送中';
        case 4:
          return '已签收';
      }
    }
  },
  methods: {

    // 重置
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    // 搜索
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    // 分页 修改size
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    // 切换分页
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    // 审核
    changeAudit({ id, orderSn }) {
      this.$confirm(`请确认无误后审核?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        orderApprove({ status: 1, note: "", id, orderSn }).then((res) => {
          if (res.code == 1) {
            this.getList();
          }
        });
      })

      // this.audit.dialogVisible = true;
      // this.audit.id = id;
      // this.audit.orderSn = orderSn;
      // this.curPayPic = payImageUrl;
      // console.log('status, note, id, orderSn', id, orderSn, this.audit)
    },
    handleAuditOrderConfirm() {
      let { status, note, id, orderSn } = this.audit;
      orderApprove({ status, note, id, orderSn }).then((res) => {
        if (res.code == 1) {
          this.audit.dialogVisible = false;
          this.getList();
        }
      });
    },

    // 获取列表
    getList() {
      this.listLoading = true;
      let listQuery = JSON.parse(JSON.stringify(this.listQuery));
      fetchList(listQuery).then((response) => {
        this.listLoading = false;
        if (response.data.list) {
          this.list = response.data.list || [];
        } else this.list = [];
        this.total = response.data.total;
      });
    },

  },
};
</script>
<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 120px);
}
.table-tree {
  margin-right: 20px;
  .tit {
    font-size: 14px;
    padding: 10px;
    background: yellowgreen;
    color: #fff;
    margin-bottom: 10px;
  }
}
.input-width {
  width: 203px;
}
</style>
