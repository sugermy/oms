<template>
  <!-- 编辑表单 -->
  <el-dialog :title="id?'编辑菜单':'新增菜单'" :visible.sync="IsShowDialog" @close="cancel('editform')">
    <el-form :model="form" ref="editform" label-position="right" label-width="120px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="菜单类型">
            <el-radio-group v-model="form.Category">
              <el-radio :label="1">目录</el-radio>
              <el-radio :label="2">页面</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10" v-show="form.Category!==1">
          <el-form-item label="父级菜单">
            <el-select v-model="form.ParentID" style="width:100%" placeholder="请选择父级菜单">
              <template v-for="(item,index) in form.ParentList">
                <el-option v-show="form.Category!==1&&item.MenuID!==0" :key="index" :label="item.MenuName" :value="item.MenuID"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="菜单名称">
            <el-input v-model="form.MenuName" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="菜单图标">
            <el-input v-model="form.Icon" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="排序号">
            <el-input v-model="form.SortCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="是否启用">
            <el-radio-group v-model="form.IsEnabled">
              <el-radio :label="true">启用</el-radio>
              <el-radio :label="false">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="菜单地址">
            <el-input v-model="form.LocationUrl"></el-input>
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
        Category: 1,
        ParentID: '',
        MenuName: '',
        Icon: '',
        SortCode: '',
        IsEnabled: true,
        LocationUrl: '',
        ParentList: []
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
    // 根据id
    initMenu () {
      this.$ajax.get(`/admin/menu/${this.id}`).then(res => {
        this.form = res.Data
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
