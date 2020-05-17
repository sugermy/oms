<template>
  <div class="home" v-loading.fullscreen.lock="loading">
    <search-bar ref="searchbar" :attributes="searchOptions" @query="onSearch" @update="updateAction" />
    <el-table :data="tableData" border style="width: 100%" :height="tableHeight" @selection-change="selectChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="ShopName" label="分店名称">
      </el-table-column>
      <el-table-column prop="ShopCode" label="分店编码">
      </el-table-column>
      <el-table-column prop="IsEnabled" label="分店状态">
        <template slot-scope="scope">{{scope.row.IsEnabled | TransformTemp('IsEnabled')}}</template>
      </el-table-column>
      <el-table-column prop="IsFlagShip" label="是否是总店">
        <template slot-scope="scope">{{scope.row.IsFlagShip | TransformTemp('IsFlagShip')}}</template>
      </el-table-column>
      <el-table-column prop="Manager" label="负责人">
      </el-table-column>
      <el-table-column prop="Phone" label="联系电话">
      </el-table-column>
      <el-table-column prop="Address" label="分店地址">
      </el-table-column>
      <el-table-column prop="UpdateUser" label="更新人">
      </el-table-column>
      <el-table-column prop="UpdateDate" label="更新时间">
      </el-table-column>
      <el-table-column prop="Remark" label="备注">
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="editAction(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="page-current" background @size-change="changeSize" @current-change="changeCurrent" :page-sizes="[15, 30, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper" :total="params.total">
    </el-pagination>
    <!-- 编辑弹窗 -->
    <branch-dialog ref="branchDialog" @confirm="confirmDialog" />
  </div>
</template>

<script>
import BranchDialog from './Dialog'
import TableHeight from '@/components/mixins/tableheight'
import SearchBtns from '@/components/mixins/searchbtn'

export default {
  components: {
    BranchDialog
  },
  mixins: [TableHeight, SearchBtns],
  data () {
    return {
      searchOptions: {
        isDefinedSearch: true,
        breadcrumb: { parent: '/oms/shops', name: '分店管理' },
        labelWidth: '80px',
        labelItems: [
          {
            prop: 'ShopName',
            label: '店铺名称',
            isShow: true
          },
          {
            prop: 'Manager',
            label: '负责人',
            isShow: true
          },
          {
            prop: 'Phone',
            label: '联系电话',
            isShow: true
          }
        ],
        buttonlist: []
      },
      loading: false,
      tableData: [],
      multipleSelection: [],
      branchID: 0,
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
      this.$ajax.get('/mer/shop', { ParamJson: JSON.stringify(params), Page, Rows }).then(res => {
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
    // 提交表单
    confirmDialog (form) {
      this.$ajax.post('/mer/shop', form).then(res => {
        if (res.Code === 200) {
          this.$message({ type: 'success', message: '操作成功' })
          this.$refs.branchDialog.$emit('hide')
          this.initlist()
        } else {
          this.$message({ type: 'error', message: res.Content })
        }
      })
    },
    // 0-新增 1-启用 2-停用 3-删除
    updateAction (type) {
      if (type === 0) {
        this.branchID = 0
        this.$refs.branchDialog.$emit('open', this.branchID)
      } else {
        if (this.multipleSelection.length > 0) {
          let ids = this.multipleSelection.map(el => el.Id).join(',')
          this.$ajax.patch(`/mer/pub/shop/${type}`, { ids }).then(res => {
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
      }
    },
    // 选择行
    selectChange (val) {
      this.multipleSelection = val
    },
    // 编辑事件
    editAction (row) {
      this.branchID = row.Id
      this.$refs.branchDialog.$emit('open', this.branchID)
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
