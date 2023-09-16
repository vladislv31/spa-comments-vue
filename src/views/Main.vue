<template>
  <b-container>
    <Notification ref="notification" :message="notificationMessage" />
    <b-button variant="outline-primary" class="mb-5" @click="logout">Logout</b-button>
    <h2>Add comment</h2>
    <AddComment @newComment="fetchComments" class="mb-5"/>
    <h3>Comments</h3>
    <div v-if="isLoading" class="text-center mt-3 mb-3">
      <img :src="loaderGif" class="loader-img" alt="Loading..." />
    </div>
    <div v-else>
      <div v-if="comments.length">
        <button @click="updateSort('username')">Sort by Username</button>
        <button @click="updateSort('email')">Sort by Email</button>
        <button @click="updateSort('createdAt')">Sort by Created At</button>
      </div>
      <div v-else>
        No comments...
      </div>
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
import Notification from '../components/Notification.vue'
import AddComment from '../components/AddComment.vue'
import store from '../store'
import loaderGif from '@/assets/loader.gif'
import { makeRequest } from '../utils/makeRequest.ts'
import { io } from 'socket.io-client'
export default {
  components: {
    Comment,
    AddComment,
    Notification
  },
  data () {
    return {
      pagesCount: 0,
      comments: [],
      isLoading: false,
      page: 1,
      perPage: 5,
      sortBy: undefined,
      sortOrder: 'desc',
      notificationMessage: '',
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
        const response = await makeRequest(
          'http://localhost:3000/comments/getAll?' + new URLSearchParams({
            page: this.page,
            perPage: this.perPage,
            sortBy: this.sortBy || 'createdAt',
            sortOrder: this.sortOrder
          }),
          'GET',
          {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + store.getters.getToken
          }
        )
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
    },
    logout () {
      store.commit('setUser', '')
      store.commit('setToken', '')
      this.$router.push('/login')
    }
  },
  mounted () {
    this.socket = io('http://localhost:3000', {
      query: {
        username: store.getters.getUser
      }
    })

    this.socket.on('notification', (message) => {
      this.notificationMessage = message
      this.$refs.notification.show()
    })
  },
  beforeDestroy () {
    if (this.socket) {
      this.socket.disconnect()
    }
  }
}
</script>
