<template>
  <div class="max-w-7xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <nav class="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <NuxtLink :to="localePath('/')" class="hover:text-primary-600 dark:hover:text-primary-400">
        {{ $t('breadcrumb.home') }}
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-800 dark:text-gray-200 font-medium">
        {{ $t('breadcrumb.skills') }}
      </span>
    </nav>

    <!-- Page Header -->
    <div class="mb-12 text-center">
      <h1 class="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
        {{ $t('skills.allSkills') || 'All Skills' }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        {{ $t('skills.allSkillsDescription') || 'Explore all 15 essential skills for 2025' }}
      </p>
    </div>

    <!-- Skills by Category -->
    <div class="space-y-12">
      <!-- Health Category -->
      <div>
        <div class="mb-6">
          <NuxtLink
            :to="localePath('/categories/health')"
            class="inline-block group"
          >
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ getCategoryName('health') }}
            </h2>
          </NuxtLink>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            {{ getCategoryDescription('health') }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-stretch">
          <SkillCard
            v-for="skill in healthSkills"
            :key="skill.id"
            :skill="skill"
            :show-description="true"
            :show-footer="true"
          />
        </div>
      </div>

      <!-- Identity Category -->
      <div>
        <div class="mb-6">
          <NuxtLink
            :to="localePath('/categories/identity')"
            class="inline-block group"
          >
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ getCategoryName('identity') }}
            </h2>
          </NuxtLink>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            {{ getCategoryDescription('identity') }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-stretch">
          <SkillCard
            v-for="skill in identitySkills"
            :key="skill.id"
            :skill="skill"
            :show-description="true"
            :show-footer="true"
          />
        </div>
      </div>

      <!-- Career Category -->
      <div>
        <div class="mb-6">
          <NuxtLink
            :to="localePath('/categories/career')"
            class="inline-block group"
          >
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ getCategoryName('career') }}
            </h2>
          </NuxtLink>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            {{ getCategoryDescription('career') }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-stretch">
          <SkillCard
            v-for="skill in careerSkills"
            :key="skill.id"
            :skill="skill"
            :show-description="true"
            :show-footer="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAllSkills } from '~/utils/skills'
import { getAllCategories, getCategoryById } from '~/utils/categories'
import SkillCard from '~/components/skills/SkillCard.vue'
import type { Skill, Category } from '~/types'

const { locale } = useI18n()
const localePath = useLocalePath()

// Get all skills
const allSkills = computed<Skill[]>(() => {
  return getAllSkills(locale.value as 'fa' | 'en')
})

// Get skills by category
const healthSkills = computed<Skill[]>(() => {
  return allSkills.value.filter((s) => s.category === 'health').sort((a, b) => a.id - b.id)
})

const identitySkills = computed<Skill[]>(() => {
  return allSkills.value.filter((s) => s.category === 'identity').sort((a, b) => a.id - b.id)
})

const careerSkills = computed<Skill[]>(() => {
  return allSkills.value.filter((s) => s.category === 'career').sort((a, b) => a.id - b.id)
})

// Get all categories
const allCategories = computed<Category[]>(() => {
  return getAllCategories(locale.value as 'fa' | 'en')
})

// Get category name
function getCategoryName(categoryId: 'health' | 'identity' | 'career'): string {
  const category = getCategoryById(categoryId, locale.value as 'fa' | 'en')
  return category?.name[locale.value] || category?.name.fa || categoryId
}

// Get category description
function getCategoryDescription(categoryId: 'health' | 'identity' | 'career'): string {
  const category = getCategoryById(categoryId, locale.value as 'fa' | 'en')
  return category?.description[locale.value] || category?.description.fa || ''
}

useHead({
  title: computed(() => {
    return `${useI18n().t('skills.allSkills') || 'All Skills'} - 15ecosystem`
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        return useI18n().t('skills.allSkillsDescription') || 'Explore all 15 essential skills for 2025'
      }),
    },
  ],
})
</script>

