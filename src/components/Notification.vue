<template>
  <div v-if="visible" class="notification">
    <b-alert show>{{ message }}</b-alert>
  </div>
</template>

<script>
export default {
  props: {
    message: String
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    show () {
      this.visible = true
      setTimeout(() => {
        this.visible = false
      }, 3000) // Скрываем уведомление через 3 секунды
    }
  }
}
</script>

<style>
.notification {
  position: fixed;
  right: 100px;
  top: 100px;
  z-index: 100;
}
</style>
