<template>
  <el-container class="login-content">
    <el-header class="login-header"></el-header>
    <el-main class="login-main">
      <h3 class="sys-compony">贺米粒科技</h3>
      <p class="sys-name">会员管理系统</p>
      <el-form ref="form" :model="form" class="login-form" hide-required-asterisk>
        <el-form-item v-if="!roleType" prop="ShopCode" :rules="{ required: true, message: '请选择门店'}">
          <el-select v-model="form.ShopCode" style="width:100%" placeholder="请选择门店" @change="changeCode">
            <el-option v-for="(item,index) in shoplist" :key="index" :label="item.ShopName" :value="item.ShopCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!roleType" prop="TerminalNo" :rules="{ required: true, message: '请选择终端'}">
          <el-select v-model="form.TerminalNo" placeholder="请选择终端" style="width:100%">
            <el-option v-for="(item,index) in terminallist" :key="index" :label="item.TerminalName" :value="item.TerminalNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="Account" :rules="{ required: true, message: '请输入帐号'}">
          <el-input v-model="form.Account" placeholder="请输入帐号"></el-input>
        </el-form-item>
        <el-form-item prop="Password" :rules="{ required: true, message: '请输入密码'}">
          <el-input v-model="form.Password" placeholder="请输入密码" @keypress.enter.native="login('form')"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" style="width:100%" round @click="login('form')">我是管理员</el-button> -->
          <el-switch v-model="roleType" active-text="管理员登陆" inactive-text="普通登陆" @change="changeRole">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" round @click="login('form')">登录</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer class="login-footer">© 2019 航航学习 粤ICP备19116590号</el-footer>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      roleType: false,
      shoplist: [],
      terminallist: [],
      form: {
        TerminalNo: '',
        Account: '',
        Password: ''
      }
    }
  },
  mounted () {
    this.getshops()
  },
  methods: {
    // 获取当前系统所有的分店
    getshops () {
      this.$ajax.get('/login/shop').then(res => {
        this.shoplist = res.Data
      })
    },
    // 切换门店
    changeCode (code) {
      this.form.TerminalNo = ''
      let terminalParent = this.shoplist.filter(el => el.ShopCode === code)[0] || []
      this.terminallist = terminalParent.TerminalList || []
    },
    // 切换状态
    changeRole (v) {
      if (v) {
        this.$message({ type: 'success', message: '状态已切换为管理员登录' })
      } else {
        this.$message({ type: 'success', message: '状态已切换为普通用户登录' })
      }
    },
    // 登陆接口---根据所选终端判断
    login (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let { Account, Password } = this.form
          let data = {
            Account, Password, auth_token: this.$random()
          }
          if (this.roleType) {
            this.superlogin(data)
          } else {
            this.precheck()
          }
        } else {
          return false
        }
      })
    },
    // 普通用户验证
    precheck () {
      this.$ajax.get(`/login/precheck/$${this.form.Account}`).then(res => {
        if (res.Code === 200) {
          this.baselogin()
        } else {
          this.$message({ type: 'error', message: res.Content })
        }
      })
    },
    // 普通用户登录
    baselogin () {
      let params = {
        ...this.form,
        auth_token: this.$random()
      }
      this.$ajax.post('/login', params).then(res => {
        if (res.Code === 200) {
          this.$message({ type: 'success', message: '登陆成功' })
          // let date = new Date().getTime()
          // this.$storage.set('access_token', res.Data.Token, date + 12 * 60 * 60 * 1000)
          // this.$nextTick(() => {
          //   this.$router.push('/oms')
          // })
        } else {
          this.$message({ type: 'error', message: res.Content })
        }
      })
    },
    // 超级管理员
    superlogin (data) {
      this.$ajax.post('/login/super', data).then(res => {
        if (res.Code === 200) {
          this.$message({ type: 'success', message: '登陆成功' })
          let date = new Date().getTime()
          this.$storage.set('access_token', res.Data.Token, date + 12 * 60 * 60 * 1000)
          this.$nextTick(() => {
            this.$router.push('/oms')
          })
        } else {
          this.$message({ type: 'error', message: res.Content })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login-content {
  width: 100%;
  height: 100%;
  .login-header {
    height: 120px !important;
  }
  .login-main {
    text-align: center;
    margin: 0 auto;
    .sys-compony {
      font-size: 30px;
      color: #000;
    }
    .sys-name {
      color: #999;
      margin: 10px 0 30px 0;
    }
    .login-form {
      width: 300px;
    }
  }
  .login-footer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
