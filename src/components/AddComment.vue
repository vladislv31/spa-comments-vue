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
    <div :id="elementId" class="mt-3 mb-3"></div>
    <b-button size="sm" @click="replyToComment" variant="outline-success">Send</b-button>
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

function makeId (length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

export default {
  name: 'AddComment',
  components: {
    Preview
  },
  mounted () {
    window.grecaptchaLoaded = () => {
      window.dispatchEvent(new Event('grecaptchaLoaded'))
    }

    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?onload=grecaptchaLoaded&render=explicit'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    if (window.grecaptcha && window.grecaptcha.render) {
      this.initializeRecaptcha()
    } else {
      window.addEventListener('grecaptchaLoaded', this.initializeRecaptcha)
    }
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
      showPreview: false,
      elementId: makeId(10),
      widgetId: null
    }
  },
  methods: {
    initializeRecaptcha () {
      // eslint-disable-next-line no-undef
      this.widgetId = grecaptcha.render(this.elementId, { 'sitekey': '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' })
    },
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
        // eslint-disable-next-line no-undef
        const recaptchaToken = grecaptcha.getResponse(this.widgetId)

        if (!recaptchaToken) {
          alert('Please complete the captcha')
          return
        }

        if (this.parentId) { formData.append('parentId', this.parentId) }
        formData.append('body', this.replyBody)
        formData.append('file', this.selectedFile)
        formData.append('recaptchaToken', recaptchaToken)

        await makeRequest(
          '/comments/create',
          'POST',
          {
            'Authorization': 'Bearer ' + store.getters.getToken
          },
          formData
        )

        this.replyBody = ''
        // eslint-disable-next-line no-undef
        grecaptcha.reset()
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
