<template>
  <div>
    <h1>LOGIN</h1>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="username" />
      <br/>
      <br/>
      <input v-model="password" placeholder="password" type="password" />
      <br/>
      <br/>
      <button type="submit">Login</button>
    </form>
  </div>
</template>
<script>
import store from '../store'
export default {
  data: () => {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login (e) {
      e.preventDefault()
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password
        })
      })
      const { username, access_token: accessToken } = await response.json()
      // this.setUser(username)
      // this.setToken(accessToken)
      store.commit('setUser', username)
      store.commit('setToken', accessToken)
      this.$router.push('/')
    }
  }
}
</script>
