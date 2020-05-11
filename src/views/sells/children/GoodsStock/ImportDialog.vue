<template>
  <!-- 编辑表单 -->
  <el-dialog title="批量导入产品" :visible.sync="IsShowDialog" @close="cancel" width="70%">
    <el-form inline :model="formInline">
      <el-form-item label="所属分店">
        <el-select v-model="formInline.region" placeholder="请选择所属分店">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-download" @click="onSubmit">下载模板</el-button>
        <el-upload class="upload-btns" action="https://jsonplaceholder.typicode.com/posts/" :on-remove="handleRemove" :before-remove="beforeRemove">
          <el-button type="primary" icon="el-icon-upload" @click="onSubmit">Excel上传</el-button>
        </el-upload>
        <el-button type="primary" icon="el-icon-check" @click="onSubmit">确定入库</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%" empty-text="请上传数据" height="300px">
      <el-table-column prop="name" label="商品条码">
      </el-table-column>
      <el-table-column prop="name" label="商品名称">
      </el-table-column>
      <el-table-column prop="name" label="商品简码">
      </el-table-column>
      <el-table-column prop="name" label="商品分类">
      </el-table-column>
      <el-table-column prop="name" label="商品类型">
      </el-table-column>
      <el-table-column prop="name" label="进货价格">
      </el-table-column>
      <el-table-column prop="name" label="零售价格">
      </el-table-column>
      <el-table-column prop="date" label="备注信息">
      </el-table-column>
      <el-table-column prop="address" label="数据准确性">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
export default {
  props: {},
  data () {
    return {
      IsShowDialog: false,
      formInline: {},
      tableData: []
    }
  },
  mounted () {
    this.$on('open', (val) => {
      this.IsShowDialog = true
    })
    this.$on('hide', () => {
      this.IsShowDialog = false
    })
  },
  methods: {
    handleRemove () {

    },
    beforeRemove () {

    },
    onSubmit () {

    },
    // 取消
    cancel () {
      this.IsShowDialog = false
    },
    // 提交
    confirm () {

    }
  }
}
</script>
<style lang="less" scoped>
.upload-btns {
  display: inline-block;
  margin: 0 14px;
}
</style>
