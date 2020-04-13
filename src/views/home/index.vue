<template>
  <div class="chart area-content">
    <div style="width:500px;height:500px" ref="chart"></div>
  </div>
</template>
<script>

export default {
  data () {
    return {}
  },
  methods: {
    initCharts () {
      const myChart = this.$echarts.init(this.$refs.chart)
      // setoption中两个参数，第一个为配置项 第二个 true 为数据重载防止原数据依然在图表上显示
      myChart.setOption({
        title: { text: '销售榜单' },
        color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          },
          {
            name: '趋势',
            type: 'line',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }, true)
    }
  },
  mounted () {
    this.initCharts()
  }
}
</script>
