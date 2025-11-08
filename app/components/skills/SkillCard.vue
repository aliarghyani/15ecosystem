<template>
  <UCard
    :class="[
      'hover-minimal dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer',
      variant === 'compact' ? 'p-4' : ''
    ]"
    @click="navigateToSkill"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {{ skill.id }}
          </span>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {{ skill.name[locale] || skill.name.fa }}
          </h3>
        </div>
        <UIcon
          name="i-heroicons-arrow-left"
          :class="[
            'text-gray-400 dark:text-gray-500 transition-transform',
            locale === 'fa' ? 'rotate-180' : ''
          ]"
        />
      </div>
    </template>

    <div v-if="showDescription && skill.whyItMatters?.[locale]" class="mt-2">
      <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
        {{ skill.whyItMatters[locale] || skill.whyItMatters.fa }}
      </p>
    </div>

    <template #footer v-if="showFooter">
      <UButton
        :to="skillPath"
        variant="soft"
        color="primary"
        block
        size="sm"
        class="mt-2"
      >
        {{ $t('skills.viewDetails') }}
      </UButton>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { Skill } from '~/types'

interface Props {
  skill: Skill
  showDescription?: boolean
  showFooter?: boolean
  variant?: 'default' | 'compact'
}

const props = withDefaults(defineProps<Props>(), {
  showDescription: true,
  showFooter: false,
  variant: 'default',
})

const { locale } = useI18n()
const localePath = useLocalePath()

const skillPath = computed(() => {
  // For now, use skill ID as slug - will be updated when skill pages are created
  return localePath(`/skills/${props.skill.id}`)
})

const navigateToSkill = () => {
  navigateTo(skillPath.value)
}
</script>

