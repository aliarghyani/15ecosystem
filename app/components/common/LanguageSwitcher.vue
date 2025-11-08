<template>
  <div class="flex gap-2">
    <UButton
      :variant="locale === 'en' ? 'solid' : 'outline'"
      size="sm"
      @click="setLocale('en')"
    >
      {{ $t('common.english') }}
    </UButton>
    <UButton
      :variant="locale === 'fa' ? 'solid' : 'outline'"
      size="sm"
      @click="setLocale('fa')"
    >
      {{ $t('common.persian') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()
</script>

