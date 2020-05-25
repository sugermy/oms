export default {
  created () {
    this.getSearchBtns()
  },
  methods: {
    htmlEncode (value) {
      return !value ? value : String(value).replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
    },
    getSearchBtns () {
      const Token = this.$storage.get('access_token')
      this.$ajax.post(`/login/menubtn/${Token}`, { menu_path: this.htmlEncode(this.$route.path) }).then(res => {
        const resData = res.Data || []
        const newArr = []
        for (let i = 0; i < resData.length; i++) {
          resData[i].Children = []
          if (resData[i].ParentID === 0) {
            newArr.push(resData[i])
          }
          for (let k = i + 1; k < resData.length; k++) {
            if (resData[i].ButtonID === resData[k].ParentID) {
              resData[i].Children.push(resData[k])
            }
          }
        }

        this.searchOptions.buttonlist = newArr
      })
    }
  }
}
