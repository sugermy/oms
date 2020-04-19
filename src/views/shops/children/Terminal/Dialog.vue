<template>
  <!-- 编辑表单 -->
  <el-dialog :title="id?'编辑终端':'新增终端'" :visible.sync="IsShowDialog" @close="cancel('editform')">
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
          <el-form-item label="终端编号">
            <el-input v-model="form.TerminalNo" readonly>
              <el-button type="primary" @click="getTerminalCode" slot="append">更换编号</el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="终端名称" prop="TerminalName">
            <el-input v-model="form.TerminalName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="摆放位置" prop="Position">
            <el-input v-model="form.Position"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="IP地址" prop="IPAddress">
            <el-input v-model="form.IPAddress" maxlength="11"></el-input>
          </el-form-item>
        </el-col>
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
        TerminalNo: '',
        TerminalName: '',
        Position: '',
        IPAddress: '',
        IsEnabled: true,
        Remark: ''
      },
      shoplist: [],
      rules: {
        ShopCode: [
          { required: true, message: '请选择所属门店', trigger: 'blur' }
        ],
        TerminalName: [
          { required: true, message: '请输入终端名称', trigger: 'blur' }
        ],
        IPAddress: [
          { required: true, message: '请输入IP地址', trigger: 'blur' }
        ],
        Position: [
          { required: true, message: '请输入摆放位置', trigger: 'blur' }
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
    // 获取终端编号
    getTerminalCode () {
      this.$ajax.get('/mer/ter/p').then(res => {
        this.form.TerminalNo = res.Data
      })
    },
    // 获取分店列表
    getShopList () {
      this.$ajax.get('/mer/pub/shop').then(res => {
        this.shoplist = res.Data || []
      })
    },
    // 根据id
    initMenu () {
      this.$ajax.get(`/mer/ter/${this.id}`).then(res => {
        this.form = res.Data
        if (this.id === 0) {
          this.getTerminalCode()
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
