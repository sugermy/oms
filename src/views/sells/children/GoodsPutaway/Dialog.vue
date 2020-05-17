<template>
  <!-- 编辑表单 -->
  <el-dialog :title="id?'编辑上架产品':'新增上架产品'" :visible.sync="IsShowDialog" @close="cancel('editform')">
    <el-tabs v-model="activeType" type="card" @tab-click="handleTab">
      <el-tab-pane label="基础信息" name="1"></el-tab-pane>
      <el-tab-pane label="库存配置" name="2"></el-tab-pane>
      <el-tab-pane label="提成配置" name="3"></el-tab-pane>
      <el-tab-pane label="积分配置" name="4"></el-tab-pane>
      <el-tab-pane label="优惠配置" name="5"></el-tab-pane>
    </el-tabs>
    <el-form :model="form" ref="editform" label-Password="right" label-width="120px">
      <!-- 基础信息 -->
      <el-row v-show="activeType==='1'">
        <el-row>
          <el-col :span="10">
            <el-form-item label="所属分店" prop="ShopCode">
              <el-select v-model="form.ShopCode" style="width:100%" placeholder="请选择所属分店" @change="changeCode">
                <el-option :label="ShopName" :value="ShopCode" v-for="{ShopCode,ShopName} in shoplist" :key="ShopCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="产品类型" prop="ProductCategory">
              <el-select v-model="form.ProductCategory" style="width:100%" placeholder="请选择所属分店">
                <el-option label="香烟" value="香烟"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品名称" prop="ProductName">
              <el-input v-model="form.ProductName" placeholder="请输入商品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="商品简码" prop="PCode">
              <el-input v-model="form.PCode" placeholder="请输入商品简码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品条码" prop="CodeType">
              <el-select v-model="form.CodeType" style="width:100%" placeholder="请选择生成商品条码类型">
                <el-option label="系统生成" :value="false"></el-option>
                <el-option label="手动输入" :value="true"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="条码值" prop="ProductCode">
              <el-input v-model="form.ProductCode" readonly>
                <el-button type="primary" @click="getProductCode" slot="append">更换编号</el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="进货价格" prop="Price_Purchase">
              <el-input-number v-model="form.Price_Purchase" :controls="false" :precision="2" :step="0.01"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="售卖价格" prop="Price_Sell">
              <el-input-number v-model="form.Price_Sell" :controls="false" :precision="2" :step="0.01"></el-input-number>
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
      </el-row>
      <!-- 库存配置 -->
      <el-row v-show="activeType==='2'">
        <el-row>
          <el-col :span="10">
            <el-form-item label="是否启用" prop="Stock_Start">
              <el-radio-group v-model="form.Stock_Start">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="form.Stock_Start">
          <el-col :span="10">
            <el-form-item label="总库存" prop="Stock_Total">
              <el-input v-model="form.Stock_Total" placeholder="请输入总库存"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-row>
      <!-- 提成配置 -->
      <el-row v-show="activeType==='3'">
        <el-row>
          <el-col :span="10">
            <el-form-item label="是否开启" prop="Commision_Start">
              <el-radio-group v-model="form.Commision_Start">
                <el-radio :label="true">开启</el-radio>
                <el-radio :label="false">无提成</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="form.Commision_Start">
          <el-col :span="10">
            <el-form-item label="提成比例" prop="Commision_Scale" class="selet-input">
              <el-input placeholder="请输入提成比例" v-model="form.Commision_Scale">
                <el-select v-model="form.Commision_Type" slot="prepend" placeholder="请选择">
                  <el-option label="固定" :value="1"></el-option>
                  <el-option label="百分比" :value="2"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-row>
      <!-- 积分配置 -->
      <el-row v-show="activeType==='4'">
        <el-row>
          <el-col :span="10">
            <el-form-item label="积分赠送" prop="Integral_gift_abled">
              <el-radio-group v-model="form.Integral_gift_abled">
                <el-radio :label="true">开启</el-radio>
                <el-radio :label="false">无积分</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="form.Integral_gift_abled">
          <el-col :span="10">
            <el-form-item label="积分数" prop="Integral_gift_num" class="selet-input">
              <el-input placeholder="请输入积分数" v-model="form.Integral_gift_num">
                <el-select v-model="form.Integral_gift_type" slot="prepend" placeholder="请选择">
                  <el-option label="固定" :value="1"></el-option>
                  <el-option label="百分比" :value="2"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="积分兑换" prop="Integral_exchange_abled">
              <el-radio-group v-model="form.Integral_exchange_abled">
                <el-radio :label="true">允许</el-radio>
                <el-radio :label="false">不允许</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="form.Integral_exchange_abled">
          <el-col :span="10">
            <el-form-item label="所需积分" prop="Integral_exchange_num">
              <el-input v-model="form.Integral_exchange_num" placeholder="请输入所需积分"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="form.Integral_exchange_abled">
          <el-col :span="10">
            <el-form-item label="兑换限制" prop="Integral_exchange_limit">
              <el-radio-group v-model="form.Integral_exchange_limit">
                <el-radio :label="true">允许</el-radio>
                <el-radio :label="false">不允许</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="form.Integral_exchange_abled&&form.Integral_exchange_limit">
          <el-col :span="10">
            <el-form-item label="时间区间" prop="jtimes">
              <el-date-picker v-model="form.jtimes" type="daterange" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :editable="false" range-separator="-" start-placeholder="开始日期"
                end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-row>
      <!-- 优惠配置 -->
      <el-row v-show="activeType==='5'">
        <el-row>
          <el-col :span="10">
            <el-form-item label="打折优惠" prop="Discount_Start">
              <el-radio-group v-model="form.Discount_Start">
                <el-radio :label="true">开启</el-radio>
                <el-radio :label="false">无折扣</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="form.Discount_Start">
          <el-col :span="10">
            <el-form-item label="最低折扣" prop="Discount_Num">
              <el-input v-model="form.Discount_Num" placeholder="请输入最低折扣"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
        ProductCategory: '',
        ProductName: '',
        PCode: '',
        CodeType: false,
        ProductCode: '',
        Price_Purchase: null,
        Price_Sell: null,
        Remark: '',
        Stock_Start: true,
        Stock_Total: '',
        Commision_Start: true,
        Commision_Type: 1,
        Commision_Scale: '',
        Integral_gift_abled: true,
        Integral_gift_type: 1,
        Integral_gift_num: '',
        Integral_exchange_abled: true,
        Integral_exchange_num: '',
        Integral_exchange_limit: true,
        jtimes: [], // 时间需要格式化
        Discount_Start: true,
        Discount_Num: ''
      },
      activeType: '1',
      shoplist: []
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
    // tab切换
    handleTab () {
      console.log(this.activeType)
    },
    // 获取条码编号
    getProductCode () {
      this.$ajax.get('/pro/base/getcode').then(res => {
        this.form.ProductCode = res.Data
      })
    },
    // 获取分店列表
    getShopList () {
      this.$ajax.get('/mer/pub/shop').then(res => {
        this.shoplist = res.Data || []
      })
    },
    // 分店下拉改变
    changeCode (code) {
      this.getProductType(code)
      let shopOne = this.shoplist.filter(el => el.ShopCode === code)[0]
      this.form.ShopName = shopOne.ShopName
    },
    // 根据分店获取产品类型
    getProductType (code) {
      this.$ajax.get(`/pro/pub/type/${code}`).then(res => {
        console.log(res)
      })
    },
    // 根据id
    initMenu () {
      this.$ajax.get(`/pro/base/${this.id}`).then(res => {
        this.form = res.Data
      })
    },
    // 取消
    cancel (formName) {
      this.IsShowDialog = false
      this.activeType = '1'
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
.selet-input {
  /deep/.el-select .el-input {
    width: 90px;
  }
}
/deep/.el-input-number {
  width: 100%;
}
</style>
