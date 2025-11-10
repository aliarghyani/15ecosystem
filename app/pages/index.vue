<template>
  <div class="max-w-7xl mx-auto pt-24 px-4 pb-16">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
        {{ $t('home.title') }}
      </h1>
      <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-6 font-medium">
        {{ $t('home.subtitle') }}
      </p>
      <p class="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mb-8">
        {{ $t('home.description') }}
      </p>
      <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
        {{ $t('home.introduction') }}
      </p>
    </div>

    <!-- Skills Overview -->
    <div class="mb-16">
      <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
        {{ $t('home.skillsOverview') }}
      </h2>
      
      <!-- Skill Relationship Diagram -->
      <div class="mb-12">
        <SkillRelationshipDiagram />
      </div>
    </div>

    <!-- Navigation Section -->
    <div class="text-center space-y-4">
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <UButton
          :to="localePath('/categories')"
          size="lg"
          color="primary"
          variant="solid"
          icon="i-twemoji-grid"
          class="min-h-[44px] w-full sm:w-auto"
        >
          {{ $t('home.exploreCategories') }}
        </UButton>
        <UButton
          :to="localePath('/skills')"
          size="lg"
          color="primary"
          variant="outline"
          icon="i-twemoji-graduation-cap"
          class="min-h-[44px] w-full sm:w-auto"
        >
          {{ $t('home.viewAllSkills') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkillRelationshipDiagram from '~/components/diagrams/SkillRelationshipDiagram.vue'

const { locale } = useI18n()
const localePath = useLocalePath()

useHead({
  title: '15ecosystem - 15 Essential Skills for 2025',
  meta: [
    {
      name: 'description',
      content: 'Learn the 15 essential skills for 2025 organized into Health, Identity, and Career categories. Bilingual platform in Persian and English.',
    },
  ],
})
</script>

