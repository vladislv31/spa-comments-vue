<template>
  <div class="mt-3">
    <button @click="wrapText('<i>', '</i>')"><i>I</i></button>
    <button @click="wrapText('<strong>', '</strong>')"><strong>B</strong></button>
    <button @click="wrapText('<code>', '</code>')"><code>Code</code></button>
    <button @click="wrapText(`<a href='' title=''>`, '</a>')">Link</button>
    <b-form-textarea
      id="textarea"
      v-model="replyBody"
      placeholder="Enter something..."
      rows="3"
      max-rows="6"
      class="mt-4 mb-4"
      ref="textArea"
    ></b-form-textarea>
    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    <input type="file" @change="handleFileUpload"/>
    <b-button size="sm" @click="replyToComment" variant="outline-success">Отправить</b-button>
    <div class="mt-3 d-flex">
      <label style="margin-right: 8px;">Show preview</label>
      <input type="checkbox" v-model="showPreview">
    </div>
    <Preview v-if="showPreview" :comment="{
      body: replyBody,
      author: { username: getUser() },
      extraDetails: {} }" />
  </div>
</template>

<style>
  .error {
    color: #ca2525;
  }
</style>

<script>
import store from '../store'
import Preview from '../components/Preview.vue'
import { makeRequest } from '../utils/makeRequest.ts'
export default {
  name: 'AddComment',
  components: {
    Preview
  },
  props: {
    parentId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      selectedFile: null,
      replyBody: '',
      error: null,
      showPreview: false
    }
  },
  methods: {
    handleFileUpload (event) {
      console.log(event.target.files[0])
      this.selectedFile = event.target.files[0]
    },
    getUser () {
      return store.getters.getUser
    },
    async replyToComment () {
      this.error = null

      try {
        const formData = new FormData()
        if (this.parentId) { formData.append('parentId', this.parentId) }
        formData.append('body', this.replyBody)
        formData.append('file', this.selectedFile)

        await makeRequest(
          'http://localhost:3000/comments/create',
          'POST',
          {
            'Authorization': 'Bearer ' + store.getters.getToken
          },
          formData
        )

        this.replyBody = ''
        this.$emit('newComment')
      } catch (e) {
        this.error = e.message
      }
    },
    wrapText (startTag, endTag) {
      const textArea = this.$refs.textArea
      const start = textArea.selectionStart
      const end = textArea.selectionEnd
      const selectedText = textArea.value.substring(start, end)
      const newText = `${startTag}${selectedText}${endTag}`
      this.replyBody = this.replyBody.substring(0, start) + newText + this.replyBody.substring(end)
      // Update cursor position
      textArea.selectionStart = start + newText.length
      textArea.selectionEnd = start + newText.length
    }
  }
}
</script>
