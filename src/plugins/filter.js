import Vue from 'vue'

// 值为真
function truethy (txt) {
  let temp = ''
  switch (txt) {
    case 'IsEnabled':
      temp = '启用'
      break
    case 'IsOnline':
      temp = '在线'
      break
    case 'IsFlagShip':
      temp = '是'
      break
    default:
      break
  }
  return temp
}

// 值为假
function falsethy (txt) {
  let temp = ''
  switch (txt) {
    case 'IsEnabled':
      temp = '禁用'
      break
    case 'IsOnline':
      temp = '离线'
      break
    case 'IsFlagShip':
      temp = '否'
      break
    default:
      break
  }
  return temp
}

Vue.filter('TransformTemp', function (val, key) {
  let temp = ''
  val ? temp = truethy(key) : temp = falsethy(key)
  return temp
})
