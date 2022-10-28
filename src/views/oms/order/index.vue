<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="用户ID：">
            <el-input v-model="listQuery.nickName" class="input-width" placeholder="请输入用户ID"></el-input>
          </el-form-item>
          <el-form-item label="运单号：">
            <el-input v-model="listQuery.deliverySn" class="input-width" placeholder="请输入运单号"></el-input>

          </el-form-item>
          <el-form-item label="转运单号：">
            <el-input v-model="listQuery.outDeliverySn" class="input-width" placeholder="请输入转运单号"></el-input>
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
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <span>
        <el-button size="mini" type="primary" style="margin-left:20px;" @click="handleAdd()"> 新增 </el-button>
        <el-button size="mini" type="danger" @click="batchHandleProduct">批量删除</el-button>
      </span>
    </el-card>
    <div style="margin-top: 20px">
      <el-tabs v-model="activeName" type="card" @tab-click="selectStatus">
        <el-tab-pane v-for="(item, index) in statusOptions" :key="index" :label="item.label" :name="item.name">
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="table-container">
      <el-card class="operate-container" shadow="never">
        <div class="">
          <el-table ref="homeAdvertiseTable" :max-height="tableHeight" :data="list" style="width: 100%" @selection-change="handleSelectionChange" v-loading="listLoading" border>
            <el-table-column type="selection" width="60" align="center" fixed="left"></el-table-column>
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

            <el-table-column label="操作" width="250" align="center" fixed="right">
              <template slot-scope="scope">
                <div style="margin-bottom:10px;">
                  <el-button size="mini" type="warning" @click="handle( scope.row,'remind')" v-if="scope.row.status==1">催付
                  </el-button>
                  <el-button size="mini" type="primary" @click="handleUpdate(scope.$index, scope.row)">编辑
                  </el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                  </el-button>
                </div>
                <div>
                  <el-button size="mini" type="success" plain @click="handle( scope.row,'updateArrive')" v-if="scope.row.status==2">到达泰国
                  </el-button>
                  <el-button size="mini" type="success" @click="handle( scope.row,'updateConfirm')" v-if="scope.row.status==3">完成派送
                  </el-button>
                </div>
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
  </div>
</template>
<script>
import { fetchList, deleteOrder, remind, updateArrive, updateConfirm } from "@/api/order";
import { formatDate } from "@/utils/date";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
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
      multipleSelection: [], // 当前选择的列表
      activeName: "all",
      statusOptions: [
        {
          label: "全部",
          value: null,
          name: "all",
        },
        {
          label: "已入库",
          value: 0,
          name: "has_in",
        },
        {
          label: "待支付",
          value: 1,
          name: "wait_pay",
        },
        {
          label: "运输中",
          value: 2,
          name: "on_way",
        },
        {
          label: "派送中",
          value: 3,
          name: "dispatching",
        },
        {
          label: "已签收",
          value: 4,
          name: "signed_in",
        },
      ],
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
    // 根据状态查询
    selectStatus() {
      this.listQuery["status"] = this.statusOptions.find(
        (i) => i.name == this.activeName
      ).value;
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
    // 删除订单
    handleDelete(index, row) {
      this.deleteHomeAdvertise([row.id]);
    },
    handle(row, type) {
      // remind, updateArrive, updateConfirm
      let api = remind;
      switch (type) {
        case 'remind':
          api = remind;
          break;
        case 'updateArrive':
          api = updateArrive;
          break;
        case 'updateConfirm':
          api = updateConfirm;
          break;
      }
      api(row.id).then(res => {
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        this.getList();
      })
    },
    // 添加订单
    handleAdd() {
      this.$router.push({ path: "/oms/orderDetail" });
    },
    // 编辑订单
    handleUpdate(index, row) {
      this.$router.push({
        path: "/oms/orderDetail",
        query: { id: row.id },
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
    // 删除
    deleteHomeAdvertise(ids, type = 0) {
      this.$confirm(`是否要${type ? `批量删除订单` : `删除该条订单`}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {

        let params = new URLSearchParams();
        params.append("ids", ids);
        console.log('ids', params)
        deleteOrder(params).then((response) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          if (this.list && this.list.length === 1 && this.listQuery.pageNum > 1) {
            this.listQuery.pageNum--;
          }
          this.getList();
        });
      });
    },
    // 选择列表
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 批量删除
    batchHandleProduct() {
      let ids = [];

      // 处理选中的商品id
      this.multipleSelection &&
        this.multipleSelection.map((item) => {
          ids.push(item.id);
        });
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "请选选中订单后再进行批量操作！",
          type: "error",
          duration: 1000,
        });
        return;
      }
      ids = this.multipleSelection.map(i => i.id);
      this.deleteHomeAdvertise(ids, 1);

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
