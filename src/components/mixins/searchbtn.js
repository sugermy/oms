import { omsStorage } from '../../plugins/utils'

export default {
  created () {
    this.getSearchBtns()
  },
  methods: {
    htmlEncode (value) {
      return !value ? value : String(value).replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
    },
    getSearchBtns () {
      const Token = omsStorage.get('access_token')
      this.$ajax.post(`/login/menubtn/${Token}`, { menu_path: this.htmlEncode(this.$route.path) }).then(res => {
        console.log(res)
      })
    }
  }
}
