<template>
  <NuxtLink
    :to="videoDetailUrl"
    class="block no-underline h-full"
    :aria-label="`${$t('videos.viewVideoDetails')}: ${video.title[locale] || video.title.fa}`"
  >
    <UCard
      :class="[
        'video-card hover-minimal dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 cursor-pointer flex flex-col h-full',
        variant === 'compact' ? 'p-3' : 'p-4'
      ]"
    >
      <!-- Thumbnail with Play Icon Overlay -->
      <div class="relative mb-3 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 aspect-video">
        <NuxtImg
          :src="video.thumbnail"
          :alt="video.title[locale] || video.title.fa"
          class="w-full h-full object-cover"
          loading="lazy"
          format="webp"
        />
        <!-- Play Icon Overlay (YouTube-style) -->
        <div class="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
          <div class="w-16 h-16 rounded-full bg-red-600/90 hover:bg-red-600 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform min-w-[64px] min-h-[64px]">
            <UIcon name="i-twemoji-play-button" class="text-white text-2xl" :class="locale === 'fa' ? 'mr-1' : 'ml-1'" />
          </div>
        </div>
        <!-- Duration Badge (if available) -->
        <div v-if="video.duration" class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {{ formatDuration(video.duration) }}
        </div>
      </div>

      <!-- Title -->
      <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 leading-snug">
        {{ video.title[locale] || video.title.fa }}
      </h3>

      <!-- Description (if shown) -->
      <p v-if="showDescription && video.description?.[locale]" class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
        {{ video.description[locale] || video.description.fa }}
      </p>

      <!-- Related Skills Badges -->
      <div v-if="video.skillIds.length > 0" class="flex flex-wrap gap-1.5 mt-auto">
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

      <!-- View Count (if available) -->
      <div v-if="video.viewCount" class="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {{ formatViewCount(video.viewCount) }} {{ $t('videos.views') }}
      </div>
    </UCard>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Video } from '~/types'
import { getSkillById } from '~/utils/skills'
import { generateVideoSlug } from '~/utils/videos'

interface Props {
  video: Video
  showDescription?: boolean
  variant?: 'default' | 'compact'
}

const props = withDefaults(defineProps<Props>(), {
  showDescription: false,
  variant: 'default',
})

const { locale, t } = useI18n()
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

// Format view count (e.g., 50000 -> "50K")
const formatViewCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}
</script>

<style scoped>
.video-card {
  min-height: 100%;
}

/* Ensure aspect ratio for thumbnail */
.aspect-video {
  aspect-ratio: 16 / 9;
}
</style>

