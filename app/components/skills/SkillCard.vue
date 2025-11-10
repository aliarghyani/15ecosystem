<template>
  <NuxtLink
    :to="skillPath"
    class="block no-underline h-full"
  >
    <UCard
      :class="[
        'skill-card hover-minimal dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 cursor-pointer flex flex-col h-full',
        variant === 'compact' ? 'p-4' : ''
      ]"
    >
      <!-- Header Section - Compact Design -->
      <div 
        class="skill-header pb-3 border-b border-gray-200 dark:border-gray-700"
        :class="showDescription && skill.whyItMatters?.[locale] ? 'mb-3' : (showFooter ? 'mb-3' : 'mb-0')"
      >
        <!-- Top Row: Number Badge and Arrow -->
        <div class="flex items-center justify-between mb-2">
          <span
            class="skill-number-badge w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-bold flex items-center justify-center"
          >
            {{ skill.id }}
          </span>
          <UIcon
            name="i-twemoji-left-arrow"
            :class="[
              'text-gray-400 dark:text-gray-500 transition-transform text-sm',
              locale === 'fa' ? 'rotate-180' : ''
            ]"
          />
        </div>
        <!-- Bottom Row: Skill Name (Full Width, Can Wrap) -->
        <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug line-clamp-3">
          {{ skill.name[locale] || skill.name.fa }}
        </h3>
      </div>

      <!-- Content Area - Only shows if description exists -->
      <div v-if="showDescription && skill.whyItMatters?.[locale]" class="skill-content flex-1" :class="showFooter ? 'mb-3' : 'mb-0'">
        <p class="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
          {{ skill.whyItMatters[locale] || skill.whyItMatters.fa }}
        </p>
      </div>

      <!-- Footer - Always at bottom, only if showFooter is true -->
      <div v-if="showFooter" class="skill-footer mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
        <UButton
          variant="soft"
          color="primary"
          block
          size="sm"
          class="w-full pointer-events-none min-h-[44px]"
        >
          {{ $t('skills.viewDetails') }}
        </UButton>
      </div>
    </UCard>
  </NuxtLink>
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
  // Use skill ID as slug
  return localePath(`/skills/${props.skill.id}`)
})
</script>

<style scoped>
.skill-card {
  min-height: 0; /* Allow flex shrinking */
  display: flex;
  flex-direction: column;
}

.skill-header {
  flex-shrink: 0; /* Don't shrink header */
}

.skill-content {
  flex-shrink: 1; /* Allow content to shrink if needed */
  min-height: 0; /* Allow flex shrinking */
}

.skill-footer {
  flex-shrink: 0; /* Don't shrink footer */
  margin-top: auto; /* Push to bottom */
}

.skill-number-badge {
  font-size: 0.75rem; /* text-xs */
  line-height: 1;
}

/* Ensure cards stretch to same height in grids */
:deep(.skill-card) {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>

