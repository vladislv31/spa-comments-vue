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
        <div v-if="error" class="error">
          <p>{{ error }}</p>
        </div>
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
import { makeRequest } from '../utils/makeRequest.ts'
export default {
  setup () {
    return { v$: useVuelidate() }
  },
  data: () => {
    return {
      username: '',
      password: '',
      error: null
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
      this.error = null
      this.v$.$touch()
      if (this.v$.$invalid) {
        return
      }
      try {
        const response = await makeRequest(
          '/auth/login',
          'POST',
          {
            'Content-Type': 'application/json'
          },
          JSON.stringify({
            username: this.username,
            password: this.password
          }))
        const { username, access_token: accessToken } = await response.json()
        store.commit('setUser', username)
        store.commit('setToken', accessToken)
        this.$router.push('/')
      } catch (error) {
        this.error = error
      }
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

  .error {
    color: #ca2525;
  }
</style>
