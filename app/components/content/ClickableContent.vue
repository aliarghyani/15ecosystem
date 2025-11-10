<template>
  <div
    class="clickable-content"
    :dir="isRTL ? 'rtl' : 'ltr'"
    v-html="processedContent"
  />
</template>

<script setup lang="ts">
import { parseContentForEntities, convertContentToClickableHTML } from '~/utils/content-parser'

interface Props {
  content: string
  locale: 'fa' | 'en'
  enableAutoLinking?: boolean
  entityTypes?: Array<'skill' | 'book' | 'writer' | 'category'>
}

const props = withDefaults(defineProps<Props>(), {
  enableAutoLinking: true,
  entityTypes: () => ['skill', 'book', 'writer', 'category']
})

// Check if content is RTL (Persian)
const isRTL = computed(() => {
  return props.locale === 'fa' || /[\u0600-\u06FF]/.test(props.content)
})

// Process content to add clickable links
const processedContent = computed(() => {
  if (!props.enableAutoLinking) {
    // Simple markdown parsing if auto-linking is disabled
    return props.content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
  }
  
  // Use content parser to detect entities and create links
  return convertContentToClickableHTML(props.content, props.locale)
})
</script>

<style scoped>
.clickable-content :deep(a) {
  color: rgb(var(--color-primary-600));
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
  transition: color 0.2s;
}

.dark .clickable-content :deep(a) {
  color: rgb(var(--color-primary-400));
}

.clickable-content :deep(a:hover) {
  color: rgb(var(--color-primary-700));
}

.dark .clickable-content :deep(a:hover) {
  color: rgb(var(--color-primary-300));
}

.clickable-content :deep(a.entity-skill) {
  color: rgb(var(--color-primary-600));
}

.dark .clickable-content :deep(a.entity-skill) {
  color: rgb(var(--color-primary-400));
}

.clickable-content :deep(a.entity-book) {
  color: rgb(var(--color-primary-500));
  opacity: 0.9;
}

.dark .clickable-content :deep(a.entity-book) {
  color: rgb(var(--color-primary-400));
  opacity: 0.8;
}

.clickable-content :deep(a.entity-writer) {
  color: rgb(var(--color-primary-600));
  opacity: 0.85;
}

.dark .clickable-content :deep(a.entity-writer) {
  color: rgb(var(--color-primary-400));
  opacity: 0.75;
}

.clickable-content :deep(a.entity-category) {
  color: rgb(var(--color-primary-500));
  opacity: 0.9;
}

.dark .clickable-content :deep(a.entity-category) {
  color: rgb(var(--color-primary-400));
  opacity: 0.8;
}

.clickable-content :deep(p) {
  margin-bottom: 1rem;
}

.clickable-content :deep(p:last-child) {
  margin-bottom: 0;
}

.clickable-content :deep(strong) {
  font-weight: 600;
}

.clickable-content :deep(em) {
  font-style: italic;
}
</style>

