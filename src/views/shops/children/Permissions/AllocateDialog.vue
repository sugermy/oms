<template>
  <!-- 编辑权限 -->
  <el-dialog title="编辑权限" :visible.sync="IsShowDialog" @close="cancel()">
    <el-collapse accordion>
      <!-- 一级目录 -->
      <template v-for="(catalogItem,catalogIdx) in checkGroups">
        <el-collapse-item :key="catalogIdx">
          <template slot="title">
            <el-checkbox @click.stop.native v-model="catalogItem.ischecked" @change="handleChecked(catalogItem)">{{catalogItem.label}}</el-checkbox>
          </template>
          <!-- 二级菜单 -->
          <el-collapse v-for="(menuItem,menuIdx) in catalogItem.children" :key="menuIdx">
            <el-collapse-item :disabled="!menuItem.children||menuItem.children.length<1">
              <template slot="title">
                <el-checkbox @click.stop.native v-model="menuItem.ischecked" @change="handleChecked(menuItem,catalogItem)">{{menuItem.label}}
                </el-checkbox>
              </template>
              <!-- 三级按钮 -->
              <el-checkbox v-for="(btnItem,btnIdx) in menuItem.children" :key="btnIdx" @click.stop.native v-model="btnItem.ischecked"
                @change="handleChecked(btnItem,menuItem,catalogItem)">
                {{btnItem.label}}</el-checkbox>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
      </template>
    </el-collapse>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="confirm()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {},
  data () {
    return {
      IsShowDialog: false,
      checked: false,
      checkGroups: [
        {
          ischecked: false,
          label: '系统管理',
          children: [
            {
              ischecked: false,
              label: '系统菜单',
              children: [
                {
                  ischecked: false,
                  label: '新增'
                },
                {
                  ischecked: false,
                  label: '编辑'
                },
                {
                  ischecked: false,
                  label: '删除'
                }
              ]
            },
            {
              ischecked: false,
              label: '页面按钮',
              children: [
                {
                  ischecked: false,
                  label: '新增'
                },
                {
                  ischecked: false,
                  label: '编辑'
                },
                {
                  ischecked: false,
                  label: '删除'
                }
              ]
            },
            {
              ischecked: false,
              label: '授权信息'
            },
            {
              ischecked: false,
              label: '历史数据',
              children: [
                {
                  ischecked: false,
                  label: '新增'
                },
                {
                  ischecked: false,
                  label: '编辑'
                },
                {
                  ischecked: false,
                  label: '删除'
                }
              ]
            },
            {
              ischecked: false,
              label: '打印设置'
            }
          ]
        },
        {
          ischecked: false,
          label: '店铺管理',
          children: [
            {
              ischecked: false,
              label: '分店管理'
            },
            {
              ischecked: false,
              label: '终端管理',
              children: [
                {
                  ischecked: false,
                  label: '新增'
                },
                {
                  ischecked: false,
                  label: '编辑'
                },
                {
                  ischecked: false,
                  label: '删除'
                }
              ]
            },
            {
              ischecked: false,
              label: '部门管理'
            },
            {
              ischecked: false,
              label: '员工管理'
            },
            {
              ischecked: false,
              label: '权限模板'
            }
          ]
        }
      ]
    }
  },
  mounted () {
    this.$on('open', (val) => {
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

    },
    // 多选改变事件
    handleChecked (item, fatherItem, grandfatherItem) {
      if (item.ischecked) {
        if (fatherItem) fatherItem.ischecked = true
        if (grandfatherItem) grandfatherItem.ischecked = true
      } else {
        this.findChilde(item)
      }
    },
    // 递归查找子节点
    findChilde (item) {
      if (item.children && Array.isArray(item.children) && item.children.length > 0) {
        item.children.forEach(el => {
          el.ischecked = false
          this.findChilde(el)
        })
      } else {
        item.ischecked = false
      }
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
/deep/ .el-collapse-item__content {
  margin-left: 30px;
}
/deep/.el-collapse-item.is-disabled .el-collapse-item__header {
  cursor: default;
  .el-collapse-item__arrow {
    display: none;
  }
}
</style>
