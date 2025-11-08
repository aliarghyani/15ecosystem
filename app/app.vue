<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()

// Set HTML dir attribute based on locale
useHead({
  htmlAttrs: {
    dir: computed(() => locale.value === 'fa' ? 'rtl' : 'ltr'),
    lang: computed(() => locale.value),
  },
})
</script>
