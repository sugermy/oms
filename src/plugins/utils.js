// 32位随机数
const randomName = function () {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 32; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)

  return s.join('')
}

const omsStorage = {
  set: function (key, value, timetap) {
    var data = { value: value, expirse: new Date(timetap).getTime() }
    window.localStorage.setItem(key, JSON.stringify(data))
  },
  get: function (key) {
    var data = JSON.parse(window.localStorage.getItem(key))
    if (data !== null) {
      if (data.expirse != null && data.expirse < new Date().getTime()) {
        window.localStorage.removeItem(key)
      } else {
        return data.value
      }
    }
    return null
  },
  remove: function (key) {
    window.localStorage.removeItem(key)
  }
}

export {
  randomName, omsStorage
}
