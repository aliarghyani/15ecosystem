<template>
  <div class="video-list">
    <!-- Filter by Skill (if provided) -->
    <div v-if="filterBySkillId" class="mb-6">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ $t('videos.filteredBySkill') }}: {{ getSkillLabel(filterBySkillId) }}
      </p>
    </div>

    <!-- Group by Category -->
    <div v-if="groupBy === 'category'" class="space-y-12">
      <div v-for="category in categories" :key="category.id" class="category-group">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {{ category.name[locale] || category.name.fa }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ getVideosInCategory(category.id).length }} {{ $t('videos.videos') }}
          </p>
        </div>

        <div v-if="getVideosInCategory(category.id).length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <VideoCard
            v-for="video in getVideosInCategory(category.id)"
            :key="video.id"
            :video="video"
            :show-skills="showSkills"
            :variant="variant"
          />
        </div>
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
          {{ $t('videos.noVideosInCategory') }}
        </div>
      </div>
    </div>

    <!-- Group by Skill -->
    <div v-else-if="groupBy === 'skill'" class="space-y-12">
      <div v-for="skillId in uniqueSkillIds" :key="skillId" class="skill-group">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {{ getSkillLabel(skillId) }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ getVideosBySkill(skillId).length }} {{ $t('videos.videos') }}
          </p>
        </div>

        <div v-if="getVideosBySkill(skillId).length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <VideoCard
            v-for="video in getVideosBySkill(skillId)"
            :key="video.id"
            :video="video"
            :show-skills="showSkills"
            :variant="variant"
          />
        </div>
      </div>
    </div>

    <!-- No Grouping (Simple List) -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <VideoCard
        v-for="video in filteredVideos"
        :key="video.id"
        :video="video"
        :show-skills="showSkills"
        :variant="variant"
      />
    </div>

    <!-- Empty State -->
    <div v-if="filteredVideos.length === 0" class="text-center py-12">
      <UIcon name="i-twemoji-video-camera" class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
      <p class="text-lg text-gray-600 dark:text-gray-400">
        {{ $t('videos.noVideosFound') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video, Category } from '~/types'
import { getAllCategories } from '~/utils/categories'
import { getSkillById } from '~/utils/skills'
import VideoCard from './VideoCard.vue'

interface Props {
  videos: Video[]
  groupBy?: 'category' | 'skill' | 'playlist' | 'none'
  filterBySkillId?: number
  filterByCategoryId?: string
  showSkills?: boolean
  variant?: 'default' | 'compact'
}

const props = withDefaults(defineProps<Props>(), {
  groupBy: 'category',
  filterBySkillId: undefined,
  filterByCategoryId: undefined,
  showSkills: false,
  variant: 'default',
})

const { locale } = useI18n()

// Get all categories for grouping
const categories = computed(() => getAllCategories(locale.value as 'fa' | 'en'))

// Filter videos based on props
const filteredVideos = computed(() => {
  let result = [...props.videos]

  if (props.filterBySkillId) {
    result = result.filter((video) => video.skillIds.includes(props.filterBySkillId!))
  }

  if (props.filterByCategoryId) {
    result = result.filter((video) => video.categoryIds.includes(props.filterByCategoryId!))
  }

  return result
})

// Get unique skill IDs from filtered videos
const uniqueSkillIds = computed(() => {
  const skillIds = new Set<number>()
  filteredVideos.value.forEach((video) => {
    video.skillIds.forEach((skillId) => skillIds.add(skillId))
  })
  return Array.from(skillIds).sort((a, b) => a - b)
})

// Get videos in a specific category
const getVideosInCategory = (categoryId: string): Video[] => {
  return filteredVideos.value.filter((video) => video.categoryIds.includes(categoryId))
}

// Get videos for a specific skill
const getVideosBySkill = (skillId: number): Video[] => {
  return filteredVideos.value.filter((video) => video.skillIds.includes(skillId))
}

// Get skill label
const getSkillLabel = (skillId: number): string => {
  const skill = getSkillById(skillId, locale.value as 'fa' | 'en')
  if (skill) {
    return locale.value === 'fa' ? skill.name.fa : skill.name.en
  }
  return locale.value === 'fa' ? `مهارت ${skillId}` : `Skill ${skillId}`
}
</script>

