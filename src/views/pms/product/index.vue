<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="商品名称：">
            <el-input class="input-width" v-model="listQuery.keyword" placeholder="商品名称" @keyup.enter.native="handleSearchList(listQuery.keyword)"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input class="input-width" v-model="listQuery.productSn" placeholder="商品货号" @keyup.enter.native="handleSearchList(listQuery.productSn)"></el-input>
          </el-form-item>
          <el-form-item label="商品类目：">
            <el-cascader class="input-width" clearable v-model="selectProductCateValue" :options="productCateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select class="input-width" v-model="listQuery.publishStatus" placeholder="全部" clearable @change="handleSearchList(listQuery.publishStatus)">
              <el-option v-for="item in publishStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="float:right" type="primary" @click="handleSearchList()" size="small"> 查询搜索</el-button>
            <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small"> 重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <span>
        <el-button @click="batchHandleProduct" size="mini"> 批量删除 </el-button>
      </span>
      <el-button class="btn-add ml15" @click="handleAddProduct" size="mini">
        添加商品
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange" v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="60" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="商品图片" align="center">
          <template slot-scope="scope"><img style="width: 70px" :src="scope.row.pic" /></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.name }}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.price">价格：฿{{ scope.row.price }}</p>
            <p v-if="scope.row.productSn">货号：{{ scope.row.productSn }}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="120" align="center">
          <template slot-scope="scope">
            上架：
            <el-switch :disabled="scope.row.publishStatus == 2" @change="handlePublishStatusChange(scope.$index, scope.row)" :active-value="1" :inactive-value="scope.row.publishStatus == 2 ? 2 : 0" v-model="scope.row.publishStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="60" align="center">
          <template slot-scope="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="SKU库存" width="80" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleShowSkuEditDialog(scope.$index, scope.row)" circle></el-button>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="60" align="center">
          <template slot-scope="scope">{{ scope.row.sale }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleShowProduct(scope.$index, scope.row)">查看
              </el-button>
              <el-button size="mini" @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
            </p>
            <p>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[15, 30, 45]" :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="编辑货品信息" :visible.sync="editSkuInfo.dialogVisible" width="65%">
      <span>商品货号：</span>
      <span>{{editSkuInfo.productSn}}</span>
      <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 50%;margin-left: 20px">
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"></el-button>
      </el-input>
      <el-table style="width: 100%;margin-top: 20px" :data="editSkuInfo.stockList" border>
        <el-table-column label="SKU编号" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column v-for="(item,index) in editSkuInfo.productAttr" :label="item.name" :key="item.id" align="center">
          <template slot-scope="scope">
            {{getProductSkuSp(scope.row,index)}}
          </template>
        </el-table-column>
        <el-table-column label="销售价格" width="100" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="商品库存" width="80" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stock"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { fetchList, updateDeleteStatus, updatePublishStatus } from "@/api/product";
import { fetchList as fetchSkuStockList, update as updateSkuStockList, } from "@/api/skuStock";
import { fetchList as fetchProductAttrList } from "@/api/productAttr";
import { fetchListWithChildren } from "@/api/productCate";

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 30,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  productCategoryId: null,
  brandId: null,
};
export default {
  name: "product",
  data() {
    return {
      tableHeight: 0, // 表格高度
      editSkuInfo: {
        dialogVisible: false,
        productId: null,
        productSn: "",
        productAttributeCategoryId: null,
        stockList: [],
        productAttr: [],
        keyword: null,
      },
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      selectProductCateValue: null,
      multipleSelection: [],
      productCateOptions: [],
      publishStatusOptions: [
        {
          value: 1,
          label: "上架",
        },
        {
          value: 0,
          label: "下架",
        },
        // {
        //   value: 2,
        //   label: "草稿",
        // },
      ],
      verifyStatusOptions: [
        {
          value: 1,
          label: "审核通过",
        },
        {
          value: 0,
          label: "未审核",
        },
      ],
      saleType: true,
    };
  },
  created() {
    this.getList();
    this.getProductCateList();
  },
  mounted() {
    this.$nextTick(() => {
      const h = document.body.clientHeight;
      this.tableHeight = h - 150;

      // 监听窗口大小变化
      /* let _this = this;
        window.onresize = function() {
          // 表格高度自适应
          const h = document.body.clientHeight;
          _this.tableHeight = h - 350;
        } */
    });
  },
  watch: {
    selectProductCateValue: function(newValue) {
      if (newValue != null && newValue.length == 2) {
        this.listQuery.productCategoryId = newValue[1];
      } else {
        this.listQuery.productCategoryId = null;
      }
    },
  },
  methods: {
    getProductSkuSp(row, index) {
      let spData = JSON.parse(row.spData);
      if (spData != null && index < spData.length) {
        return spData[index].value;
      } else {
        return null;
      }
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery)
        .then((response) => {
          this.list = response.data.list;
          this.total = response.data.total;
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    getProductCateList() {
      fetchListWithChildren().then((response) => {
        let list = response.data;
        this.productCateOptions = [];
        for (let i = 0; i < list.length; i++) {
          let children = [];
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({
                label: list[i].children[j].name,
                value: list[i].children[j].id,
              });
            }
          }
          this.productCateOptions.push({
            label: list[i].name,
            value: list[i].id,
            children: children,
          });
        }
      });
    },
    // 查询
    handleSearchList(val) {
      console.log('val', val)
      // if (val) this.listQuery.publishStatus = val
      this.listQuery.pageNum = 1;
      this.getList();
    },
    // 重置
    handleResetSearch() {
      this.selectProductCateValue = [];
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    // 添加商品
    handleAddProduct(type) {
      this.$router.push({ path: "/pms/addProduct" });
    },
    // 分页 修改pagesize
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
    // 选中列
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 上下架
    handlePublishStatusChange(index, row) {
      let id = [];
      id.push(row.id);
      this.updatePublishStatus(row.publishStatus, id);
    },
    updatePublishStatus(publishStatus, id) {
      let params = new URLSearchParams();
      params.append("id", id);
      params.append("publishStatus", publishStatus);
      updatePublishStatus(params)
        .then((response) => {
          this.$message({
            message: "修改成功",
            type: "success",
            duration: 1000,
          });
        })
        .finally(() => {
          this.getList();
        });
    },

    // 删除单列
    handleDelete(index, row) {
      this.$confirm("是否要进行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let ids = [];
        ids.push(row.id);
        this.updateDeleteStatus(1, ids);
      });
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
        this.updateDeleteStatus(1, ids);
      });
    },
    updateDeleteStatus(deleteStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("deleteStatus", deleteStatus);
      updateDeleteStatus(params).then((response) => {
        this.$message({
          message: "删除成功",
          type: "success",
          duration: 1000,
        });
        this.getList();
      });
      this.getList();
    },
    // 编辑
    handleUpdateProduct(index, row) {
      this.$router.push({
        path: "/pms/updateProduct",
        query: {
          id: row.id,
          type: "",
        },
      });
    },
    // 查看
    handleShowProduct(index, row) {
      this.$router.push({ path: "/pms/checkProduct", query: { id: row.id, type: "" } });
    },

    handleShowSkuEditDialog(index, row) {
      if (row.isGift === 1) {
        this.saleType = false;
      } else {
        this.saleType = true;
      }
      this.editSkuInfo.dialogVisible = true;
      this.editSkuInfo.productId = row.id;
      this.editSkuInfo.productSn = row.productSn;
      this.editSkuInfo.productAttributeCategoryId =
        row.productAttributeCategoryId;
      this.editSkuInfo.keyword = null;
      fetchSkuStockList(row.id, { keyword: this.editSkuInfo.keyword }).then(
        (response) => {
          this.editSkuInfo.stockList = response.data;
        }
      );
      if (row.productAttributeCategoryId != null) {
        fetchProductAttrList(row.productAttributeCategoryId, { type: 0 }).then(
          (response) => {
            this.editSkuInfo.productAttr = response.data.list;
          }
        );
      }
    },
    handleSearchEditSku() {
      fetchSkuStockList(this.editSkuInfo.productId, {
        keyword: this.editSkuInfo.keyword,
      }).then((response) => {
        this.editSkuInfo.stockList = response.data;
      });
    },
    handleEditSkuConfirm() {
      console.log(777777, this.saleType)
      if (
        this.editSkuInfo.stockList == null ||
        this.editSkuInfo.stockList.length <= 0
      ) {
        this.$message({
          message: "暂无sku信息",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      const list = this.editSkuInfo.stockList;
      const reg = /^[+]{0,1}(\d+)$/; // 正整数的正则表达式(包括0)
      const reg1 = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/; // 正数的正则表达式(不包括0，小数保留两位)
      const reg2 = /^(([1-9]\d{0,4})|(0{1}))$/; // 5位整数
      for (let i = 0; i < list.length; i++) {

        if (this.saleType) {
          if (!reg1.test(list[i].price)) {
            this.$message.error('销售价格为必填，大于0，最多保留两位小数~');
            return;
          }
        }
        if (!reg2.test(list[i].stock)) {
          this.$message.error('商品库存为必填，请输入1-5位数字~');
          return;
        }
      }
      this.$confirm("是否要进行修改", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        updateSkuStockList(
          this.editSkuInfo.productId,
          this.editSkuInfo.stockList
        ).then((response) => {
          this.$message({
            message: "修改成功",
            type: "success",
            duration: 1000,
          });
          this.editSkuInfo.dialogVisible = false;
          this.getList();
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100vh;
}
.ml15 {
  margin-left: 15px;
}
.add-tips {
  color: #666;
  font-size: 12px;
  position: relative;
  top: 8px;
}
.input-width {
  width: 210px;
}
</style>
