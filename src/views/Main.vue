<template>
  <b-container>
    <router-link v-if="!isLoggedIn()" to="/login"><button>Login</button></router-link>
    <h2>Add comment</h2>
    <AddComment @newComment="fetchComments" class="mb-5"/>
    <h3>Comments</h3>
    <div v-if="isLoading" class="text-center mt-3 mb-3">
      <img :src="loaderGif" class="loader-img" alt="Loading..." />
    </div>
    <div v-else>
      <button @click="updateSort('username')">Sort by Username</button>
      <button @click="updateSort('email')">Sort by Email</button>
      <button @click="updateSort('createdAt')">Sort by Created At</button>
      <Comment
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @newComment="fetchComments"
      />
      <div class="mt-4 mb-5 text-center">
        <b-button @click="prevPage" variant="outline-info" v-if="page > 1">Previous Page</b-button>
        <b-button @click="nextPage" variant="outline-info" v-if="page < pagesCount">Next Page</b-button>
      </div>
    </div>
  </b-container>
</template>

<style>
  .loader-img {
    width: 60px;
    height: 60px;
  }
</style>

<script>
import Comment from '../components/Comment.vue'
import AddComment from '../components/AddComment.vue'
import store from '../store'
import loaderGif from '@/assets/loader.gif'
export default {
  components: {
    Comment,
    AddComment
  },
  data () {
    return {
      pagesCount: 0,
      comments: [],
      isLoading: false,
      page: 1,
      perPage: 2,
      sortBy: undefined,
      sortOrder: 'desc',
      loaderGif
    }
  },
  async created () {
    await this.fetchComments()
  },
  methods: {
    isLoggedIn () {
      return store.getters.isLoggedIn
    },
    updateSort (field) {
      if (this.sortBy === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortBy = field
        this.sortOrder = 'asc'
      }
      this.fetchComments()
    },
    async fetchComments () {
      this.isLoading = true

      try {
        const response = await fetch('http://localhost:3000/comments/getAll?' + new URLSearchParams({
          page: this.page,
          perPage: this.perPage,
          sortBy: this.sortBy,
          sortOrder: this.sortOrder
        }), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + store.getters.getToken
          }
        })
        const json = await response.json()
        this.comments = json.data
        this.pagesCount = Math.round(json.count / this.perPage)
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    nextPage () {
      if (this.page < this.pagesCount) {
        this.page++
        this.comments = []
        this.fetchComments()
      }
    },
    prevPage () {
      if (this.page > 1) {
        this.page--
        this.comments = []
        this.fetchComments()
      }
    }
  }
}
</script>
