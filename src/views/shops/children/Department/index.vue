<template>
  <div class="home" v-loading.fullscreen.lock="loading">
    <search-bar ref="searchbar" :attributes="searchOptions" @query="onSearch" @update="updateAction" />
    <el-table :data="tableData" border style="width: 100%" :height="tableHeight" @selection-change="selectChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="ShopName" label="所属门店">
      </el-table-column>
      <el-table-column prop="DepartmentName" label="部门名称">
      </el-table-column>
      <el-table-column prop="Manager" label="负责人">
      </el-table-column>
      <el-table-column prop="Phone" label="联系电话">
      </el-table-column>
      <el-table-column prop="Remark" label="职责描述">
      </el-table-column>
      <el-table-column prop="IsEnabled" label="是否启用">
        <template slot-scope="scope">{{scope.row.IsEnabled | TransformTemp('IsEnabled')}}</template>
      </el-table-column>
      <el-table-column prop="UpdateUser" label="更新人">
      </el-table-column>
      <el-table-column prop="UpdateDate" label="更新时间">
      </el-table-column>
    </el-table>
    <el-pagination class="page-current" background @size-change="changeSize" @current-change="changeCurrent" :page-sizes="[15, 30, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper" :total="params.total">
    </el-pagination>
    <!-- 编辑弹窗 -->
    <department-dialog ref="departmentDialog" @confirm="confirmDialog" />
  </div>
</template>

<script>
import DepartmentDialog from './Dialog'
import TableHeight from '@/components/mixins/tableheight'
import SearchBtns from '@/components/mixins/searchbtn'

export default {
  components: {
    DepartmentDialog
  },
  mixins: [TableHeight, SearchBtns],
  data () {
    return {
      searchOptions: {
        isDefinedSearch: true,
        breadcrumb: { parent: '/oms/shops', name: '部门管理' },
        labelWidth: '80px',
        labelItems: [
          {
            prop: 'ShopName',
            label: '所属门店',
            isShow: true
          },
          {
            prop: 'Manager',
            label: '负责人',
            isShow: true
          },
          {
            prop: 'DepartmentName',
            label: '部门名称',
            isShow: true
          }
        ],
        buttonlist: []
      },
      loading: false,
      tableData: [],
      multipleSelection: [],
      departmentID: 0,
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
      this.$ajax.get('/mer/dep', { ParamJson: JSON.stringify(params), Page, Rows }).then(res => {
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
      this.$ajax.post('/mer/dep', form).then(res => {
        if (res.Code === 200) {
          this.$message({ type: 'success', message: '操作成功' })
          this.$refs.departmentDialog.$emit('hide')
          this.initlist()
        } else {
          this.$message({ type: 'error', message: res.Content })
        }
      })
    },
    // 0-新增 1-启用 2-停用 3-删除
    updateAction (type) {
      if (type === 0) {
        this.departmentID = 0
        this.$refs.departmentDialog.$emit('open', this.departmentID)
      } else if (type === 8) {
        if (this.multipleSelection.length === 1) {
          this.editAction(this.multipleSelection[0])
        } else {
          this.$message({ type: 'warning', message: '请选择要操作的1条数据' })
        }
      } else {
        if (this.multipleSelection.length > 0) {
          if (this.multipleSelection.length > 0) {
            let ids = this.multipleSelection.map(el => el.Id).join(',')
            this.$ajax.patch(`/mer/pub/dep/${type}`, { ids }).then(res => {
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
      }
    },
    // 选择行
    selectChange (val) {
      this.multipleSelection = val
    },
    // 编辑事件
    editAction (row) {
      this.departmentID = row.Id
      this.$refs.departmentDialog.$emit('open', this.departmentID)
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
