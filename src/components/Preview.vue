<template>
  <div>
    <b-card class="mb-2 mt-4">
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
  }

  .previewModal-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    z-index: 10000;
    padding: 25px;
  }

  .preview-button {
    cursor: pointer;
    text-decoration: underline;
    color: rgb(44, 115, 127);
  }
</style>

<script>
import moment from 'moment'
export default {
  name: 'Preview',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate (date) {
      return moment(date).format('YYYY-MM-DD in HH:mm')
    }
  }
}
</script>
