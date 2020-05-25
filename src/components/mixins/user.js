import store from '@/store'

export default {
  data () {
    return {
      menulist: []
    }
  },
  created () {
    const Token = this.$storage.get('access_token')
    if (Token) {
      this.$ajax._axios.defaults.headers.auth_token = Token
      this.initUserInfo(Token)
    } else {
      this.$router.push('/login')
    }
  },
  methods: {
    // 获取用户权限信息
    initUserInfo (Token) {
      this.$ajax.get(`/login/${Token}`).then(res => {
        if (res.Code === 200) {
          store.dispatch('actionUser', res.Data)
          this.menulist = res.Data.MenuList
        } else {
          this.$message({ type: 'error', message: res.Content })
        }
      })
    }
  }
}
