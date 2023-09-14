<template>
  <div>
    <b-card :class="{ 'ml-4': depth > 0 }" class="mb-2 mt-4">
      <strong>{{ comment.author.username }}</strong>
      <p class="mb-3">{{ comment.body }}</p>
      <div>
        <b-button size="sm" variant="primary" @click="showReplyForm = !showReplyForm">Ответить</b-button>
        <!-- Форма для ответа на комментарий (опционально) -->
        <div v-if="showReplyForm">
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
      </div>
      <div v-if="comment.children">
        <Comment
          v-for="childComment in comment.children"
          :key="childComment.id"
          :comment="childComment"
          :depth="depth + 1"
        />
      </div>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'Comment',
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
      showReplyForm: false,
      replyBody: ''
    }
  },
  methods: {
    replyToComment () {
      // Здесь код для отправки ответа на комментарий
    }
  }
}
</script>
