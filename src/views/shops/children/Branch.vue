<template>
  <div class="home" v-loading.fullscreen.lock="loading">
    <search-bar ref="searchbar" :attributes="searchOptions" @query="onSearch" @addnew="addAction" @delete="updateAction(3)" @update="updateAction" />
    <el-table :data="tableData" border style="width: 100%" :height="tableHeight" @selection-change="selectChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="ShopName" label="分店名称">
      </el-table-column>
      <el-table-column prop="ShopCode" label="分店编码">
      </el-table-column>
      <el-table-column prop="IsEnabled" label="分店状态">
      </el-table-column>
      <el-table-column prop="IsFlagShip" label="是否是总店">
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
    <!-- 编辑弹窗 -->
    <branch-dialog ref="branchDialog" @confirm="confirmDialog" />
  </div>
</template>

<script>
import BranchDialog from './BranchDialog'

export default {
  name: 'Home',
  components: {
    BranchDialog
  },
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
        buttonlist: {
          isReload: true,
          isNew: true,
          isDelete: true,
          isMore: [{ label: '启用', type: 1 }, { label: '停用', type: 2 }]
        }
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
      this.tableHeight = h - this.$refs.searchbar.$el.offsetHeight - 100
    })
  },
  methods: {
    // 初始化列表
    initlist (params) {
      this.loading = true
      this.$ajax.get('/mer/shop', params).then(res => {
        this.loading = false
        this.tableData = res.Data || []
      })
    },
    // 查询
    onSearch (v) {
      this.initlist(v)
    },
    // 新增操作
    addAction () {
      this.menuid = 0
      this.$refs.branchDialog.$emit('open', this.menuid)
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
    // 启用停用
    updateAction (type) {
      if (this.multipleSelection.length > 0) {
        let ids = this.multipleSelection.map(el => el.ID).join(',')
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
    },
    // 选择行
    selectChange (val) {
      this.multipleSelection = val
    },
    // 编辑事件
    editAction (row) {
      this.menuid = row.ID
      this.$refs.branchDialog.$emit('open', this.menuid)
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
