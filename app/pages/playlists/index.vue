<template>
  <div class="max-w-6xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <Breadcrumb :items="breadcrumbItems" />

    <!-- Page Header -->
    <div class="mb-12 text-center">
      <h1 class="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
        {{ $t('playlists.title') }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        {{ $t('playlists.description') }}
      </p>
    </div>

    <!-- Filter by Skill (if query param present) -->
    <div v-if="skillFilter" class="mb-8">
      <UCard class="dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {{ $t('playlists.filteredBySkill') }}
            </p>
            <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ getSkillLabel(skillFilter) }}
            </p>
          </div>
          <UButton
            :to="localePath('/playlists')"
            variant="ghost"
            color="primary"
            size="sm"
            icon="i-twemoji-cross-mark"
            class="min-h-[44px]"
          >
            {{ $t('common.clearFilter') }}
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Playlists by Category -->
    <div v-if="hasPlaylists" class="space-y-12">
      <!-- Health Category -->
      <div v-if="healthPlaylists.length > 0">
        <div class="mb-6">
          <NuxtLink
            :to="localePath('/categories/health')"
            class="inline-block group"
          >
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ getCategoryName('health') }}
            </h2>
          </NuxtLink>
          <p class="text-gray-600 dark:text-gray-400">
            {{ healthPlaylists.length }} {{ $t('playlists.playlists') }} {{ $t('common.relatedTo') }} {{ getCategoryName('health') }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <PlaylistCard
            v-for="playlist in healthPlaylists"
            :key="playlist.id"
            :playlist="playlist"
            :show-description="false"
            variant="default"
          />
        </div>
      </div>

      <!-- Identity Category -->
      <div v-if="identityPlaylists.length > 0">
        <div class="mb-6">
          <NuxtLink
            :to="localePath('/categories/identity')"
            class="inline-block group"
          >
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ getCategoryName('identity') }}
            </h2>
          </NuxtLink>
          <p class="text-gray-600 dark:text-gray-400">
            {{ identityPlaylists.length }} {{ $t('playlists.playlists') }} {{ $t('common.relatedTo') }} {{ getCategoryName('identity') }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <PlaylistCard
            v-for="playlist in identityPlaylists"
            :key="playlist.id"
            :playlist="playlist"
            :show-description="false"
            variant="default"
          />
        </div>
      </div>

      <!-- Career Category -->
      <div v-if="careerPlaylists.length > 0">
        <div class="mb-6">
          <NuxtLink
            :to="localePath('/categories/career')"
            class="inline-block group"
          >
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ getCategoryName('career') }}
            </h2>
          </NuxtLink>
          <p class="text-gray-600 dark:text-gray-400">
            {{ careerPlaylists.length }} {{ $t('playlists.playlists') }} {{ $t('common.relatedTo') }} {{ getCategoryName('career') }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <PlaylistCard
            v-for="playlist in careerPlaylists"
            :key="playlist.id"
            :playlist="playlist"
            :show-description="false"
            variant="default"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <UCard class="dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm">
        <UIcon name="i-twemoji-video-camera" class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">
          {{ $t('playlists.noPlaylistsFound') }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-500">
          {{ $t('playlists.noPlaylistsDescription') || 'Playlists will be added soon.' }}
        </p>
      </UCard>
    </div>

    <!-- Navigation -->
    <div class="flex justify-center mt-12">
      <UButton :to="localePath('/')" variant="soft" color="primary" icon="i-twemoji-house" class="min-h-[44px]">
        {{ $t('category.backToHome') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAllPlaylists, getPlaylistsByCategoryId } from '~/utils/playlists'
import { getCategoryById } from '~/utils/categories'
import { getSkillById } from '~/utils/skills'
import PlaylistCard from '~/components/playlists/PlaylistCard.vue'
import Breadcrumb from '~/components/common/Breadcrumb.vue'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

// Get skill filter from query params
const skillFilter = computed(() => {
  const skillId = route.query.skill
  if (skillId && typeof skillId === 'string') {
    const id = parseInt(skillId, 10)
    if (!isNaN(id) && id >= 1 && id <= 15) {
      return id
    }
  }
  return null
})

// Get all playlists
const allPlaylists = computed(() => {
  let playlists = getAllPlaylists(locale.value as 'fa' | 'en')
  
  // Filter by skill if query param present
  if (skillFilter.value) {
    playlists = playlists.filter((playlist) => playlist.skillIds.includes(skillFilter.value!))
  }
  
  return playlists
})

// Get playlists by category
const healthPlaylists = computed(() => {
  return allPlaylists.value.filter((playlist) => playlist.categoryIds.includes('health'))
})

const identityPlaylists = computed(() => {
  return allPlaylists.value.filter((playlist) => playlist.categoryIds.includes('identity'))
})

const careerPlaylists = computed(() => {
  return allPlaylists.value.filter((playlist) => playlist.categoryIds.includes('career'))
})

// Check if there are any playlists
const hasPlaylists = computed(() => {
  return healthPlaylists.value.length > 0 || identityPlaylists.value.length > 0 || careerPlaylists.value.length > 0
})

// Get category name
function getCategoryName(categoryId: 'health' | 'identity' | 'career'): string {
  const category = getCategoryById(categoryId, locale.value as 'fa' | 'en')
  return category?.name[locale.value] || category?.name.fa || categoryId
}

// Get skill label
function getSkillLabel(skillId: number): string {
  const skill = getSkillById(skillId, locale.value as 'fa' | 'en')
  if (skill) {
    return locale.value === 'fa' ? skill.name.fa : skill.name.en
  }
  return locale.value === 'fa' ? `مهارت ${skillId}` : `Skill ${skillId}`
}

// Breadcrumb items
const breadcrumbItems = computed(() => {
  const items: Array<{ label: string; to?: string; icon?: string }> = [
    {
      label: t('breadcrumb.home'),
      to: '/',
      icon: 'i-twemoji-house'
    },
    {
      label: t('playlists.title'),
      icon: 'i-twemoji-video-camera'
      // to omitted for current page
    }
  ]
  return items
})

// Set page title
useHead({
  title: computed(() => {
    return `${t('playlists.title')} - 15ecosystem`
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        return t('playlists.description')
      }),
    },
  ],
})
</script>

