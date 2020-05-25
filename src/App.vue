<template>
  <router-view></router-view>
</template>
<script>

export default {
  mounted () {
    const token = this.$storage.get('access_token')
    if (!token) {
      this.$router.push('/login')
    }
  }
}
</script>
