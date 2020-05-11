<template>
  <!-- 编辑表单 -->
  <el-dialog :title="id?'编辑菜单':'新增菜单'" :visible.sync="IsShowDialog" @close="cancel('editform')">
    <el-form :model="form" label-position="right" ref="editform" label-width="120px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="所属菜单">
            <el-select v-model="form.MenuID" style="width:100%" placeholder="请选择所属菜单" @change="menuChange">
              <el-option v-for="(item,index) in memulist" :key="index" :label="item.MenuName" :value="item.MenuID"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" :push="1">
          <el-form-item label="父级按钮">
            <el-select v-model="form.ParentID" style="width:100%" placeholder="请选择父级按钮">
              <el-option v-for="(item,index) in btnlist" :key="index" :label="item.ButtonName" :value="item.ButtonID"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="按钮名称">
            <el-input v-model.trim="form.ButtonName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :push="1">
          <el-form-item label="按钮图标">
            <el-input v-model.trim="form.FontCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="JS事件Code">
            <el-input v-model.trim="form.JsEvent"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :push="1">
          <el-form-item label="排序号">
            <el-input v-model.trim="form.SortCode"></el-input>
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
  props: {
    isShow: Boolean
  },
  data () {
    return {
      IsShowDialog: false,
      id: null,
      memulist: [],
      btnlist: [],
      form: {
        MenuID: '',
        ParentID: '',
        ButtonName: '',
        FontCode: '',
        JsEvent: '',
        SortCode: ''
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
      this.getMenulist()
    },
    // 获取所属菜单选项
    getMenulist () {
      this.$ajax.get('/admin/button/parent').then(res => {
        if (res.Code === 200) {
          this.memulist = res.Data
          if (this.id !== 0) this.initMenu()
        }
      })
    },
    // 根据id初始化数据
    initMenu () {
      this.$ajax.get(`/admin/button/${this.id}`).then(res => {
        this.form = res.Data
        this.menuChange(this.form.MenuID, this.form.ParentID)
      })
    },
    // 所属菜单变化获取父级按钮
    menuChange (val, ParentID) {
      this.form.ParentID = ''
      this.$ajax.get(`/admin/button/parent/${val}`).then(res => {
        if (res.Code === 200) {
          this.btnlist = res.Data
          if (ParentID !== 'undefined') {
            this.form.ParentID = ParentID
          }
        }
      })
    },
    // 取消
    cancel (formName) {
      this.IsShowDialog = false
      this.$refs[formName].resetFields()
    },
    // 提交
    confirm () {
      this.form.ButtonID = this.id
      this.$emit('confirm', this.form)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
