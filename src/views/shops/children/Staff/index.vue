<template>
  <div class="home" v-loading.fullscreen.lock="loading">
    <search-bar ref="searchbar" :attributes="searchOptions" @query="onSearch" @update="updateAction" />
    <el-table :data="tableData" border style="width: 100%" :height="tableHeight" @selection-change="selectChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="ShopName" label="所属门店">
      </el-table-column>
      <el-table-column prop="DepartmentName" label="所属部门">
      </el-table-column>
      <el-table-column prop="Account" label="登录帐号">
      </el-table-column>
      <el-table-column prop="RealName" label="真实姓名">
      </el-table-column>
      <el-table-column prop="Phone" label="Phone">
      </el-table-column>
      <el-table-column prop="IsEnabled" label="是否启用">
        <template slot-scope="scope">{{scope.row.IsEnabled | TransformTemp('IsEnabled')}}</template>
      </el-table-column>
      <el-table-column prop="IsOnline" label="是否在线">
        <template slot-scope="scope">{{scope.row.IsOnline | TransformTemp('IsOnline')}}</template>
      </el-table-column>
      <el-table-column prop="UpdateUser" label="更新人">
      </el-table-column>
      <el-table-column prop="UpdateDate" label="更新时间">
      </el-table-column>
      <el-table-column prop="Remark" label="备注">
      </el-table-column>
      <el-table-column label="操作" width="140" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="passAction(scope.row)">修改密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="page-current" background @size-change="changeSize" @current-change="changeCurrent" :page-sizes="[15, 30, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper" :total="params.total">
    </el-pagination>
    <!-- 编辑弹窗 -->
    <staff-dialog ref="staffDialog" @confirm="confirmDialog" />
    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="showPasForm" @close="cancelForm('ruleForm')" width="500px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="当前密码" prop="pwdOld">
          <el-input v-model.number="ruleForm.pwdOld"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pwdNew">
          <el-input type="password" v-model="ruleForm.pwdNew" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showPasForm = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import StaffDialog from './Dialog'
import TableHeight from '@/components/mixins/tableheight'
import SearchBtns from '@/components/mixins/searchbtn'

export default {
  components: {
    StaffDialog
  },
  mixins: [TableHeight, SearchBtns],
  data () {
    var checkOldPas = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入当前密码'))
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pwdNew) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      searchOptions: {
        isDefinedSearch: true,
        breadcrumb: { parent: '/oms/shops', name: '员工管理' },
        labelWidth: '80px',
        labelItems: [
          {
            prop: 'ShopName',
            label: '所属门店',
            isShow: true
          },
          {
            prop: 'DepartmentName',
            label: '所属部门',
            isShow: true
          },
          {
            prop: 'Account',
            label: '登录帐号',
            isShow: true
          },
          {
            prop: 'RealName',
            label: '真实姓名',
            isShow: true
          }
        ],
        buttonlist: []
      },
      loading: false,
      showPasForm: false, // 修改密码
      tableData: [],
      multipleSelection: [],
      staffID: 0,
      params: {
        Page: 1,
        Rows: 15,
        total: 0
      },
      ruleForm: {
        pwdNew: '',
        checkPass: '',
        pwdOld: ''
      },
      modifyPasAccount: '',
      rules: {
        pwdOld: [
          { validator: checkOldPas, trigger: 'blur' }
        ],
        pwdNew: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
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
      this.$ajax.get('/mer/user', { ParamJson: JSON.stringify(params), Page, Rows }).then(res => {
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
      this.$ajax.post('/mer/user', form).then(res => {
        if (res.Code === 200) {
          this.$message({ type: 'success', message: '操作成功' })
          this.$refs.staffDialog.$emit('hide')
          this.initlist()
        } else {
          this.$message({ type: 'error', message: res.Content })
        }
      })
    },
    // 0-新增 1-启用 2-停用 3-删除
    updateAction (type) {
      if (type === 0) {
        this.staffID = 0
        this.$refs.staffDialog.$emit('open', this.staffID)
      } else if (type === 8) {
        if (this.multipleSelection.length === 1) {
          this.editAction(this.multipleSelection[0])
        } else {
          this.$message({ type: 'warning', message: '请选择要操作的1条数据' })
        }
      } else {
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
      }
    },
    // 修改密码
    passAction (row) {
      this.showPasForm = true
      this.modifyPasAccount = row.Account
    },
    // 提交修改密码
    submitForm (formName) {
      let { pwdOld, pwdNew, checkPass } = this.ruleForm
      if (pwdOld === '' || pwdNew === '' || checkPass === '') {
        this.$refs[formName].validateField('pwdOld')
        this.$refs[formName].validateField('pwdNew')
        this.$refs[formName].validateField('checkPass')
      } else {
        const params = {
          pwd_old: this.ruleForm.pwdOld,
          pwd_new: this.ruleForm.pwdNew
        }
        this.$ajax.patch(`/mer/user/pwd/${1}/${this.modifyPasAccount}`, params).then(res => {
          this.showPasForm = false
          if (res.Code === 200) {
            this.$message({ type: 'success', message: res.Content })
          } else {
            this.$message({ type: 'error', message: res.Content })
          }
        })
      }
    },
    // 取消修改---清除表单验证信息
    cancelForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 选择行
    selectChange (val) {
      this.multipleSelection = val
    },
    // 编辑事件
    editAction (row) {
      this.staffID = row.Id
      this.$refs.staffDialog.$emit('open', this.staffID)
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
