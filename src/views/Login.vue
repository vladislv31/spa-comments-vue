<template>
  <b-container>
    <div class="form-signin w-100 m-auto">
      <form @submit.prevent="login">
        <h1 class="h3 mb-3 fw-normal">Sign in</h1>
        <div class="form-floating">
          <input v-model="username" type="text" class="form-control" id="floatingInput" placeholder="username" />
          <label for="floatingInput">Username</label>
          <div class="input-error mt-2" v-if="v$.username.$errors.length">{{ v$.username.$errors[0].$message }}</div>
        </div>
        <div class="form-floating">
          <input v-model="password" type="password" class="form-control" id="floatingPassword" placeholder="Password">
          <label for="floatingPassword">Password</label>
          <div class="input-error" v-if="v$.password.$errors.length">{{ v$.password.$errors[0].$message }}</div>
        </div>
        <br>
        <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
        <br><br><router-link to="/register" class="mb-4">Registration</router-link>
      </form>
    </div>
  </b-container>
</template>
<script>
import store from '../store'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
export default {
  setup () {
    return { v$: useVuelidate() }
  },
  data: () => {
    return {
      username: '',
      password: ''
    }
  },
  validations () {
    return {
      username: { required },
      password: { required }
    }
  },
  methods: {
    async login (e) {
      this.v$.$touch()
      if (this.v$.$invalid) {
        return
      }
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

  .form-signin input[type="text"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .input-error {
    margin-bottom: 10px;
    color: #ca2525;
  }
</style>
