<template>
  <div>
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
    <input type="file" @change="handleFileUpload"/>
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
      selectedFile: null,
      replyBody: ''
    }
  },
  methods: {
    handleFileUpload (event) {
      this.selectedFile = event.target.files[0]
    },
    async replyToComment () {
      const formData = new FormData()
      if (this.parentId) { formData.append('parentId', +this.parentId) }
      formData.append('body', this.replyBody)
      formData.append('file', this.selectedFile)

      await fetch('http://localhost:3000/comments/create', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + store.getters.getToken
        },
        body: formData
      })
      this.replyBody = ''
      this.$emit('newComment')
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
