<template>
  <router-view></router-view>
</template>
<script>
import { omsStorage } from './plugins/utils'

export default {
  mounted () {
    const token = omsStorage.get('access_token')
    if (!token) {
      this.$router.push('/login')
    }
  }
}
</script>
