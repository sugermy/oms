<template>
  <el-container class="login-content">
    <el-header class="login-header"></el-header>
    <el-main class="login-main">
      <h3 class="sys-compony">贺米粒科技</h3>
      <p class="sys-name">会员管理系统</p>
      <el-form ref="form" :model="form" class="login-form" hide-required-asterisk>
        <el-form-item prop="TerminalNo" :rules="{ required: true, message: '请选择终端'}">
          <el-select v-model="form.TerminalNo" style="width:100%">
            <el-option label="店铺名称-终端名称" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="Account" :rules="{ required: true, message: '请输入帐号'}">
          <el-input v-model="form.Account" placeholder="请输入帐号"></el-input>
        </el-form-item>
        <el-form-item prop="Password" :rules="{ required: true, message: '请输入密码'}">
          <el-input v-model="form.Password" placeholder="请输入密码" @keypress.enter.native="login('form')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" round @click="login('form')">我是管理员</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" round>登录</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer class="login-footer">© 2019 航航学习 粤ICP备19116590号</el-footer>
  </el-container>
</template>
<script>
import { randomName, omsStorage } from '../../plugins/utils'
export default {
  data () {
    return {
      form: {
        TerminalNo: '1',
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
        // console.log(res)
      })
    },
    // 登陆接口---根据所选终端判断
    login (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let { Account, Password } = this.form
          let data = {
            Account, Password, auth_token: randomName()
          }
          this.superlogin(data)
        } else {
          return false
        }
      })
    },
    // 超级管理员
    superlogin (data) {
      this.$ajax.post('/login/super', data).then(res => {
        if (res.Code === 200) {
          this.$message({ type: 'success', message: '登陆成功' })
          let date = new Date().getTime()
          omsStorage.set('access_token', res.Data.Token, date + 12 * 60 * 60 * 1000)
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
