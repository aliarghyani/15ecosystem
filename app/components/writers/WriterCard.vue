<template>
  <NuxtLink
    v-if="clickable"
    :to="writerPath"
    class="block no-underline"
  >
    <UCard
      :class="[
        'hover-minimal dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm transition-all duration-300 ease-out cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 h-full',
        variant === 'compact' ? 'p-3' : 'p-4'
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Writer Photo and Name -->
        <div class="flex items-start gap-4 mb-3">
          <div class="flex-shrink-0">
            <div
              v-if="writer.photo"
              class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center overflow-hidden"
            >
              <NuxtImg :src="writer.photo" :alt="writer.name" class="w-full h-full object-cover" loading="lazy" />
            </div>
            <div
              v-else
              class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center"
            >
              <UIcon name="i-twemoji-bust-in-silhouette" class="text-white text-2xl" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
              {{ writer.name }}
            </h3>
            <p v-if="writer.tagline && showTagline" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
              {{ locale === 'fa' ? writer.tagline.fa : writer.tagline.en }}
            </p>
          </div>
        </div>

        <!-- Bio Excerpt -->
        <p v-if="showBio && writer.biography" class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-1">
          {{ locale === 'fa' ? writer.biography.fa : writer.biography.en }}
        </p>

        <!-- Books Count and Skills -->
        <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
          <div v-if="showBooksCount" class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <UIcon name="i-twemoji-open-book" class="w-4 h-4" />
            <span>{{ writer.books.length }} {{ writer.books.length === 1 ? (locale === 'fa' ? 'کتاب' : 'book') : (locale === 'fa' ? 'کتاب' : 'books') }}</span>
          </div>
          <div v-if="showSkills && writer.skillIds.length > 0" class="flex flex-wrap gap-1">
            <UBadge
              v-for="skillId in writer.skillIds.slice(0, 2)"
              :key="skillId"
              :label="getSkillLabel(skillId)"
              size="xs"
              color="primary"
              variant="soft"
              class="text-[10px]"
            />
            <UBadge
              v-if="writer.skillIds.length > 2"
              :label="`+${writer.skillIds.length - 2}`"
              size="xs"
              color="neutral"
              variant="soft"
              class="text-[10px]"
            />
          </div>
        </div>
      </div>
    </UCard>
  </NuxtLink>
  <UCard
    v-else
    :class="[
      'hover-minimal dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm transition-all duration-300 h-full',
      variant === 'compact' ? 'p-3' : 'p-4'
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Writer Photo and Name -->
      <div class="flex items-start gap-4 mb-3">
        <div class="flex-shrink-0">
          <div
            v-if="writer.photo"
            class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center overflow-hidden"
          >
            <img :src="writer.photo" :alt="writer.name" class="w-full h-full object-cover" />
          </div>
          <div
            v-else
            class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center"
          >
            <UIcon name="i-twemoji-bust-in-silhouette" class="text-white text-2xl" />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
            {{ writer.name }}
          </h3>
          <p v-if="writer.tagline && showTagline" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
            {{ locale === 'fa' ? writer.tagline.fa : writer.tagline.en }}
          </p>
        </div>
      </div>

      <!-- Bio Excerpt -->
      <p v-if="showBio && writer.biography" class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-1">
        {{ locale === 'fa' ? writer.biography.fa : writer.biography.en }}
      </p>

      <!-- Books Count and Skills -->
      <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
        <div v-if="showBooksCount" class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <UIcon name="i-twemoji-open-book" class="w-4 h-4" />
          <span>{{ writer.books.length }} {{ writer.books.length === 1 ? (locale === 'fa' ? 'کتاب' : 'book') : (locale === 'fa' ? 'کتاب' : 'books') }}</span>
        </div>
        <div v-if="showSkills && writer.skillIds.length > 0" class="flex flex-wrap gap-1">
          <UBadge
            v-for="skillId in writer.skillIds.slice(0, 2)"
            :key="skillId"
            :label="getSkillLabel(skillId)"
            size="xs"
            color="primary"
            variant="soft"
            class="text-[10px]"
          />
          <UBadge
            v-if="writer.skillIds.length > 2"
            :label="`+${writer.skillIds.length - 2}`"
            size="xs"
            color="neutral"
            variant="soft"
            class="text-[10px]"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Writer } from '~/types'
import { getSkillById } from '~/utils/skills'

interface Props {
  writer: Writer
  showBio?: boolean
  showTagline?: boolean
  showBooksCount?: boolean
  showSkills?: boolean
  variant?: 'default' | 'compact'
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showBio: true,
  showTagline: false,
  showBooksCount: true,
  showSkills: true,
  variant: 'default',
  clickable: true
})

const { locale } = useI18n()
const localePath = useLocalePath()

const writerPath = computed(() => {
  return localePath(`/writers/${props.writer.slug}`)
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

