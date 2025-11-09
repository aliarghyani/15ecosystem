<template>
  <div class="skill-relationship-diagram w-full" :dir="locale === 'fa' ? 'rtl' : 'ltr'">
    <!-- Diagram Container -->
    <div class="relative w-full p-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-slate-700">
      <!-- Title -->
      <h3 class="text-xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
        {{ $t('diagrams.skillRelationships') || 'Skill Relationships & Ecosystem' }}
      </h3>

      <!-- Main Progression Flow - Each Category in Own Row -->
      <div class="progression-flow space-y-8 mb-8">
        <!-- Category Row -->
        <div
          v-for="(step, categoryIndex) in progressionSteps"
          :key="step.category"
          class="category-row"
        >
          <!-- Category Header -->
          <div
            class="category-header mb-4 p-5 rounded-xl shadow-lg"
            :class="getCategoryColorClass(step.category, 'badge')"
          >
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h4 class="text-xl font-bold text-white mb-1">
                  {{ getCategoryName(step.category) }}
                </h4>
                <p class="text-sm text-white/90">
                  {{ getCategoryDescription(step.category) }}
                </p>
              </div>
              <div class="text-right">
                <span class="text-2xl font-bold text-white">
                  {{ step.skills.length }}
                </span>
                <p class="text-xs text-white/90">
                  {{ $t('home.skillCount', { count: step.skills.length }) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Skills Grid -->
          <div class="skills-in-category grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <NuxtLink
              v-for="skill in step.skills"
              :key="skill.id"
              :to="localePath(`/skills/${skill.id}`)"
              class="skill-node group relative p-4 rounded-lg transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-105 border-2"
              :class="[
                getCategoryColorClass(step.category, 'skill'),
                isFoundationalSkill(skill.id) ? 'ring-2 ring-amber-400 dark:ring-amber-500' : ''
              ]"
            >
              <div class="flex flex-col items-center gap-2 text-center">
                <span
                  class="skill-number w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md relative"
                  :class="getCategoryColorClass(step.category, 'badge')"
                >
                  {{ skill.id }}
                  <span
                    v-if="isFoundationalSkill(skill.id)"
                    class="absolute -top-1 -right-1 text-xs"
                    title="Foundational Skill"
                  >
                    ⭐
                  </span>
                </span>
                <span class="skill-name text-sm font-semibold leading-tight">
                  {{ skill.name[locale] || skill.name.fa }}
                </span>
                <span
                  v-if="getFoundationScore(skill.id) > 0"
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  Score: {{ getFoundationScore(skill.id) }}
                </span>
              </div>
            </NuxtLink>
          </div>

          <!-- Arrow Connector (between categories, only on desktop) -->
          <div
            v-if="categoryIndex < progressionSteps.length - 1"
            class="arrow-connector hidden lg:flex items-center justify-center mt-6 mb-2"
          >
            <div class="flex items-center gap-2">
              <div class="h-px w-16 bg-gradient-to-r from-transparent via-primary-400 to-transparent dark:via-primary-500"></div>
              <UIcon
                name="i-heroicons-arrow-down"
                class="text-2xl text-primary-500 dark:text-primary-400"
              />
              <div class="h-px w-16 bg-gradient-to-r from-transparent via-primary-400 to-transparent dark:via-primary-500"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { getAllSkills } from '~/utils/skills'
import { getAllCategories } from '~/utils/categories'
import {
  getTopFoundationalSkills,
  calculateFoundationScore,
} from '~/utils/diagrams'
import type { Skill, Category } from '~/types'

interface Props {
  // Removed showConnections and showFullNetwork - diagrams will be on individual skill pages
}

const { locale } = useI18n()
const localePath = useLocalePath()

// Get all skills and categories
const allSkills = computed<Skill[]>(() => {
  return getAllSkills(locale.value as 'fa' | 'en')
})

const allCategories = computed<Category[]>(() => {
  return getAllCategories(locale.value as 'fa' | 'en')
})

// Define progression steps based on categories
const progressionSteps = computed(() => {
  const healthSkills = allSkills.value.filter((s) => s.category === 'health').sort((a, b) => a.id - b.id)
  const identitySkills = allSkills.value.filter((s) => s.category === 'identity').sort((a, b) => a.id - b.id)
  const careerSkills = allSkills.value.filter((s) => s.category === 'career').sort((a, b) => a.id - b.id)

  return [
    {
      category: 'health' as const,
      skills: healthSkills,
    },
    {
      category: 'identity' as const,
      skills: identitySkills,
    },
    {
      category: 'career' as const,
      skills: careerSkills,
    },
  ]
})

// Get top foundational skills (for highlighting)
const topFoundationalSkills = computed(() => {
  return getTopFoundationalSkills(5, locale.value as 'fa' | 'en')
})

// Check if a skill is foundational
function isFoundationalSkill(skillId: number): boolean {
  return topFoundationalSkills.value.some((s) => s.skill.id === skillId)
}

// Get foundation score for a skill
function getFoundationScore(skillId: number): number {
  return calculateFoundationScore(skillId, allSkills.value, locale.value as 'fa' | 'en')
}

// Get category name
function getCategoryName(categoryId: 'health' | 'identity' | 'career'): string {
  const category = allCategories.value.find((c) => c.id === categoryId)
  return category?.name[locale.value] || category?.name.fa || categoryId
}

// Get category description
function getCategoryDescription(categoryId: 'health' | 'identity' | 'career'): string {
  const category = allCategories.value.find((c) => c.id === categoryId)
  return category?.description[locale.value] || category?.description.fa || ''
}

// Get category color class
function getCategoryColorClass(
  category: 'health' | 'identity' | 'career',
  type: 'badge' | 'skill' = 'badge'
): string {
  const colors = {
    health: {
      badge: 'bg-green-500 dark:bg-green-600',
      skill: 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-800 text-green-800 dark:text-green-200',
    },
    identity: {
      badge: 'bg-blue-500 dark:bg-blue-600',
      skill: 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    },
    career: {
      badge: 'bg-purple-500 dark:bg-purple-600',
      skill: 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-200',
    },
  }
  return colors[category][type]
}

</script>

<style scoped>
.skill-relationship-diagram {
  width: 100%;
}

.category-row {
  width: 100%;
}

.category-header {
  min-height: 60px;
  display: flex;
  align-items: center;
}

.skill-node {
  min-height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skill-number {
  flex-shrink: 0;
}

.skill-name {
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
  width: 100%;
}

.arrow-connector {
  min-height: 40px;
}

@media (max-width: 1024px) {
  .skills-in-category {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .skills-in-category {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .skills-in-category {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .skill-node {
    min-height: 100px;
    padding: 12px 8px;
  }

  .skill-name {
    font-size: 12px;
  }
}
</style>
