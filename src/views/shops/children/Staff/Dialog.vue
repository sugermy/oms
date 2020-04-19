<template>
  <!-- 编辑表单 -->
  <el-dialog :title="id?'编辑员工':'新增员工'" :visible.sync="IsShowDialog" @close="cancel('editform')">
    <el-form :model="form" ref="editform" label-Password="right" label-width="120px" :rules="rules">
      <el-row>
        <el-col :span="10">
          <el-form-item label="所属分店" prop="ShopCode">
            <el-select v-model="form.ShopCode" style="width:100%" placeholder="请选择所属分店" @change="changeCode">
              <el-option :label="ShopName" :value="ShopCode" v-for="{ShopCode,ShopName} in shoplist" :key="ShopCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="所属部门" prop="DepartmentId">
            <el-select v-model="form.DepartmentId" style="width:100%" placeholder="请选择所属部门">
              <el-option :label="DepartmentName" :value="ID" v-for="{ID,DepartmentName} in departmentlist" :key="ID"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="登录帐号" prop="Account">
            <el-input v-model="form.Account" :readonly="id?true:false"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="登录密码" prop="Password">
            <el-input v-model="form.Password" :readonly="id?true:false"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="员工姓名" prop="RealName">
            <el-input v-model="form.RealName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系电话" prop="Phone">
            <el-input v-model="form.Phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="是否启用">
            <el-radio-group v-model="form.IsEnabled">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="备注">
            <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.Remark" placeholder="请输入备注说明（200字以内）"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('editform')">取 消</el-button>
      <el-button type="primary" @click="confirm('editform')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {},
  data () {
    return {
      IsShowDialog: false,
      id: null,
      form: {
        ID: 0,
        ShopCode: '',
        DepartmentId: '',
        Account: '',
        Password: '',
        RealName: '',
        Phone: '',
        IsEnabled: true,
        Remark: ''
      },
      shoplist: [],
      departmentlist: [],
      rules: {
        ShopCode: [
          { required: true, message: '请选择所属门店', trigger: 'blur' }
        ],
        DepartmentId: [
          { required: true, message: '请选择所属部门', trigger: 'change' }
        ],
        Account: [
          { required: true, message: '请输入登录帐号', trigger: 'blur' }
        ],
        Password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ],
        RealName: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        Phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          {
            pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
            message: '联系电话格式不正确',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.$on('open', (val) => {
      this.id = val
      this.getShopList()
      this.openAction()
    })
    this.$on('hide', () => {
      this.IsShowDialog = false
    })
  },
  methods: {
    // 监听动态变化
    openAction () {
      this.IsShowDialog = true
      this.initMenu()
    },
    // 获取分店列表
    getShopList () {
      this.$ajax.get('/mer/pub/shop').then(res => {
        this.shoplist = res.Data || []
      })
    },
    // 分店下拉改变
    changeCode (code) {
      this.getDepList(code)
    },
    // 获取部门列表
    getDepList (code) {
      this.$ajax.get(`/mer/user/p/${code}`).then(res => {
        this.departmentlist = res.Data || []
      })
    },
    // 根据id
    initMenu () {
      this.$ajax.get(`/mer/user/${this.id}`).then(res => {
        this.form = res.Data
        this.getDepList(this.form.ShopCode)
      })
    },
    // 取消
    cancel (formName) {
      this.IsShowDialog = false
      this.$refs[formName].resetFields()
    },
    // 提交
    confirm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('confirm', this.form)
        } else {
          // 非空验证失败
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
