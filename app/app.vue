<template>
  <UApp :toaster="{ expand: false }">
    <NuxtLoadingIndicator color="#6366F1" :height="3" :throttle="100" />
    <TopNav />
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
import TopNav from '@/components/common/TopNav.vue'

const { locale } = useI18n()

// Set HTML dir attribute based on locale
useHead({
  htmlAttrs: {
    dir: computed(() => locale.value === 'fa' ? 'rtl' : 'ltr'),
    lang: computed(() => locale.value),
  },
})
</script>
