<template>
  <div class="category-diagram" :dir="locale === 'fa' ? 'rtl' : 'ltr'">
    <!-- Diagram Container -->
    <div class="relative w-full space-y-8">
      <!-- Category Row -->
      <div
        v-for="(category, categoryIndex) in categories"
        :key="category.id"
        class="category-row"
      >
        <!-- Category Header -->
        <div
          class="category-header mb-6 p-6 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 shadow-lg"
        >
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 class="text-2xl font-bold text-white mb-2">
                {{ category.name[locale] }}
              </h3>
              <p class="text-base text-primary-100 dark:text-primary-200">
                {{ category.description[locale] }}
              </p>
            </div>
            <div class="text-right">
              <span class="text-3xl font-bold text-white">
                {{ category.skills.length }}
              </span>
              <p class="text-sm text-primary-100 dark:text-primary-200">
                {{ $t('home.skillCount', { count: category.skills.length }) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Skills Grid -->
        <div class="skills-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <NuxtLink
            v-for="skill in getSkillsForCategory(category.id)"
            :key="skill.id"
            :to="localePath(`/skills/${skill.id}`)"
            class="skill-item group relative p-4 rounded-lg bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 transition-all duration-300 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-xl hover:scale-105 cursor-pointer"
          >
            <!-- Skill Number Badge -->
            <div class="flex flex-col items-center text-center gap-2">
              <span
                class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-lg font-bold flex items-center justify-center transition-colors group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50"
              >
                {{ skill.id }}
              </span>
              <span
                class="text-base font-semibold text-gray-800 dark:text-gray-200 transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400 leading-tight"
              >
                {{ skill.name[locale] || skill.name.fa }}
              </span>
            </div>
          </NuxtLink>
        </div>

        <!-- Divider (except for last category) -->
        <div
          v-if="categoryIndex < categories.length - 1"
          class="flex items-center justify-center mt-8 mb-4"
        >
          <div class="flex items-center gap-3">
            <div class="h-px w-16 bg-gradient-to-r from-transparent via-primary-400 to-transparent dark:via-primary-500"></div>
            <div class="w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400"></div>
            <div class="h-px w-16 bg-gradient-to-r from-transparent via-primary-400 to-transparent dark:via-primary-500"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAllCategories } from '~/utils/categories'
import { getSkillsByCategory } from '~/utils/skills'
import type { Category, Skill } from '~/types'

const { locale } = useI18n()
const localePath = useLocalePath()

// Get all categories
const categories = computed<Category[]>(() => {
  return getAllCategories(locale.value as 'fa' | 'en')
})

// Get skills for a specific category
function getSkillsForCategory(categoryId: string): Skill[] {
  return getSkillsByCategory(categoryId as 'health' | 'identity' | 'career', locale.value as 'fa' | 'en')
}
</script>

<style scoped>
.category-diagram {
  width: 100%;
}

.category-header {
  background: linear-gradient(135deg, rgb(59 130 246), rgb(37 99 235));
}

.dark .category-header {
  background: linear-gradient(135deg, rgb(37 99 235), rgb(29 78 216));
}

.skill-item {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 640px) {
  .skills-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .skill-item {
    min-height: 100px;
  }
}

@media (min-width: 1024px) {
  .skills-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}
</style>
