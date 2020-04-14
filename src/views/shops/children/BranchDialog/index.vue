<template>
  <!-- 编辑表单 -->
  <el-dialog :title="id?'编辑分店':'新增分店'" :visible.sync="IsShowDialog" @close="cancel('editform')">
    <el-form :model="form" ref="editform" label-position="right" label-width="120px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="店铺名称">
            <el-input v-model="form.ShopName" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="店铺编号">
            <el-input v-model="form.ShopCode" readonly>
              <el-button type="primary" @click="getShopCode" slot="append">更换编号</el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>

        <el-col :span="10">
          <el-form-item label="店铺负责人">
            <el-input v-model="form.Manager" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系电话">
            <el-input v-model="form.Phone" maxlength="11"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="门店类型">
            <el-radio-group v-model="form.IsFlagShip">
              <el-radio :label="true">总店</el-radio>
              <el-radio :label="false">分店</el-radio>
            </el-radio-group>
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
          <el-form-item label="店铺地址">
            <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.Address" placeholder="请输入店铺地址（200字以内）"></el-input>
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
      <el-button type="primary" @click="confirm">确 定</el-button>
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
      }
    }
  },
  mounted () {
    this.$on('open', (val) => {
      this.id = val
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
    // 获取分店编号
    getShopCode () {
      this.$ajax.get('/mer/shop').then(res => {
        this.form.ShopCode = res.Data
      })
    },
    // 根据id
    initMenu () {
      this.$ajax.get(`/mer/shop/${this.id}`).then(res => {
        this.form = res.Data
        // if (this.id === 0) {
        //   this.getShopCode()
        // }
      })
    },
    // 取消
    cancel (formName) {
      this.IsShowDialog = false
      this.$refs[formName].resetFields()
    },
    // 提交
    confirm () {
      this.$emit('confirm', this.form)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
