<template>
  <b-container>
    <router-link v-if="!isLoggedIn()" to="/login"><button>Login</button></router-link>
    <Comment
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
    />
  </b-container>
</template>

<script>
import Comment from '../components/Comment.vue'
import store from '../store'
export default {
  components: {
    Comment
  },
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
    const response = await fetch('http://localhost:3000/comments/getAll?perPage=25&page=1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + store.getters.getToken
      }
    })
    this.comments = await response.json()
  }
}
</script>
