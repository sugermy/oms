<template>
  <div class="home" v-loading.fullscreen.lock="loading">
    <search-bar ref="searchbar" :attributes="searchOptions" @query="onSearch" @addnew="addAction" @update="updateAction" />
    <el-table :data="tableData" border style="width: 100%" :height="tableHeight" @selection-change="selectChange">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column type="$index" label="序号" width="55">
      </el-table-column>
      <el-table-column prop="ShopName" label="所属门店">
      </el-table-column>
      <el-table-column prop="ProductName" label="商品名称">
      </el-table-column>
      <el-table-column prop="PCode" label="商品简码">
      </el-table-column>
      <el-table-column prop="ProductCode" label="商品条码">
      </el-table-column>
      <el-table-column prop="CategoryName" label="商品类型">
      </el-table-column>
      <el-table-column prop="Price_Purchase" label="进货价格">
      </el-table-column>
      <el-table-column prop="Price_Sell" label="零售价格">
      </el-table-column>
      <el-table-column prop="StockRule" label="库存配置">
      </el-table-column>
      <el-table-column prop="CommisionRule" label="业务提成">
      </el-table-column>
      <el-table-column prop="Intergral_GiftRule" label="积分赠送">
      </el-table-column>
      <el-table-column prop="Integral_exchange_Rule" label="积分兑换">
      </el-table-column>
      <el-table-column prop="DiscountRule" label="打折优惠">
      </el-table-column>
      <el-table-column prop="IsSell" label="是否上架">
      </el-table-column>
      <el-table-column prop="Remark" label="备注">
      </el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="editAction(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="page-current" background @size-change="changeSize" @current-change="changeCurrent" :page-sizes="[15, 30, 50, 100]" :page-size="params.Page"
      layout="total, sizes, prev, pager, next, jumper" :total="params.total">
    </el-pagination>
    <!-- 编辑弹窗 -->
    <stock-dialog ref="stockDialog" @confirm="confirmDialog" />
  </div>
</template>

<script>
import StockDialog from './Dialog'
import TableHeight from '@/components/mixins/tableheight'

export default {
  components: {
    StockDialog
  },
  mixins: [TableHeight],
  data () {
    return {
      searchOptions: {
        isDefinedSearch: true,
        breadcrumb: { parent: '/oms/sells', name: '商品入库' },
        labelWidth: '80px',
        labelItems: [
          {
            prop: 'ShopName',
            label: '门店名称',
            isShow: true
          },
          {
            prop: 'TypeName',
            label: '类型名称',
            isShow: true
          },
          {
            prop: 'ProductName',
            label: '商品名称',
            isShow: true
          },
          {
            prop: 'PCode',
            label: '商品简码',
            isShow: true
          },
          {
            prop: 'ProductCode',
            label: '商品条码',
            isShow: true
          }
        ],
        buttonlist: {
          isReload: true,
          isNew: true,
          isDelete: true,
          isMore: [{ label: '启用', type: 1 }, { label: '停用', type: 2 }]
        }
      },
      loading: false,
      tableData: [],
      multipleSelection: [],
      stockID: 0,
      params: {
        Page: 1,
        Rows: 15,
        total: 0
      }
    }
  },
  created () {
    this.initlist()
  },
  methods: {
    // 初始化列表
    initlist (params, Page = this.params.Page, Rows = this.params.Rows) {
      this.loading = true
      this.$ajax.get('/pro/base', { ParamJson: JSON.stringify(params), Page, Rows }).then(res => {
        this.loading = false
        this.tableData = res.Data || []
        this.params.total = res.TotalCount
      })
    },
    // 查询
    onSearch (v) {
      this.params.Page = 1
      this.initlist(v)
    },
    // 新增操作
    addAction () {
      this.stockID = 0
      this.$refs.stockDialog.$emit('open', this.stockID)
    },
    // 提交表单
    confirmDialog (form) {
      this.$ajax.post('/pro/base', form).then(res => {
        if (res.Code === 200) {
          this.$message({ type: 'success', message: '操作成功' })
          this.$refs.stockDialog.$emit('hide')
          this.initlist()
        } else {
          this.$message({ type: 'error', message: res.Content })
        }
      })
    },
    // 启用停用
    updateAction (type) {
      if (this.multipleSelection.length > 0) {
        let ids = this.multipleSelection.map(el => el.Id).join(',')
        this.$ajax.patch(`/mer/pub/user/${type}`, { ids }).then(res => {
          if (res.Code === 200) {
            this.$message({ type: 'success', message: '操作成功' })
            this.initlist()
          } else {
            this.$message({ type: 'error', message: res.Content })
          }
        })
      } else {
        this.$message({ type: 'warning', message: '请选择要操作的数据行' })
      }
    },
    // 选择行
    selectChange (val) {
      this.multipleSelection = val
    },
    // 编辑事件
    editAction (row) {
      this.stockID = row.Id
      this.$refs.stockDialog.$emit('open', this.stockID)
    },
    // 页码大小
    changeSize (val) {
      this.params.Rows = val
      this.initlist()
    },
    // 页码跳转
    changeCurrent (val) {
      this.params.Page = val
      this.initlist()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
