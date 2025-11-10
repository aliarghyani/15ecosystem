<template>
  <NuxtLink
    v-if="clickable"
    :to="bookPath"
    class="block no-underline"
  >
    <InspiraBook
      :size="bookSize"
      :color="bookColor"
      :radius="bookRadius"
      :shadow-size="bookShadowSize"
      :duration="800"
      class="cursor-pointer"
    >
      <BookTitle>
        {{ book.title }}
      </BookTitle>
      <BookDescription v-if="showAuthor">
        {{ book.author }}
      </BookDescription>
      <div v-if="book.skillIds.length > 0" class="flex flex-wrap gap-1.5 mt-3">
        <UBadge
          v-for="skillId in book.skillIds"
          :key="skillId"
          :label="getSkillLabel(skillId)"
          size="xs"
          color="primary"
          variant="soft"
          class="text-[10px] px-1.5 py-0.5"
        />
      </div>
    </InspiraBook>
  </NuxtLink>
  <InspiraBook
    v-else
    :size="bookSize"
    :color="bookColor"
    :radius="bookRadius"
    :shadow-size="bookShadowSize"
    :duration="800"
    :is-static="true"
  >
    <BookTitle>
      {{ book.title }}
    </BookTitle>
    <BookDescription v-if="showAuthor">
      {{ book.author }}
    </BookDescription>
    <div v-if="book.skillIds.length > 0" class="flex flex-wrap gap-1.5 mt-3">
      <UBadge
        v-for="skillId in book.skillIds"
        :key="skillId"
        :label="getSkillLabel(skillId)"
        size="xs"
        color="primary"
        variant="soft"
        class="text-[10px] px-1.5 py-0.5"
      />
    </div>
  </InspiraBook>
</template>

<script setup lang="ts">
import type { Book } from '~/types'
import { getBookSlug } from '~/utils/books'
import { getSkillById } from '~/utils/skills'
import { Book as InspiraBook, BookTitle, BookDescription, type BookSize, type BookColor, type BookRadius, type BookShadowSize } from '~/components/inspira'
import { useAppConfig } from '#imports'

const props = withDefaults(defineProps<{
  book: Book
  showAuthor?: boolean
  variant?: 'default' | 'compact'
  clickable?: boolean
  size?: BookSize
  color?: BookColor
  radius?: BookRadius
  shadowSize?: BookShadowSize
  description?: string
}>(), {
  showAuthor: true,
  variant: 'default',
  clickable: true,
  size: 'md',
  color: undefined, // Will use primary color if not provided
  radius: 'md',
  shadowSize: 'lg',
  description: undefined
})

const { locale } = useI18n()
const localePath = useLocalePath()
const appConfig = useAppConfig()

const bookPath = computed(() => {
  const slug = getBookSlug(props.book.title, props.book.author)
  return localePath(`/books/${slug}`)
})

// Map variant to size if not explicitly provided
const bookSize = computed<BookSize>(() => {
  if (props.size) return props.size
  return props.variant === 'compact' ? 'sm' : 'md'
})

// Get primary color from appConfig and map to BookColor
const primaryColor = computed(() => {
  const primary = (appConfig.ui as any)?.primary || (appConfig.ui as any)?.colors?.primary || 'purple'
  // Map Nuxt UI primary colors to Inspira Book colors
  const colorMap: Record<string, BookColor> = {
    red: 'red',
    orange: 'orange',
    amber: 'amber',
    yellow: 'yellow',
    lime: 'lime',
    green: 'green',
    emerald: 'emerald',
    teal: 'teal',
    cyan: 'cyan',
    sky: 'sky',
    blue: 'blue',
    indigo: 'indigo',
    violet: 'violet',
    purple: 'purple',
    fuchsia: 'fuchsia',
    pink: 'pink',
    rose: 'rose'
  }
  return colorMap[primary] || 'zinc'
})

const bookColor = computed<BookColor>(() => props.color || primaryColor.value)
const bookRadius = computed<BookRadius>(() => props.radius || 'md')
const bookShadowSize = computed<BookShadowSize>(() => props.shadowSize || 'lg')

// Get skill label for badge
const getSkillLabel = (skillId: number): string => {
  const skill = getSkillById(skillId, locale.value as 'fa' | 'en')
  if (skill) {
    return locale.value === 'fa' ? skill.name.fa : skill.name.en
  }
  return locale.value === 'fa' ? `مهارت ${skillId}` : `Skill ${skillId}`
}

</script>

