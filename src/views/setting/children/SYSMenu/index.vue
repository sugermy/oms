<template>
  <div class="home" v-loading.fullscreen.lock="loading">
    <search-bar ref="searchbar" :attributes="searchOptions" @query="onSearch" @update="updateAction" />
    <el-table :data="tableData" border style="width: 100%" :height="tableHeight" @selection-change="selectChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="ParentName" label="父级名称">
      </el-table-column>
      <el-table-column prop="Category" label="菜单级别">
      </el-table-column>
      <el-table-column prop="MenuName" label="菜单名称">
      </el-table-column>
      <el-table-column prop="Icon" label="菜单图标">
      </el-table-column>
      <el-table-column prop="LocationUrl" label="菜单地址">
      </el-table-column>
      <el-table-column prop="IsEnabled" label="是否启用">
        <template slot-scope="scope">{{scope.row.IsEnabled | TransformTemp('IsEnabled')}}</template>
      </el-table-column>
      <el-table-column prop="SortCode" label="排序号" width="100">
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="editAction(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑弹窗 -->
    <menu-dialog ref="menudialog" @confirm="confirmDialog" />
  </div>
</template>

<script>
import MenuDialog from './Dialog'
import SearchBtns from '@/components/mixins/searchbtn'
export default {
  components: {
    MenuDialog
  },
  mixins: [SearchBtns],
  data () {
    return {
      searchOptions: {
        isDefinedSearch: false,
        breadcrumb: { parent: '/oms/setting', name: '系统菜单' },
        labelWidth: '80px',
        labelItems: [
          {
            prop: 'MenuName',
            label: '菜单名称',
            isShow: true
          }
        ],
        buttonlist: []
      },
      tableHeight: 'auto',
      loading: false,
      tableData: [],
      multipleSelection: [],
      menuid: 0
    }
  },
  created () {
    this.initlist()
  },
  mounted () {
    this.$nextTick(() => {
      // 获取元素高度
      var h = document.documentElement.clientHeight || document.body.clientHeight
      this.tableHeight = h - this.$refs.searchbar.$el.offsetHeight - 120
    })
  },
  methods: {
    // 初始化列表
    initlist (params) {
      this.loading = true
      this.$ajax.get('/admin/menu', { ParamJson: JSON.stringify(params) }).then(res => {
        this.loading = false
        this.tableData = res.Data || []
      })
    },
    // 查询
    onSearch (v) {
      this.initlist(v)
    },
    // 提交表单
    confirmDialog (form) {
      delete form.ParentList
      this.$ajax.post('/admin/menu', form).then(res => {
        if (res.Code === 200) {
          this.$message({ type: 'success', message: '操作成功' })
          this.$refs.menudialog.$emit('hide')
          this.initlist()
        } else {
          this.$message({ type: 'error', message: res.Content })
        }
      })
    },
    // 0-新增 1-启用 2-停用 3-删除 4-更多
    updateAction (type) {
      if (type === 0) {
        this.menuid = 0
        this.$refs.menudialog.$emit('open', this.menuid)
      } else {
        if (this.multipleSelection.length > 0) {
          let ids = this.multipleSelection.map(el => el.ID).join(',')
          this.$ajax.patch(`/admin/menu/${type}`, { ids }).then(res => {
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
      this.menuid = row.ID
      this.$refs.menudialog.$emit('open', this.menuid)
    },
    // 页码大小
    changeSize (val) {
      console.log(`每页 ${val} 条`)
    },
    // 页码跳转
    changeCurrent (val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
