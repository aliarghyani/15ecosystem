<template>
  <NuxtLink
    v-if="clickable"
    :to="bookPath"
    class="block no-underline h-full"
  >
    <UCard
      :class="[
        'hover-minimal dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:shadow-lg h-full',
        variant === 'compact' ? 'p-3' : ''
      ]"
    >
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <UIcon name="i-heroicons-book-open" class="text-primary-600 dark:text-primary-400 text-xl" />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
            {{ book.title }}
          </h3>
          <p v-if="showAuthor" class="text-sm text-gray-600 dark:text-gray-400">
            {{ book.author }}
          </p>
        </div>
      </div>
    </UCard>
  </NuxtLink>
  <UCard
    v-else
    :class="[
      'hover-minimal dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm transition-all duration-300',
      variant === 'compact' ? 'p-3' : ''
    ]"
  >
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0">
        <div class="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <UIcon name="i-heroicons-book-open" class="text-primary-600 dark:text-primary-400 text-xl" />
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
          {{ book.title }}
        </h3>
        <p v-if="showAuthor" class="text-sm text-gray-600 dark:text-gray-400">
          {{ book.author }}
        </p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Book } from '~/types'
import { getBookSlug } from '~/utils/books'

interface Props {
  book: Book
  showAuthor?: boolean
  variant?: 'default' | 'compact'
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAuthor: true,
  variant: 'default',
  clickable: true,
})

const localePath = useLocalePath()

const bookPath = computed(() => {
  const slug = getBookSlug(props.book.title, props.book.author)
  return localePath(`/books/${slug}`)
})
</script>

