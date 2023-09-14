<template>
    <div>
        <h1> Welcome</h1>
        <router-link v-if="!isLoggedIn()" to="/login"><button>Login</button></router-link>
    </div>
</template>

<script>
import store from '../store'
export default {
  methods: {
    isLoggedIn () {
      return store.getters.isLoggedIn
    }
  }
}
</script>
