<template>
  <b-container>
    <div class="form-signin w-100 m-auto">
      <form @submit.prevent="signup">
        <h1 class="h3 mb-3 fw-normal">Sign up</h1>
        <div class="form-floating">
          <input v-model="username" type="text" class="form-control" id="floatingInput" placeholder="Username"/>
          <label for="floatingInput">Username</label>
          <div class="input-error" v-if="v$.username.$errors.length">{{ v$.username.$errors[0].$message }}</div>
        </div>
        <div class="form-floating">
          <input v-model="email" type="email" class="form-control" id="floatingInput" placeholder="Email"/>
          <label for="floatingInput">Email</label>
          <div class="input-error" v-if="v$.email.$errors.length">{{ v$.email.$errors[0].$message }}</div>
        </div>
        <div class="form-floating">
          <input v-model="externalLink" type="text" class="form-control" id="floatingInput" placeholder="External link"/>
          <label for="floatingInput">External link</label>
          <div class="input-error" v-if="v$.externalLink.$errors.length">{{ v$.externalLink.$errors[0].$message }}</div>
        </div>
        <div class="form-floating">
          <input v-model="password" type="password" class="form-control" id="floatingPassword" placeholder="Password">
          <label for="floatingPassword">Password</label>
          <div class="input-error" v-if="v$.password.$errors.length">{{ v$.password.$errors[0].$message }}</div>
        </div>
        <div class="form-floating">
          <input v-model="confirmPassword" type="password" class="form-control" id="floatingPassword" placeholder="Confirm password">
          <label for="floatingPassword">Confirm Password</label>
          <div class="input-error" v-if="v$.confirmPassword.$errors.length">{{ v$.confirmPassword.$errors[0].$message }}</div>
        </div>
        <br>
        <div v-if="error" class="error">
          <p>{{ error }}</p>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
        <br><br><router-link to="/login">Sign in</router-link>
      </form>
    </div>
  </b-container>
</template>
<script>
import { required, minLength, maxLength, email, url, alphaNum, helpers, sameAs } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { makeRequest } from '../utils/makeRequest.ts'

export default {
  setup () {
    return { v$: useVuelidate() }
  },
  data: () => {
    return {
      username: '',
      email: '',
      externalLink: '',
      password: '',
      confirmPassword: '',
      error: null
    }
  },
  validations () {
    return {
      username: {
        required,
        alphaNum,
        minLength: minLength(3),
        maxLength: maxLength(30)
      },
      email: {
        required,
        email
      },
      externalLink: { url },
      password: {
        required,
        check: helpers.withMessage(
          () => 'Password must contain letters, numbers, and at least one special character (@, $, !, %, *, ?, &)',
          helpers.regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        )
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs(this.password)
      }
    }
  },
  methods: {
    async signup (e) {
      this.error = null
      try {
        this.v$.$touch()
        if (this.v$.$invalid) {
          return
        }
        await makeRequest(
          'http://localhost:3000/users/signup',
          'POST',
          {
            'Content-Type': 'application/json'
          },
          JSON.stringify({
            username: this.username,
            email: this.email,
            homePage: this.externalLink || undefined,
            password: this.password
          })
        )
        this.$router.push('/login')
      } catch (error) {
        this.error = error.message
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

  .form-signin input {
    margin-bottom: 10px;
  }

  .error {
    color: #ca2525;
  }

  .input-error {
    margin-bottom: 10px;
    color: #ca2525;
  }
</style>
