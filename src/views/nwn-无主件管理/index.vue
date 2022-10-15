<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="仓库类型：">
            <el-select v-model="listQuery.status" placeholder="请选择仓库类型" clearable class="input-width">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="归属组织：">
            <el-select v-model="listQuery.status" placeholder="请选择归属组织" clearable class="input-width">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运单号：">
            <el-input v-model="listQuery.title" class="input-width" placeholder="请输入运单号"></el-input>
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
      <span style="float: right">
        <el-button size="mini" type="primary" style="margin-left:20px;" @click="handleAdd()"> 新增 </el-button>
        <el-button size="mini" class="btn-add" @click="batchHandleProduct">批量删除</el-button>
      </span>

    </el-card>
    <div class="table-container">
      <el-card class="operate-container" shadow="never">
        <div class="">
          <el-table ref="homeAdvertiseTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange" v-loading="listLoading" border>
            <el-table-column type="selection" width="60" align="center" fixed="left"></el-table-column>
            <el-table-column label="序号" width="60" align="center" fixed="left">
              <template slot-scope="scope">{{ scope.row.sort }}</template>
            </el-table-column>
            <el-table-column label="运单号" align="center" width="150">
              <template slot-scope="scope">{{ typeEnum[scope.row.type] }}</template>
            </el-table-column>
            <el-table-column label="国际物流单号" align="center" width="150">
              <template slot-scope="scope">{{ typeEnum[scope.row.type] }}</template>
            </el-table-column>
            <el-table-column label="重量(kg)" align="center" width="150">
              <template slot-scope="scope">{{scope.row.url }}</template>
            </el-table-column>
            <el-table-column label="长(cm)" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.createTime || "-" }}</template>
            </el-table-column>
            <el-table-column label="宽(cm)" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.createTime || "-" }}</template>
            </el-table-column>
            <el-table-column label="高(cm)" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.createTime || "-" }}</template>
            </el-table-column>
            <el-table-column label="体积(cm²)" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.createTime || "-" }}</template>
            </el-table-column>
            <el-table-column label="服务费(฿)" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.createTime || "-" }}</template>
            </el-table-column>
            <el-table-column label="按重量计价(฿)" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.createTime || "-" }}</template>
            </el-table-column>
            <el-table-column label="到达仓库" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.createTime || "-" }}</template>
            </el-table-column>
            <el-table-column label="离开仓库" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.createTime || "-" }}</template>
            </el-table-column>
            <el-table-column label="收件人姓名" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.createTime || "-" }}</template>
            </el-table-column>
            <el-table-column label="收件人手机号" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.createTime || "-" }}</template>
            </el-table-column>
            <el-table-column label="泰国收获地址" align="center" width="150">
              <template slot-scope="scope">{{ scope.row.createTime || "-" }}</template>
            </el-table-column>
            <el-table-column label="操作" width="90" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">编辑
                </el-button>
                <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除
                </el-button>
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
import { fetchList, updateStatus, deleteHomeAdvertise } from "@/api/homeAdvertise";
import { fetchListWithChildren } from "@/api/productCate";
import { formatDate } from "@/utils/date";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null,
  type: null,
  endTime: null,
};
const detaultStatusOptions = [
  { label: "全部", value: null },
  { label: "已开启", value: 1 },
  { label: "已关闭", value: 0 },
];
const detaultLocationOptions = [
  { label: "首页banner", value: 1 },
  { label: "个人中心", value: 4 },
];
// 无主件管理
export default {
  name: "homeAdvertiseList",
  data() {
    return {
      tableHeight: 0, // 表格高度
      listQuery: Object.assign({}, defaultListQuery),
      statusOptions: Object.assign({}, detaultStatusOptions),
      locationOptions: Object.assign({}, detaultLocationOptions),
      // typeOptions: Object.assign({}, detaultTypeOptions),
      list: null,
      total: null,
      listLoading: false,
      typeEnum: ['首页弹屏', "首页banner", "个人中心banner位", '个人中心广告位'],
      defaultProps: {
        children: "children",
        label: "label",
      },
      multipleSelection: [], // 当前选择的列表
      productCateOptions: []
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
    formatTime(time) {
      if (time == null || time === "") {
        return "-";
      }
      return formatDate(time, "yyyy-MM-dd hh:mm:ss");
    },
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
    // 修改广告状态
    handleUpdateStatus(index, row) {
      this.$confirm("是否要修改上线/下线状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          updateStatus(row.id, { status: row.status == 1 ? 0 : 1 }).then((response) => {
            this.getList();
            this.$message({
              type: "success",
              message: "修改成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "已取消操作!",
          });
          this.getList();
        });
    },
    // 删除广告
    handleDelete(index, row) {
      this.deleteHomeAdvertise(row.id);
    },
    // 添加广告
    handleAdd() {
      this.$router.push({ path: "/sms/addAdvertise" });
    },
    // 编辑广告
    handleUpdate(index, row) {
      this.$router.push({
        path: "/sms/updateAdvertise",
        query: { id: row.id },
      });
    },
    // 获取广告列表
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    deleteHomeAdvertise(ids) {
      this.$confirm("是否要删除该广告?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {

        let params = new URLSearchParams();
        params.append("ids", ids);
        console.log('ids', params)
        deleteHomeAdvertise(params).then((response) => {
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
      console.log("multipleSelection", this.multipleSelection);
      // 处理选中的商品id
      this.multipleSelection &&
        this.multipleSelection.map((item) => {
          ids.push(item.id);
        });
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "请选选中商品后再进行批量操作！",
          type: "error",
          duration: 1000,
        });
        return;
      }
      this.$confirm("是否要进行批量操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {

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
  