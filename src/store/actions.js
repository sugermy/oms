export default {
  actionOpenMenu ({ commit }, data) {
    commit('setOpenMenu', data)
  },
  actionUser ({ commit }, data) {
    commit('setUser', data)
  }
}
