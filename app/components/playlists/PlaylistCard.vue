<template>
  <NuxtLink
    :to="localePath(`/playlists/${playlistSlug}`)"
    class="block no-underline h-full"
    :aria-label="`${$t('playlists.viewPlaylist') || 'View playlist'}: ${playlist.title[locale] || playlist.title.fa}`"
  >
    <UCard
      :class="[
        'playlist-card hover-minimal dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 cursor-pointer flex flex-col h-full',
        variant === 'compact' ? 'p-3' : 'p-4'
      ]"
    >
      <!-- Thumbnail -->
      <div class="relative mb-3 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 aspect-video">
        <NuxtImg
          :src="playlist.thumbnail"
          :alt="playlist.title[locale] || playlist.title.fa"
          class="w-full h-full object-cover"
          loading="lazy"
          format="webp"
        />
        <!-- Playlist Icon Overlay -->
        <div class="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
          <div class="w-16 h-16 rounded-full bg-primary-600/90 hover:bg-primary-600 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform min-w-[64px] min-h-[64px]">
            <UIcon name="i-twemoji-play-button" class="text-white text-2xl" :class="locale === 'fa' ? 'mr-1' : 'ml-1'" />
          </div>
        </div>
        <!-- Video Count Badge -->
        <div class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <UIcon name="i-twemoji-video-camera" class="w-3 h-3" />
          <span>{{ playlist.videoCount }}</span>
        </div>
      </div>

      <!-- Title -->
      <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 leading-snug">
        {{ playlist.title[locale] || playlist.title.fa }}
      </h3>

      <!-- Description (if shown) -->
      <p v-if="showDescription && playlist.description?.[locale]" class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
        {{ playlist.description[locale] || playlist.description.fa }}
      </p>

      <!-- Related Skills Badges -->
      <div v-if="playlist.skillIds.length > 0" class="flex flex-wrap gap-1.5 mt-auto">
        <UBadge
          v-for="skillId in playlist.skillIds.slice(0, 3)"
          :key="skillId"
          :label="getSkillLabel(skillId)"
          size="xs"
          color="primary"
          variant="soft"
          class="text-[10px] px-1.5 py-0.5"
        />
        <UBadge
          v-if="playlist.skillIds.length > 3"
          :label="`+${playlist.skillIds.length - 3}`"
          size="xs"
          color="neutral"
          variant="soft"
          class="text-[10px] px-1.5 py-0.5"
        />
      </div>
    </UCard>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Playlist } from '~/types'
import { generatePlaylistSlug } from '~/utils/playlists'
import { getSkillById } from '~/utils/skills'

interface Props {
  playlist: Playlist
  showDescription?: boolean
  variant?: 'default' | 'compact'
}

const props = withDefaults(defineProps<Props>(), {
  showDescription: false,
  variant: 'default',
})

const { locale } = useI18n()
const localePath = useLocalePath()

// Generate playlist slug
const playlistSlug = computed(() => {
  return generatePlaylistSlug(props.playlist, locale.value as 'fa' | 'en')
})

// Get skill label for badge
const getSkillLabel = (skillId: number): string => {
  const skill = getSkillById(skillId, locale.value as 'fa' | 'en')
  if (skill) {
    return locale.value === 'fa' ? skill.name.fa : skill.name.en
  }
  return locale.value === 'fa' ? `مهارت ${skillId}` : `Skill ${skillId}`
}
</script>

<style scoped>
.playlist-card {
  min-height: 100%;
}

/* Ensure aspect ratio for thumbnail */
.aspect-video {
  aspect-ratio: 16 / 9;
}
</style>

