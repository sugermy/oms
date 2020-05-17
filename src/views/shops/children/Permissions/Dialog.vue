<template>
  <!-- 编辑表单 -->
  <el-dialog :title="id?'编辑模板':'新增模板'" :visible.sync="IsShowDialog" @close="cancel('editform')">
    <el-form :model="form" ref="editform" label-position="right" label-width="120px" :rules="rules">
      <el-row>
        <el-col :span="20">
          <el-form-item label="模板名称" prop="RoleName">
            <el-input v-model="form.RoleName" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
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
        RoleName: '',
        IsEnabled: true,
        Remark: ''
      },
      rules: {
        RoleName: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
          { min: 2, max: 20, message: '最大不超过20字符', trigger: 'blur' }
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
    // 根据id
    initMenu () {
      this.$ajax.get(`/mer/role/${this.id}`).then(res => {
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
