<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="用户ID：">
            <el-input v-model="listQuery.nickname" class="input-width" placeholder="请输入用户ID" clearable></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button style="float: right" type="primary" @click="handleSearchList()" size="small">
              查询搜索</el-button>
            <el-button style="float: right; margin-right: 15px" @click="handleResetSearch()" size="small">
              重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table ref="wineKnowledgeTable" :data="list" style="width: 100%" :maxHeight="tableHeight" v-loading="listLoading" border>
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">{{ scope.row.memberId}}</template>
        </el-table-column>
        <el-table-column label="用户手机号" align="center">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column label="用户ID" align="center">
          <template slot-scope="scope">{{ scope.row.nickname }}</template>
        </el-table-column>
        <el-table-column label="注册时间" align="center">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="余额" align="center">
          <template slot-scope="scope">{{ scope.row.coin }}</template>
        </el-table-column>
        <el-table-column label="是否会员" align="center">
          <template slot-scope="scope">{{
          scope.row.isVip==1?"是":"否"
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="130" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isVip " :active-value="true" :inactive-value="false" @change="(e)=>change(e,scope.row)">
            </el-switch>&nbsp;VIP
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[5, 10, 15]" :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { fetchList, setVip } from "@/api/vipCode";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
};
let self;
export default {
  name: "vip",
  data() {
    return {
      tableHeight: 0, // 表格高度
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      operateType: null,
      vipStatusOptions: ["禁用", "启用"],
    };
  },
  beforeCreate() {
    self = this;
  },
  created() {
    this.getList();
  },
  mounted() {
    this.$nextTick(() => {
      const h = document.body.clientHeight;
      this.tableHeight = h - 300;
    });
  },
  methods: {
    change(val, item) {

      // isVip
      let { id = '', isVip } = item;
      id && setVip({ id, isVip: val }).then(res => {
        if (res.code == 1) item.isVip = val;

      }).catch(e => {
        this.$message({
          type: "error",
          message: e.msg || e.message,
        });
      })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      console.log('listQuery', this.listQuery)
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 50px);
  overflow: auto;
}
.input-width {
  width: 203px;
}
</style>
