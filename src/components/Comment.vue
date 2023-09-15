<template>
  <div>
    <b-card :class="{ 'ml-4': depth > 0 }" class="mb-2 mt-4">
      <strong>{{ comment.author.username }}</strong>
      <p class="mb-3">{{ comment.body }}</p>
      <div>
        <b-button size="sm" variant="primary" @click="showReplyForm = !showReplyForm">Ответить</b-button>
        <div v-if="showReplyForm">
          <AddComment :parent-id="comment.id" @newComment="processAddComment"/>
        </div>
      </div>
      <div v-if="comment.children">
        <Comment
          v-for="childComment in comment.children"
          :key="childComment.id"
          :comment="childComment"
          :depth="depth + 1"
          @newComment="processAddComment"
        />
      </div>
    </b-card>
  </div>
</template>

<script>
import AddComment from '../components/AddComment.vue'
export default {
  name: 'Comment',
  components: {
    AddComment
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    depth: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      showReplyForm: false
    }
  },
  methods: {
    processAddComment () {
      this.showReplyForm = false
      this.$emit('newComment')
    }
  }
}
</script>
