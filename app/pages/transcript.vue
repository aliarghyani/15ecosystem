<template>
  <div class="max-w-4xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <nav class="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <NuxtLink :to="localePath('/')" class="hover:text-primary-600 dark:hover:text-primary-400">
        {{ $t('breadcrumb.home') }}
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-800 dark:text-gray-200 font-medium">
        {{ $t('transcript.title') }}
      </span>
    </nav>

    <!-- Page Header -->
    <div class="mb-12 text-center">
      <h1 class="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
        {{ $t('transcript.title') }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        {{ $t('transcript.description') }}
      </p>
    </div>

    <!-- Transcript Content -->
    <div v-if="transcriptText" class="prose prose-lg dark:prose-invert max-w-none">
      <UCard class="dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm">
        <div
          class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line"
          :dir="locale === 'fa' ? 'rtl' : 'ltr'"
        >
          {{ transcriptText }}
        </div>
      </UCard>
    </div>

    <!-- Empty State (English placeholder) -->
    <div v-else class="text-center py-12">
      <UCard class="dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm">
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('transcript.notAvailable') }}
        </p>
      </UCard>
    </div>

    <!-- Navigation -->
    <div class="flex justify-center mt-12">
      <UButton :to="localePath('/')" variant="soft" color="primary" icon="i-heroicons-home">
        {{ $t('category.backToHome') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { transcript as transcriptFa } from '~/data/fa/transcript'
import { transcript as transcriptEn } from '~/data/en/transcript'

const { locale } = useI18n()
const localePath = useLocalePath()

// Get transcript for current locale
const transcriptText = computed(() => {
  const text = locale.value === 'fa' ? transcriptFa : transcriptEn
  // Handle empty English transcript
  if (!text || text.trim() === '') {
    return null
  }
  // Convert \r\n to proper line breaks and clean up
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
})

// Set page title
useHead({
  title: computed(() => {
    return `${useI18n().t('transcript.title')} - 15ecosystem`
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        return useI18n().t('transcript.description')
      }),
    },
  ],
})
</script>

<style scoped>
.prose {
  @apply text-gray-700 dark:text-gray-300;
}

.prose p {
  @apply mb-4;
}

.prose :deep(p) {
  @apply mb-4;
}
</style>

