<template>
  <div>
    <b-card :class="{ 'ml-4': depth > 0 }" class="mb-2 mt-4">
      <strong class="mb-2">{{ comment.author.username }}</strong>
      <div class="mb-2"><small>{{ formatDate(comment.createdAt) }}</small></div>
      <p class="mb-2" v-html="comment.body"></p>
      <div v-if="comment.extraDetails.fileUrl" class="mb-3">
        <p>Attach: <a @click="showModal = true" class="preview-button">{{ comment.extraDetails.fileName }}</a></p>
        <div v-if="showModal" @click="showModal = false" class="previewModal">
          <div class="previewModal-content" @click.stop>
            <span class="close" @click="showModal = false">&times;</span>
            <div v-if="['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].includes(comment.extraDetails.fileType)">
              <img :src="`http://localhost:80/comments/${comment.extraDetails.fileUrl}`" alt="Image preview">
            </div>
            <div v-if="['text/plain'].includes(comment.extraDetails.fileType)">
              <pre>{{ previewText }}</pre>
            </div>
          </div>
        </div>
      </div>
      <div>
        <b-button size="sm" variant="primary" @click="showReplyForm = !showReplyForm">Reply</b-button>
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

<style>
  .previewModal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999;
  }

  .previewModal .close {
    position: absolute;
    right: 15px;
    top: 10px;
    cursor: pointer;
  }

  .previewModal-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    z-index: 10000;
    padding: 25px;
    padding-top: 40px;
    min-width: 300px;
    max-width: 600px;
    max-height: 700px;
    overflow-y: auto;
  }

  .previewModal-content pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .preview-button {
    cursor: pointer;
    text-decoration: underline;
    color: rgb(44, 115, 127);
  }
</style>

<script>
import AddComment from '../components/AddComment.vue'
import { makeRequest } from '../utils/makeRequest.ts'
import moment from 'moment'
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
      showReplyForm: false,
      previewText: '',
      showModal: false
    }
  },
  async created () {
    if (['text/plain'].includes(this.comment.extraDetails.fileType)) {
      const response = await makeRequest(`/comments/${this.comment.extraDetails.fileUrl}`)
      this.previewText = await response.text()
    }
  },
  methods: {
    processAddComment () {
      this.showReplyForm = false
      this.$emit('newComment')
    },
    formatDate (date) {
      return moment(date).format('YYYY-MM-DD in HH:mm')
    }
  }
}
</script>
