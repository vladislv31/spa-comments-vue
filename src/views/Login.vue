<template>
  <b-container>
    <div class="form-signin w-100 m-auto">
      <form @submit.prevent="login">
        <h1 class="h3 mb-3 fw-normal">Sign in</h1>
        <div class="form-floating">
          <input v-model="username" type="text" class="form-control" id="floatingInput" placeholder="username" />
          <label for="floatingInput">Username</label>
        </div>
        <div class="form-floating">
          <input v-model="password" type="password" class="form-control" id="floatingPassword" placeholder="Password">
          <label for="floatingPassword">Password</label>
        </div>
        <br>
        <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
      </form>
    </div>
  </b-container>
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

<style>
  .form-signin {
    max-width: 330px;
    padding: 1rem;
  }

  .form-signin .form-floating:focus-within {
    z-index: 2;
  }

  .form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
</style>
