// current use server
const ACTIVE_SERVER = 'official'// 当前使用的服务器
// all servers
const ALL_SERVERS = {
  // 1-1. 正式服务器
  official: {
    apiServer: 'http://1j91m23289.51mypc.cn/'
  },
  // 1-2. 测试服务器
  localhost: {
    apiServer: 'xxx'
  }
}

window.SYSTEM_CONFIG = {
  webServer: ALL_SERVERS[ACTIVE_SERVER].apiServer // 启用服务器地址
}
