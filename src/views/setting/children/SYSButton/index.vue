<template>
  <div class="home" v-loading.fullscreen.lock="loading">
    <search-bar ref="searchbar" :attributes="searchOptions" @query="onSearch" @update="updateAction" />
    <el-table :data="tableData" border style="width: 100%" :height="tableHeight" @selection-change="selectChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="MenuName" label="所属菜单">
      </el-table-column>
      <el-table-column prop="ParentName" label="父级按钮">
      </el-table-column>
      <el-table-column prop="ButtonName" label="按钮名称">
      </el-table-column>
      <el-table-column prop="FontCode" label="按钮图标">
      </el-table-column>
      <el-table-column prop="JsEvent" label="JS事件Code">
      </el-table-column>
      <el-table-column prop="SortCode" label="排序号" width="100">
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="editAction(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="page-current" background @size-change="changeSize" @current-change="changeCurrent" :page-sizes="[15, 30, 50, 100]" :page-size="params.Rows"
      layout="total, sizes, prev, pager, next, jumper" :total="params.total">
    </el-pagination>
    <!-- 编辑弹窗 -->
    <button-dialog ref="menudialog" @confirm="confirmDialog" />
  </div>
</template>

<script>
import TableHeight from '@/components/mixins/tableheight'
import SearchBtns from '@/components/mixins/searchbtn'
import ButtonDialog from './Dialog'
export default {
  mixins: [TableHeight, SearchBtns],
  components: {
    ButtonDialog
  },
  data () {
    return {
      searchOptions: {
        isDefinedSearch: true,
        breadcrumb: { parent: '/oms/setting', name: '页面按钮' },
        labelWidth: '100px',
        labelItems: [
          {
            prop: 'menu_id',
            label: '所属菜单ID',
            type: 'select',
            isShow: true,
            options: []
          }
        ],
        buttonlist: []
      },
      loading: false,
      tableHeight: 'auto',
      tableData: [],
      multipleSelection: [],
      buttonid: 0,
      params: {
        Page: 1,
        Rows: 30,
        total: 0
      }
    }
  },
  created () {
    this.getMenulist()
    this.initlist()
  },
  methods: {
    // 初始化列表
    initlist (params, Page = this.params.Page, Rows = this.params.Rows) {
      this.loading = true
      this.$ajax.get('/admin/button', { ParamJson: JSON.stringify(params), Page, Rows }).then(res => {
        this.loading = false
        this.tableData = res.Data || []
        this.params.total = res.TotalCount
      })
    },
    // 初始化获取所属菜单列表
    getMenulist () {
      this.$ajax.get('/admin/button/parent').then(res => {
        if (res.Code === 200) {
          this.searchOptions.labelItems[0].options = res.Data
        }
      })
    },
    // 查询
    onSearch (v) {
      this.initlist(v)
    },
    // 提交表单
    confirmDialog (form) {
      this.$ajax.post('/admin/button/submitInfo', form).then(res => {
        if (res.Code === 200) {
          this.$message({ type: 'success', message: '操作成功' })
          this.$refs.menudialog.$emit('hide')
          this.initlist()
        } else {
          this.$message({ type: 'error', message: res.Content })
        }
      })
    },
    // 0-新增 1-启用 2-停用 3-删除
    updateAction (type) {
      if (type === 0) {
        this.buttonid = 0
        this.$refs.menudialog.$emit('open', this.buttonid)
      } else {
        if (this.multipleSelection.length > 0) {
          let ids = this.multipleSelection.map(el => el.ButtonID).join(',')
          this.$ajax.patch(`/admin/button/${type}`, { ids }).then(res => {
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
      this.buttonid = row.ButtonID
      this.$refs.menudialog.$emit('open', this.buttonid)
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
