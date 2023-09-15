<template>
  <div>
    <b-form-textarea
      id="textarea"
      v-model="replyBody"
      placeholder="Enter something..."
      rows="3"
      max-rows="6"
      class="mt-4 mb-4"
    ></b-form-textarea>
    <b-button size="sm" @click="replyToComment" variant="outline-success">Отправить</b-button>
  </div>
</template>

<script>
import store from '../store'
export default {
  name: 'Comment',
  props: {
    parentId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      replyBody: ''
    }
  },
  methods: {
    async replyToComment () {
      await fetch('http://localhost:3000/comments/create', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + store.getters.getToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parentId: this.parentId,
          body: this.replyBody
        })
      })
      this.replyBody = ''
      this.$emit('newComment')
    }
  }
}
</script>
