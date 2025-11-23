<template>
  <NuxtLink
    :to="videoDetailUrl"
    class="block no-underline group cursor-pointer"
    :aria-label="`${$t('videos.viewVideoDetails')}: ${video.title[locale] || video.title.fa}`"
  >
    <!-- Thumbnail -->
    <div class="relative mb-3 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
      <NuxtImg
        :src="video.thumbnail"
        :alt="video.title[locale] || video.title.fa"
        class="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-200"
        loading="lazy"
        format="webp"
      />
      <!-- Duration Badge -->
      <div v-if="video.duration" class="absolute bottom-2 right-2 bg-black/90 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
        {{ formatDuration(video.duration) }}
      </div>
    </div>

    <!-- Video Info -->
    <div class="flex gap-3">
      <!-- Channel Avatar -->
      <div v-if="video.channelName" class="flex-shrink-0">
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
          {{ getChannelInitial(video.channelName) }}
        </div>
      </div>

      <!-- Video Details -->
      <div class="flex-1 min-w-0">
        <!-- Title -->
        <h3 class="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" :title="video.title[locale] || video.title.fa">
          {{ video.title[locale] || video.title.fa }}
        </h3>

        <!-- Channel Name -->
        <p v-if="video.channelName" class="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {{ video.channelName }}
        </p>

        <!-- Views & Date -->
        <div class="text-xs text-gray-600 dark:text-gray-400">
          <span v-if="video.viewCount">{{ formatViewCount(video.viewCount) }} views</span>
          <span v-if="video.viewCount && video.publishedAt" class="mx-1">•</span>
          <span v-if="video.publishedAt">{{ formatRelativeDate(video.publishedAt) }}</span>
        </div>

        <!-- Related Skills Badges (optional) -->
        <div v-if="showSkills && video.skillIds.length > 0" class="flex flex-wrap gap-1.5 mt-2">
          <UBadge
            v-for="skillId in video.skillIds.slice(0, 3)"
            :key="skillId"
            :label="getSkillLabel(skillId)"
            size="xs"
            color="primary"
            variant="soft"
            class="text-[10px] px-1.5 py-0.5"
          />
          <UBadge
            v-if="video.skillIds.length > 3"
            :label="`+${video.skillIds.length - 3}`"
            size="xs"
            color="neutral"
            variant="soft"
            class="text-[10px] px-1.5 py-0.5"
          />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Video } from '~/types'
import { getSkillById } from '~/utils/skills'
import { generateVideoSlug } from '~/utils/videos'
import { formatRelativeDate, formatViewCount } from '~/utils/date'

interface Props {
  video: Video
  showSkills?: boolean
  variant?: 'default' | 'compact'
}

const props = withDefaults(defineProps<Props>(), {
  showSkills: false,
  variant: 'default',
})

const { locale } = useI18n()
const localePath = useLocalePath()

// Generate video detail page URL
const videoDetailUrl = computed(() => {
  const slug = generateVideoSlug(props.video, locale.value as 'fa' | 'en')
  return localePath(`/videos/${slug}`)
})

// Get skill label for badge
const getSkillLabel = (skillId: number): string => {
  const skill = getSkillById(skillId, locale.value as 'fa' | 'en')
  if (skill) {
    return locale.value === 'fa' ? skill.name.fa : skill.name.en
  }
  return locale.value === 'fa' ? `مهارت ${skillId}` : `Skill ${skillId}`
}

// Get channel initial for avatar placeholder
const getChannelInitial = (channelName: string): string => {
  return channelName.charAt(0).toUpperCase()
}

// Format duration from seconds to MM:SS or HH:MM:SS
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
/* Ensure aspect ratio for thumbnail */
.aspect-video {
  aspect-ratio: 16 / 9;
}
</style>

