<template>
  <el-container class="main-content">
    <!-- 头部s -->
    <el-header class="header">
      <h3 class="header-left" @click="backHome">贺米粒科技</h3>
      <div class="header-right">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{$store.state.users.RealName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="showSysInfo">系统信息</el-dropdown-item>
            <el-dropdown-item @click.native="showSysPas">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <!-- 头部e -->

    <el-container class="main">
      <!-- 侧边栏s-->
      <el-aside :width="asideWidth" class="aside-bar">
        <el-scrollbar style="height:100%">
          <el-menu :default-active="routertActive" ref="menu" :unique-opened="true" :collapse-transition="false" class="el-menu-vertical" @open="openMenu" :collapse="isCollapse"
            router>
            <!-- 添加可收起展开菜单的按钮点击 -->
            <div class="is-collapse">
              <i :class="isCollapse?'el-icon-folder':'el-icon-folder-opened'" :title="isCollapse?'展开':'收起'" @click="tabCollapse"></i>
            </div>
            <!-- 目录菜单循环s -->
            <template v-for="(directory,idx) in menulist">
              <!-- 存在多个子菜单 -->
              <el-submenu v-if="directory.children" :key="idx" :index="directory.path">
                <template slot="title">
                  <i :class="directory.icon"></i>
                  <span slot="title">{{directory.label}}</span>
                </template>
                <el-menu-item v-for="(page,sort) in directory.children" :key="sort" :index="page.path">
                  <template slot="title">
                    <i :class="page.icon"></i>
                    <span slot="title">{{page.label}}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
              <!-- 没有子菜单 -->
              <el-menu-item v-else :key="idx" :index="directory.path">
                <i :class="directory.icon"></i>
                <span slot="title">{{directory.label}}</span>
              </el-menu-item>
            </template>
            <!-- 目录菜单循环e -->
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <!-- 侧边栏e-->

      <!-- 主体内容区 -->
      <el-main>
        <el-scrollbar style="height:100%">
          <router-view></router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
    <!-- 系统信息 -->
    <el-dialog :visible.sync="showSysDialog" width="30%" :show-close="false">
      <p>{{$store.state.users.RealName}}</p>
      <p>{{$store.state.users.ShopCode}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showSysDialog = false">知道了</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="showSysForm" @close="cancelForm('ruleForm')" width="500px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="当前密码" prop="pwdOld">
          <el-input v-model.number="ruleForm.pwdOld"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pwdNew">
          <el-input type="password" v-model="ruleForm.pwdNew" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showSysForm = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import UserMinXin from '@/components/mixins/user'
export default {
  name: 'app',
  data () {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入当前密码'))
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pwdNew) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      showSysDialog: false, // 系统信息
      showSysForm: false, // 修改密码
      isCollapse: false, // 是否收起
      asideWidth: '160px', // 侧边栏宽度
      // 目录菜单
      menulist: [
        {
          path: '/oms/setting',
          label: '系统管理',
          icon: 'el-icon-setting',
          children: [
            {
              path: '/oms/setting/sysmenu',
              label: '系统菜单',
              icon: 'el-icon-s-tools'
            },
            {
              path: '/oms/setting/sysbutton',
              label: '页面按钮',
              icon: 'el-icon-s-help'
            },
            {
              path: '/oms/setting/license',
              label: '授权信息',
              icon: 'el-icon-s-check'
            },
            {
              path: '/oms/setting/history',
              label: '历史数据',
              icon: 'el-icon-s-flag'
            },
            {
              path: '/oms/setting/printing',
              label: '打印设置',
              icon: 'el-icon-printer'
            }
          ]
        },
        {
          path: '/oms/shops',
          label: '店铺管理',
          icon: 'el-icon-s-shop',
          children: [
            {
              path: '/oms/shops/branch',
              label: '分店管理',
              icon: 'el-icon-s-opportunity'
            },
            {
              path: '/oms/shops/terminal',
              label: '终端管理',
              icon: 'el-icon-s-platform'
            },
            {
              path: '/oms/shops/department',
              label: '部门管理',
              icon: 'el-icon-trophy'
            },
            {
              path: '/oms/shops/staff',
              label: '员工管理',
              icon: 'el-icon-user'
            },
            {
              path: '/oms/shops/permissions',
              label: '权限模板',
              icon: 'el-icon-s-management'
            }
          ]
        }
      ],
      routertActive: '', // 默认激活菜单
      openActive: '', // 当前打开的菜单名称
      ruleForm: {
        pwdNew: '',
        checkPass: '',
        pwdOld: ''
      },
      rules: {
        pwdOld: [
          { validator: checkAge, trigger: 'blur' }
        ],
        pwdNew: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  mixins: [UserMinXin],
  computed: {
    // 返回首页关闭菜单的效果
    openNingMenu () {
      return this.$store.state.openMenu.path
    },
    // 点击首页每次+1可有效解决监听路径失败的问题
    clickNumChange () {
      return this.$store.state.openMenu.clickNum
    }
  },
  watch: {
    // 监听是否展开收起 修改侧边栏宽度
    isCollapse (v) {
      v ? this.asideWidth = '64px' : this.asideWidth = '160px'
    },
    // 深度监听路由导航 赋值Actice菜单
    $route: {
      handler (to, from, next) {
        this.routertActive = to.path
        if (!from) {
          // 刷新页面获取会自动打开刷新之前已经打开的菜单路由 这是只需匹配已经打开的路由父级路径
          this.openActive = to.matched[1].path
        }
      },
      immediate: true,
      deep: true
    },
    // 监听点击返回首页的数字变化
    clickNumChange () {
      this.$refs.menu.close(this.$store.state.openMenu.path)
    }
  },
  created () { },
  methods: {
    // 展开收起菜单
    tabCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 返回首页
    backHome () {
      this.$refs.menu.close(this.openActive)
      this.$router.push('/oms')
    },
    // 展开一级菜单
    openMenu (key, keyPath) {
      this.openActive = key
    },
    // 查看系统信息
    showSysInfo () {
      this.showSysDialog = true
    },
    // 修改密码
    showSysPas () {
      this.showSysForm = true
    },
    // 提交修改密码
    submitForm (formName) {
      let { pwdOld, pwdNew, checkPass } = this.ruleForm
      if (pwdOld === '' || pwdNew === '' || checkPass === '') {
        this.$refs[formName].validateField('pwdOld')
        this.$refs[formName].validateField('pwdNew')
        this.$refs[formName].validateField('checkPass')
      } else {
        const params = {
          pwd_old: this.ruleForm.pwdOld,
          pwd_new: this.ruleForm.pwdNew
        }
        this.$ajax.patch(`/mer/user/pwd/${1}/${this.$store.state.users.Account}`, params).then(res => {
          if (res.Code === 200) {
            this.$message({ type: 'success', message: res.Content })
          } else {
            this.$message({ type: 'error', message: res.Content })
          }
        })
      }
    },
    // 取消修改---清除表单验证信息
    cancelForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 退出
    logout () {
      this.$confirm('是否确定登出系统?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({ type: 'success', message: '退出成功' })
        window.localStorage.removeItem('access_token')
        this.$nextTick(() => {
          this.$router.push('/login')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
// 主体高度限制
.main-content {
  height: 100%;
  width: 100%;
  .header {
    background-color: #f2f6fc;
    color: #409eff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-left {
      cursor: pointer;
    }
  }
  .main {
    height: calc(100% - 60px);
    .aside-bar {
      height: 100%;
      // 侧边栏
      .el-menu-vertical {
        .is-collapse {
          text-align: center;
          cursor: pointer;
          color: #409eff;
        }
      }
    }
  }
}
.el-dropdown-link {
  cursor: pointer;
}
// 滚动条插件
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
  .el-scrollbar__view {
    height: 100%;
    .el-menu {
      height: 100%;
    }
  }
}
</style>
