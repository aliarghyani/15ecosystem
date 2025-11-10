<template>
  <NuxtLink
    v-if="clickable"
    :to="tagPath"
    class="inline-block no-underline"
  >
    <UBadge
      :label="tagName"
      :size="size"
      :color="badgeColor"
      :variant="variant"
      :class="badgeClass"
    >
      <template v-if="showCount && count > 0" #trailing>
        <span class="ml-1 text-xs opacity-75">({{ count }})</span>
      </template>
    </UBadge>
  </NuxtLink>
  <UBadge
    v-else
    :label="tagName"
    :size="size"
    :color="badgeColor"
    :variant="variant"
    :class="badgeClass"
  >
    <template v-if="showCount && count > 0" #trailing>
      <span class="ml-1 text-xs opacity-75">({{ count }})</span>
    </template>
  </UBadge>
</template>

<script setup lang="ts">
import type { Tag } from '~/types'
import { getTagBySlug, getTagCount } from '~/utils/tags'

interface Props {
  tag: Tag | string // Tag object or tag slug
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'outline' | 'soft' | 'subtle'
  showCount?: boolean // Show count of items with this tag
  clickable?: boolean
  color?: string // Override color (Nuxt UI color name)
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
  variant: 'soft',
  showCount: false,
  clickable: true,
  color: undefined
})

const { locale } = useI18n()
const localePath = useLocalePath()

// Resolve tag object
const tagObject = computed<Tag | undefined>(() => {
  if (typeof props.tag === 'string') {
    return getTagBySlug(props.tag, locale.value as 'fa' | 'en')
  }
  return props.tag
})

// Get tag name based on locale
const tagName = computed(() => {
  if (!tagObject.value) return typeof props.tag === 'string' ? props.tag : ''
  return locale.value === 'fa' ? tagObject.value.name.fa : tagObject.value.name.en
})

// Get tag slug
const tagSlug = computed(() => {
  if (!tagObject.value) return typeof props.tag === 'string' ? props.tag : ''
  return tagObject.value.slug
})

// Get tag path
const tagPath = computed(() => {
  return localePath(`/tags/${tagSlug.value}`)
})

// Get count if needed
const count = computed(() => {
  if (!props.showCount) return 0
  return getTagCount(tagSlug.value, locale.value as 'fa' | 'en')
})

// Determine badge color
// Map tag categories to Nuxt UI colors, or use provided color
const badgeColor = computed(() => {
  if (props.color) return props.color
  
  if (!tagObject.value) return 'primary'
  
  // Map tag categories to colors
  const colorMap: Record<string, string> = {
    skill: 'primary',
    book: 'indigo',
    writer: 'purple',
    category: 'emerald',
    general: 'primary'
  }
  
  return colorMap[tagObject.value.category || 'general'] || 'primary'
})

// Badge class for additional styling
const badgeClass = computed(() => {
  return props.clickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
})
</script>

