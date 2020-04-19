<template>
  <div class="home" v-loading.fullscreen.lock="loading">
    <search-bar ref="searchbar" :attributes="searchOptions" @query="onSearch" @addnew="addAction" @delete="updateAction(3)" @update="updateAction" />
    <el-table :data="tableData" border style="width: 100%" :height="tableHeight" @selection-change="selectChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="ShopName" label="所属门店">
      </el-table-column>
      <el-table-column prop="TerminalNo" label="终端号">
      </el-table-column>
      <el-table-column prop="IPAddress" label="IP地址">
      </el-table-column>
      <el-table-column prop="Position" label="摆放位置">
      </el-table-column>
      <el-table-column prop="Remark" label="备注">
      </el-table-column>
      <el-table-column prop="IsEnabled" label="是否启用">
        <template slot-scope="scope">{{scope.row.IsEnabled?'启用':'停用'}}</template>
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
    <el-pagination class="page-current" background @size-change="changeSize" @current-change="changeCurrent" :page-sizes="[15, 30, 50, 100]" :page-size="params.Page"
      layout="total, sizes, prev, pager, next, jumper" :total="params.total">
    </el-pagination>
    <!-- 编辑弹窗 -->
    <terminal-dialog ref="terminalDialog" @confirm="confirmDialog" />
  </div>
</template>

<script>
import TerminalDialog from './TerminalDialog'
import TableHeight from '@/components/mixins/tableheight'

export default {
  components: {
    TerminalDialog
  },
  mixins: [TableHeight],
  data () {
    return {
      searchOptions: {
        isDefinedSearch: true,
        breadcrumb: { parent: '/oms/shops', name: '终端管理' },
        labelWidth: '80px',
        labelItems: [
          {
            prop: 'ShopName',
            label: '所属门店',
            isShow: true
          },
          {
            prop: 'TerminalName',
            label: '终端名称',
            isShow: true
          },
          {
            prop: 'TerminalNo',
            label: '终端编码',
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
      terminalID: 0,
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
      this.$ajax.get('/mer/ter', { ...params, Page, Rows }).then(res => {
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
      this.terminalID = 0
      this.$refs.terminalDialog.$emit('open', this.terminalID)
    },
    // 提交表单
    confirmDialog (form) {
      this.$ajax.post('/mer/ter', form).then(res => {
        if (res.Code === 200) {
          this.$message({ type: 'success', message: '操作成功' })
          this.$refs.terminalDialog.$emit('hide')
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
        this.$ajax.patch(`/mer/pub/ter/${type}`, { ids }).then(res => {
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
      this.terminalID = row.Id
      this.$refs.terminalDialog.$emit('open', this.terminalID)
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
