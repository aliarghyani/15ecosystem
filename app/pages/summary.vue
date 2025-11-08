<template>
  <div class="max-w-4xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <nav class="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <NuxtLink :to="localePath('/')" class="hover:text-primary-600 dark:hover:text-primary-400">
        {{ $t('breadcrumb.home') }}
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-800 dark:text-gray-200 font-medium">
        {{ $t('summary.title') }}
      </span>
    </nav>

    <!-- Page Header -->
    <div class="mb-12 text-center">
      <h1 class="text-4xl sm:text-5xl font-bold mb-4 primary-text">
        {{ $t('summary.title') }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        {{ $t('summary.description') }}
      </p>
    </div>

    <!-- Summary Content -->
    <div v-if="formattedSummary" class="prose prose-lg dark:prose-invert max-w-none">
      <UCard class="dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm">
        <div
          class="summary-content text-gray-700 dark:text-gray-300 leading-relaxed"
          :dir="locale === 'fa' ? 'rtl' : 'ltr'"
          v-html="formattedSummary"
        ></div>
      </UCard>
    </div>

    <!-- Empty State (English placeholder) -->
    <div v-else class="text-center py-12">
      <UCard class="dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm">
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('summary.notAvailable') }}
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
import { summary as summaryFa } from '~/data/fa/summary'
import { summary as summaryEn } from '~/data/en/summary'

const { locale } = useI18n()
const localePath = useLocalePath()

// Get summary for current locale
const rawSummary = computed(() => {
  const text = locale.value === 'fa' ? summaryFa : summaryEn
  // Handle empty English summary
  if (!text || text.trim() === '') {
    return null
  }
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
})

// Format summary: parse markdown and convert skill numbers to links
const formattedSummary = computed(() => {
  if (!rawSummary.value) return null

  let html = rawSummary.value

  // Split into lines for better processing
  const lines = html.split('\n')
  const processedLines: string[] = []
  let inList = false
  let listItems: string[] = []
  let listType: 'ul' | 'ol' | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Skip empty lines
    if (!line) {
      if (inList && listItems.length > 0) {
        // Close current list
        const listTag = listType === 'ol' ? 'ol' : 'ul'
        const listClass = listType === 'ol' ? 'list-decimal' : 'list-disc'
        processedLines.push(`<${listTag} class="${listClass} ml-6 mb-4 space-y-2">${listItems.join('')}</${listTag}>`)
        listItems = []
        inList = false
        listType = null
      }
      continue
    }

    // Check for headers
    if (line.startsWith('### ')) {
      if (inList) {
        const listTag = listType === 'ol' ? 'ol' : 'ul'
        const listClass = listType === 'ol' ? 'list-decimal' : 'list-disc'
        processedLines.push(`<${listTag} class="${listClass} ml-6 mb-4 space-y-2">${listItems.join('')}</${listTag}>`)
        listItems = []
        inList = false
        listType = null
      }
      const headerText = line.replace(/^### /, '')
      processedLines.push(`<h3 class="text-2xl font-bold mt-8 mb-4">${headerText}</h3>`)
      continue
    }

    if (line.startsWith('## ')) {
      if (inList) {
        const listTag = listType === 'ol' ? 'ol' : 'ul'
        const listClass = listType === 'ol' ? 'list-decimal' : 'list-disc'
        processedLines.push(`<${listTag} class="${listClass} ml-6 mb-4 space-y-2">${listItems.join('')}</${listTag}>`)
        listItems = []
        inList = false
        listType = null
      }
      const headerText = line.replace(/^## /, '')
      processedLines.push(`<h2 class="text-3xl font-bold mt-10 mb-6">${headerText}</h2>`)
      continue
    }

    // Check for horizontal rules
    if (line === '---') {
      if (inList) {
        const listTag = listType === 'ol' ? 'ol' : 'ul'
        const listClass = listType === 'ol' ? 'list-decimal' : 'list-disc'
        processedLines.push(`<${listTag} class="${listClass} ml-6 mb-4 space-y-2">${listItems.join('')}</${listTag}>`)
        listItems = []
        inList = false
        listType = null
      }
      processedLines.push('<hr class="my-8 border-gray-300 dark:border-gray-700">')
      continue
    }

    // Check for numbered list (1. text)
    const numberedMatch = line.match(/^(\d+)\. (.+)$/)
    if (numberedMatch) {
      if (inList && listType !== 'ol') {
        // Close previous list
        const listTag = listType === 'ol' ? 'ol' : 'ul'
        const listClass = listType === 'ol' ? 'list-decimal' : 'list-disc'
        processedLines.push(`<${listTag} class="${listClass} ml-6 mb-4 space-y-2">${listItems.join('')}</${listTag}>`)
        listItems = []
      }
      inList = true
      listType = 'ol'
      const itemText = numberedMatch[2]
      listItems.push(`<li class="mb-2">${formatInlineMarkdown(itemText)}</li>`)
      continue
    }

    // Check for bullet list (- or *)
    const bulletMatch = line.match(/^[\-\*] (.+)$/)
    if (bulletMatch) {
      if (inList && listType !== 'ul') {
        // Close previous list
        const listTag = listType === 'ol' ? 'ol' : 'ul'
        const listClass = listType === 'ol' ? 'list-decimal' : 'list-disc'
        processedLines.push(`<${listTag} class="${listClass} ml-6 mb-4 space-y-2">${listItems.join('')}</${listTag}>`)
        listItems = []
      }
      inList = true
      listType = 'ul'
      const itemText = bulletMatch[1]
      listItems.push(`<li class="mb-2">${formatInlineMarkdown(itemText)}</li>`)
      continue
    }

    // Regular paragraph
    if (inList) {
      // Close current list
      const listTag = listType === 'ol' ? 'ol' : 'ul'
      const listClass = listType === 'ol' ? 'list-decimal' : 'list-disc'
      processedLines.push(`<${listTag} class="${listClass} ml-6 mb-4 space-y-2">${listItems.join('')}</${listTag}>`)
      listItems = []
      inList = false
      listType = null
    }

    processedLines.push(`<p class="mb-4">${formatInlineMarkdown(line)}</p>`)
  }

  // Close any remaining list
  if (inList && listItems.length > 0) {
    const listTag = listType === 'ol' ? 'ol' : 'ul'
    const listClass = listType === 'ol' ? 'list-decimal' : 'list-disc'
    processedLines.push(`<${listTag} class="${listClass} ml-6 mb-4 space-y-2">${listItems.join('')}</${listTag}>`)
  }

  return processedLines.join('\n')
})

// Format inline markdown (bold, italic, skill links)
function formatInlineMarkdown(text: string): string {
  let html = text

  // Convert skill numbers to links (1-15)
  // Pattern: skill number in various contexts
  html = html.replace(/(?:^|\s|\(|\)|–|–)([1-9]|1[0-5])(?:\)|–|–|\.|,|\s|$)/g, (match, skillNum) => {
    const num = parseInt(skillNum, 10)
    if (num >= 1 && num <= 15) {
      const skillPath = localePath(`/skills/${num}`)
      return match.replace(skillNum, `<a href="${skillPath}" class="text-primary-600 dark:text-primary-400 hover:underline font-medium">${skillNum}</a>`)
    }
    return match
  })

  // Convert markdown bold (**text**)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>')

  // Convert markdown italic (*text*) - but not if it's part of **text**
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em class="italic">$1</em>')

  return html
}

// Set page title
useHead({
  title: computed(() => {
    return `${useI18n().t('summary.title')} - 15ecosystem`
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        return useI18n().t('summary.description')
      }),
    },
  ],
})
</script>

<style scoped>
.prose {
  @apply text-gray-700 dark:text-gray-300;
}

.summary-content :deep(h2) {
  @apply text-3xl font-bold mt-10 mb-6 text-gray-900 dark:text-gray-100;
}

.summary-content :deep(h3) {
  @apply text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100;
}

.summary-content :deep(ul) {
  @apply list-disc ml-6 mb-4 space-y-2;
}

.summary-content :deep(ol) {
  @apply list-decimal ml-6 mb-4 space-y-2;
}

.summary-content :deep(li) {
  @apply mb-2;
}

.summary-content :deep(hr) {
  @apply my-8 border-gray-300 dark:border-gray-700;
}

.summary-content :deep(strong) {
  @apply font-semibold;
}

.summary-content :deep(em) {
  @apply italic;
}

.summary-content :deep(a) {
  @apply text-primary-600 dark:text-primary-400 hover:underline font-medium;
}

.summary-content :deep(p) {
  @apply mb-4;
}
</style>

