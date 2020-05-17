<template>
  <!-- 编辑表单 -->
  <el-dialog :title="id?'编辑分店':'新增分店'" :visible.sync="IsShowDialog" @close="cancel('editform')">
    <el-form :model="form" ref="editform" label-position="right" label-width="120px" :rules="rules">
      <el-row>
        <el-col :span="10">
          <el-form-item label="店铺名称" prop="ShopName">
            <el-input v-model="form.ShopName" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="店铺编号" prop="ShopCode">
            <el-input v-model="form.ShopCode" readonly>
              <el-button type="primary" @click="getShopCode" slot="append">更换编号</el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="店铺负责人" prop="Manager">
            <el-input v-model="form.Manager" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系电话" prop="Phone">
            <el-input v-model="form.Phone" maxlength="11"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="门店类型" prop="IsFlagShip">
            <el-radio-group v-model="form.IsFlagShip">
              <el-radio :label="true">总店</el-radio>
              <el-radio :label="false">分店</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
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
          <el-form-item label="店铺地址" prop="Address">
            <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.Address" placeholder="请输入店铺地址（200字以内）"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="备注" prop="Remark">
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
        ShopName: 1,
        ShopCode: '',
        Manager: '',
        Phone: '',
        IsFlagShip: false,
        IsEnabled: true,
        Address: '',
        Remark: ''
      },
      rules: {
        ShopName: [
          { required: true, message: '请输入店铺名称', trigger: 'blur' },
          { min: 2, max: 20, message: '最大不超过20字符', trigger: 'blur' }
        ],
        Manager: [
          { required: true, message: '请输入店铺负责人', trigger: 'blur' }
        ],
        Phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          {
            pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
            message: '联系电话格式不正确',
            trigger: 'blur'
          }
        ],
        Address: [
          { required: true, message: '请输入店铺地址', trigger: 'blur' },
          { min: 2, max: 100, message: '最大不超过100字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.$on('open', (val) => {
      this.id = val
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
    // 获取分店编号
    getShopCode () {
      this.$ajax.get('/mer/shop/p/code').then(res => {
        this.form.ShopCode = res.Data
      })
    },
    // 根据id
    initMenu () {
      this.$ajax.get(`/mer/shop/${this.id}`).then(res => {
        this.form = res.Data
        if (this.id === 0) {
          this.getShopCode()
        }
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
