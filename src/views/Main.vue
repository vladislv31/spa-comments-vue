<template>
    <div>
        <h1>Welcome</h1>
        <router-link v-if="!isLoggedIn()" to="/login"><button>Login</button></router-link>
        <ul>
          <li v-for="(item, index) in comments" :key="index">
            {{ item.user.username }}
          </li>
        </ul>
    </div>
</template>

<script>
import store from '../store'
export default {
  data () {
    return {
      comments: []
    }
  },
  methods: {
    isLoggedIn () {
      return store.getters.isLoggedIn
    }
  },
  async created () {
    const response = await fetch('http://localhost:3000/comments/getAll', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + store.getters.getToken
      }
    })
    this.comments = (await response.json()).comments
  }
}
</script>
