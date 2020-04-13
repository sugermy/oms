<template>
  <div class="home" v-loading.fullscreen.lock="loading">
    <search-bar ref="searchbar" :attributes="searchOptions" @query="onSearch" @addnew="addAction" @delete="updateAction(3)" @update="updateAction" />
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
      <el-table-column prop="JsEvent" label="JS事件">
      </el-table-column>
      <el-table-column type="SortCode" label="排序号" width="100">
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="editAction(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑弹窗 -->
    <button-dialog ref="menudialog" @confirm="confirmDialog" />
  </div>
</template>

<script>
import TableHeight from '@/components/mixins/tableheight'
import ButtonDialog from './ButtonDialog'
export default {
  name: 'Home',
  mixins: [TableHeight],
  components: {
    ButtonDialog
  },
  data () {
    return {
      searchOptions: {
        isDefinedSearch: false,
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
        buttonlist: {
          isReload: true,
          isNew: true,
          isDelete: true
        }
      },
      loading: false,
      tableHeight: 'auto',
      tableData: [],
      multipleSelection: [],
      buttonid: 0
    }
  },
  created () {
    this.getMenulist()
    this.initlist()
  },
  mounted () {
    this.$nextTick(() => {
      // 获取元素高度
      var h = document.documentElement.clientHeight || document.body.clientHeight
      this.tableHeight = h - this.$refs.searchbar.$el.offsetHeight - 100
    })
  },
  methods: {
    // 初始化列表
    initlist (params) {
      this.loading = true
      this.$ajax.get('/admin/button', params).then(res => {
        this.loading = false
        this.tableData = res.Data || []
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
    // 新增操作
    addAction () {
      this.buttonid = 0
      this.$refs.menudialog.$emit('open', this.buttonid)
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
    // 启用停用
    updateAction (type) {
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
