<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试视图 -->
    <el-card>
      <!-- <pure-vue-chart :points="chartData"
                      :width="400"
                      :height="200"
                      show-values
                      show-y-axis
                      show-x-axis>
      </pure-vue-chart> -->
      <div id="mychart"
           class="mychart">

      </div>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'

export default {

  async mounted () {

    this.drawChart()
  },
  data () {
    return {
      chartData: {},
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      },
      exampleData: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '6%',
          right: '6%',
          bottom: '6%',
          containLabel: true
        },
        legend: {
          data: ['订单数量', '我的业绩'],
          left: '6%',
          top: 'top',
          itemWidth: 15,//图例图标的宽
          itemHeight: 15,//图例图标的高
          textStyle: {
            color: '#3a6186',
            fontSize: 20,
          }
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
          },
          right: '6%',
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
            splitLine: { show: false },//去除网格分割线
            axisTick: {//刻度
              show: false//不显示刻度线
            },
            axisLine: {//坐标线
              lineStyle: {
                type: 'solid',
                color: '#e7e7e7',//轴线的颜色
                width: '2'//坐标线的宽度
              }
            },
            axisLabel: {
              textStyle: {
                color: '#3a6186',//坐标值的具体的颜色
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {//线
              show: false
            },
            axisTick: {//刻度
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#3a6186',//坐标值的具体的颜色
              }
            },
            splitLine: {
              lineStyle: {
                color: ['#e7e7e7'],//分割线的颜色
              }
            }
          }
        ],
        series: [
          {
            name: '订单数量',
            type: 'bar',
            barWidth: 20,
            data: [20, 35, 55, 60, 120, 150, 140],
            itemStyle: {
              normal: {
                color: '#00abf7',//设置柱子颜色
                label: {
                  show: true,//柱子上显示值
                  position: 'top',//值在柱子上方显示
                  textStyle: {
                    color: '#00abf7',//值的颜色
                    fontSize: 16,
                  }
                }
              }
            },
          },
          {
            name: '我的业绩',
            type: 'bar',
            barWidth: 20,
            data: [40, 50, 90, 110, 130, 160, 150],
            itemStyle: {
              normal: {
                color: '#ff4f76',//设置柱子颜色
                label: {
                  show: true,//柱子上显示值
                  position: 'top',//值在柱子上方显示
                  textStyle: {
                    color: '#ff4f76',//值的颜色
                    fontSize: 16,
                  }
                }
              }
            },
          }
        ]
      }
    }
  },
  methods: {
    async getChartData () {
      const { data: res } = await this.$axios.get('reports/type/1')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.chartData = res.data
      // console.log(this.chartData)
    },
    async drawChart () {
      await this.getChartData()
      let mychart = this.$echarts.init(document.getElementById('mychart'))
      // console.log(this.chartData)
      const result = _.merge(this.chartData, this.options)
      mychart.setOption(result)
    }
  },
}
</script>

<style>
.mychart {
  width: 800px;
  height: 400px;
}
</style>