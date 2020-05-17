<template>
  <!-- 编辑表单 -->
  <el-dialog :title="id?'编辑部门':'新增部门'" :visible.sync="IsShowDialog" @close="cancel('editform')">
    <el-form :model="form" ref="editform" label-position="right" label-width="120px" :rules="rules">
      <el-row>
        <el-col :span="10">
          <el-form-item label="所属分店" prop="ShopCode">
            <el-select v-model="form.ShopCode" style="width:100%" placeholder="请选择所属分店">
              <el-option :label="ShopName" :value="ShopCode" v-for="{ShopCode,ShopName} in shoplist" :key="ShopCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="部门名称" prop="DepartmentName">
            <el-input v-model="form.DepartmentName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="负责人" prop="Manager">
            <el-input v-model="form.Manager"></el-input>
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
          <el-form-item label="是否启用" prop="IsEnabled">
            <el-radio-group v-model="form.IsEnabled">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="职位描述" prop="Remark">
            <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.Remark" placeholder="请输入职位描述说明（100字以内）"></el-input>
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
        DepartmentName: '',
        Manager: '',
        Phone: '',
        IsEnabled: true,
        Remark: ''
      },
      shoplist: [],
      rules: {
        ShopCode: [
          { required: true, message: '请选择所属门店', trigger: 'blur' }
        ],
        DepartmentName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        Manager: [
          { required: true, message: '请输入负责人', trigger: 'blur' }
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
      this.cancel('editform')
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
    // 根据id
    initMenu () {
      this.$ajax.get(`/mer/dep/${this.id}`).then(res => {
        this.form = res.Data
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
