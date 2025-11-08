<template>
  <div class="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
    <!-- Previous Skill -->
    <UButton
      v-if="previousSkill"
      :to="localePath(`/skills/${previousSkill.id}`)"
      variant="soft"
      color="primary"
      :icon="locale === 'fa' ? 'i-heroicons-arrow-right' : 'i-heroicons-arrow-left'"
      :icon-position="locale === 'fa' ? 'right' : 'left'"
      class="flex-1 sm:flex-initial"
    >
      <span class="hidden sm:inline">{{ $t('skills.previousSkill') }}</span>
      <span class="sm:hidden">{{ $t('skills.previous') }}</span>
      <span class="hidden sm:inline ml-2">#{{ previousSkill.id }}</span>
    </UButton>
    <div v-else class="flex-1 sm:flex-initial"></div>

    <!-- Back to Category -->
    <UButton
      :to="localePath(`/categories/${categoryId}`)"
      variant="outline"
      color="primary"
      icon="i-heroicons-arrow-up"
      class="flex-1 sm:flex-initial"
    >
      {{ $t('skills.backToCategory') }}
    </UButton>

    <!-- Next Skill -->
    <UButton
      v-if="nextSkill"
      :to="localePath(`/skills/${nextSkill.id}`)"
      variant="soft"
      color="primary"
      :icon="locale === 'fa' ? 'i-heroicons-arrow-left' : 'i-heroicons-arrow-right'"
      icon-position="right"
      class="flex-1 sm:flex-initial"
    >
      <span class="hidden sm:inline">{{ $t('skills.nextSkill') }}</span>
      <span class="sm:hidden">{{ $t('skills.next') }}</span>
      <span class="hidden sm:inline mr-2">#{{ nextSkill.id }}</span>
    </UButton>
    <div v-else class="flex-1 sm:flex-initial"></div>
  </div>
</template>

<script setup lang="ts">
import { getNextSkill, getPreviousSkill } from '~/utils/skills'
import type { Skill } from '~/types'

interface Props {
  currentSkillId: number
  categoryId: string
}

const props = defineProps<Props>()

const { locale } = useI18n()
const localePath = useLocalePath()

const previousSkill = computed<Skill | undefined>(() => {
  return getPreviousSkill(props.currentSkillId, locale.value as 'fa' | 'en')
})

const nextSkill = computed<Skill | undefined>(() => {
  return getNextSkill(props.currentSkillId, locale.value as 'fa' | 'en')
})
</script>

