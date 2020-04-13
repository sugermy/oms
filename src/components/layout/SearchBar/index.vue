<template>
  <div class="el-search-area" ref="searchbar">
    <div class="el-search-right">
      <!-- 面包屑内容定义 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="link-href" @click.native="gohome">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{attributes.breadcrumb.name}}</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 顶部按钮定义 -->
      <div class="action-btns">
        <!-- 自定义查询条件start -->
        <el-popover placement="left-start" style="margin-right:10px" width="400" trigger="hover" v-if="attributes.isDefinedSearch">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAll">全选</el-checkbox>
          <div style="margin: 10px 0;"></div>
          <el-checkbox-group v-model="checkedItems" @change="handleCheckedItem">
            <el-checkbox v-for="item in searchlist" :label="item.label" :key="item.prop">{{item.label}}</el-checkbox>
          </el-checkbox-group>
          <el-button slot="reference">自定义查询</el-button>
        </el-popover>
        <!-- 自定义查询条件end -->

        <!-- 操作按钮组start -->
        <el-button type="primary" v-if="attributes.buttonlist.isReload" icon="el-icon-refresh" @click="pageReload">刷新</el-button>
        <el-button type="primary" v-if="attributes.buttonlist.isNew" icon="el-icon-plus" @click="pageNew">新增</el-button>
        <el-button type="primary" v-if="attributes.buttonlist.isDelete" icon="el-icon-delete" @click="pageDelete">删除</el-button>
        <el-dropdown v-if="attributes.buttonlist.isMore&&attributes.buttonlist.isMore.length>0">
          <el-button type="primary">
            更多<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item,index) in attributes.buttonlist.isMore" :key="index" @click.native="pageUpdate(item.type)">{{item.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 操作按钮组end -->
      </div>
    </div>

    <!-- form属性绑定 -->
    <el-form ref="searchform" class="el-search-left" :model="searchform" inline :label-width="attributes.labelWidth?attributes.labelWidth:'auto'">
      <!-- 遍历查询选项 template模板标签不渲染-->
      <template v-for="(item,index) in searchlist">
        <!-- 默认类型 -->
        <template v-if="(!item.type||item.type==='input')&&item.isShow">
          <el-form-item :label="item.label" :key="index" :prop="item.prop">
            <el-input v-model="searchform[item.prop]" :placeholder="`请输入${item.label}`"></el-input>
          </el-form-item>
        </template>

        <!-- 下拉类型 -->
        <template v-if="item.type==='select'&&item.isShow">
          <el-form-item :label="item.label" :key="index" :prop="item.prop">
            <el-select v-model="searchform[item.prop]" :placeholder="`请选择${item.label}`">
              <el-option v-for="(el,idx) in item.options" :key="idx" :label="el.MenuName" :value="el.MenuID"></el-option>
            </el-select>
          </el-form-item>
        </template>

        <!-- 时间类型 普通类型 -->
        <template v-if="item.type==='date'&&item.isShow">
          <el-form-item :label="item.label" :key="index" :prop="item.prop">
            <el-date-picker v-model="searchform[item.prop]" type="date" :value-format="item.format" :format="item.format" :editable="false" :placeholder="`请选择${item.label}`">
            </el-date-picker>
          </el-form-item>
        </template>

        <!-- 时间类型  区间类型 -->
        <template v-if="item.type==='daterange'&&item.isShow">
          <el-form-item :label="item.label" :key="index" :prop="item.prop">
            <el-date-picker v-model="searchform[item.prop]" type="daterange" :value-format="item.format" :format="item.format" :editable="false" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </template>

      </template>
      <!-- 查询按钮组start -->
      <el-row v-if="checkedItems.length>0">
        <el-form-item label=" ">
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-row>
      <!-- 查询按钮组end -->

    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    // 接收节点配置项
    attributes: Object
  },
  data () {
    // 对传入的查询选项遍历-动态声明查询表单的各个key
    const filterFome = () => {
      if (this.attributes.labelItems && Array.isArray(this.attributes.labelItems)) {
        return this.attributes.labelItems.reduce((obj, item) => {
          obj[item.prop] = ''
          return obj
        }, {})
      } else {
        return {}
      }
    }
    // 拷贝数据---防止二次操作引起源数据变化
    const searchData = JSON.parse(JSON.stringify(this.attributes.labelItems))
    const checkedData = searchData.filter(el => {
      return el.isShow === true
    }).map(el => el.label)

    return {
      searchform: filterFome(), // 查询表单项
      checkAll: checkedData.length === searchData.length, // 初始化是否全选激活
      checkedItems: checkedData, // 默认选中数组
      searchlist: this.attributes.labelItems, // 多选选项
      isIndeterminate: checkedData.length !== searchData.length// 设置 indeterminate 状态，只负责正反选样式控制
    }
  },
  computed: {
    clickNumber () {
      return this.$store.state.openMenu.clickNum
    }
  },
  methods: {
    onSearch () {
      // 查询触发父级事件
      const newObj = Object.entries(this.searchform).reduce((obj, [k, v]) => {
        if (Array.isArray(v)) {
          v = v.join(',')
        }
        v && (obj[k] = v)
        return obj
      }, {})
      this.$emit('query', newObj)
    },
    // 重置查询条件
    onReset () {
      this.$refs.searchform.resetFields()
    },
    // 当前页面刷新
    pageReload () {
      window.location.reload()
    },
    // 返回首页
    gohome () {
      this.$router.push('/oms').then(() => {
        this.$store.dispatch('actionOpenMenu', { path: this.attributes.breadcrumb.parent, clickNum: this.clickNumber + 1 })
      })
    },
    // 新增项
    pageNew () {
      this.$emit('addnew')
    },
    // 批量删除
    pageDelete () {
      this.$emit('delete')
    },
    // 批量操作
    pageUpdate (v) {
      this.$emit('update', v)
    },
    // 选择查询条件显示隐藏需要计算高度重新赋值表格高度
    reloadHeight () {
      // 获取元素高度
      var h = document.documentElement.clientHeight || document.body.clientHeight
      this.$parent.$data.tableHeight = h - this.$refs.searchbar.offsetHeight - 160
    },
    // 正反选
    handleCheckAll (val) {
      this.onReset()// 当查询条件有变化时重置表单已填充数据
      this.isIndeterminate = false
      if (val) {
        // 全选显示图标
        this.checkedItems = this.searchlist.map(el => el.label)
        // 全选显示数据
        this.searchlist.forEach(el => { el.isShow = true })
      } else {
        // 清空全选
        this.checkedItems = []
        this.searchlist.forEach(el => { el.isShow = false })
      }
      this.$nextTick(() => {
        this.reloadHeight()
      })
    },
    // 选项选中取消事件
    handleCheckedItem (value) {
      this.onReset()
      // 按钮状态-图标
      const checkedCount = value.length
      this.checkAll = checkedCount === this.searchlist.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.searchlist.length
      // 显示隐藏
      this.searchlist.forEach((el, idx) => {
        if (!value.includes(el.label)) {
          el.isShow = false
        } else {
          el.isShow = true
        }
      })
      this.$nextTick(() => {
        this.reloadHeight()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-search-area {
  .el-search-right {
    display: flex;
    justify-content: space-between;
    .el-dropdown {
      margin-left: 10px;
    }
  }
  .el-search-left {
    padding-top: 20px;
  }
}
// 输入框宽度限制
/deep/.el-input,
.el-select,
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 240px;
}
</style>
