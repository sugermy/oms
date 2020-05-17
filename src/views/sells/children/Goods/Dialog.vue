<template>
  <!-- 编辑表单 -->
  <el-dialog :title="id?'编辑分类':'新增分类'" :visible.sync="IsShowDialog" @close="cancel('editform')">
    <el-form :model="form" ref="editform" label-position="right" label-width="120px" :rules="rules">
      <el-row>
        <el-col :span="10">
          <el-form-item label="所属分店" prop="ShopCode">
            <el-select v-model="form.ShopCode" style="width:100%" placeholder="请选择所属分店" @change="changeCode">
              <el-option :label="ShopName" :value="ShopCode" v-for="{ShopCode,ShopName} in shoplist" :key="ShopCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="分类名称" prop="CategoryName">
            <el-input v-model="form.CategoryName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="分类类型" prop="CategoryType">
            <el-radio-group v-model="form.CategoryType" @change="changeType">
              <el-radio :label="1">产品分类</el-radio>
              <el-radio :label="2">产品类型</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="父级分类" prop="ParentCode">
            <el-select v-model="form.ParentCode" style="width:100%" placeholder="请选择父级分类" @change="changeCode">
              <el-option :label="ParentName" :value="CategoryCode" v-for="{CategoryCode,ParentName} in categoryList" :key="CategoryCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="备注" prop="Remark">
            <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.Remark" placeholder="请输入备注说明（100字以内）"></el-input>
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
        CategoryName: 1,
        CategoryType: 1,
        ParentCode: 0,
        Remark: ''
      },
      shoplist: [],
      categoryList: [],
      rules: {
        ShopCode: [
          { required: true, message: '请选择所属门店', trigger: 'blur' }
        ],
        ParentCode: [
          { required: false, message: '请选择父级分类', trigger: 'blur' }
        ],
        CategoryName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
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
    // 分店下拉改变
    changeCode (code) {
      this.getCategoryList(code)
    },
    // 分类类型
    changeType (type) {
      type === 1 ? this.rules.ParentCode[0].required = false : this.rules.ParentCode[0].required = true
      this.getCategoryList(this.form.ShopCode)
    },
    // 获取父级分类
    getCategoryList (code) {
      this.$ajax.get(`/pro/pub/type/${code}?gettype=${this.form.CategoryType}`).then(res => {
        this.categoryList = res.Data || []
      })
    },
    // 根据id
    initMenu () {
      this.$ajax.get(`/pro/type/${this.id}`).then(res => {
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
