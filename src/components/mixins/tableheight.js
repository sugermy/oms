export default {
  data () {
    return {
      tableHeight: 'auto'
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 获取元素高度
      var h = document.documentElement.clientHeight || document.body.clientHeight
      this.tableHeight = h - this.$refs.searchbar.$el.offsetHeight - 160
    })
  }
}
