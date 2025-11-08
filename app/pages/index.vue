<template>
  <div class="max-w-6xl mx-auto pt-24 px-4">
    <div class="text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-bold mb-4 primary-text">
        {{ $t('home.title') }}
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">
        {{ $t('home.subtitle') }}
      </p>
      <p class="text-gray-500 dark:text-gray-400">
        {{ $t('home.description') }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard class="hover-minimal dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm">
        <template #header>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Health</h2>
        </template>
        <p class="text-gray-600 dark:text-gray-300">Skills 1-6: Quality Sleep, Focus, Dopamine Control, Stress Control, Mental Health, Healthy Longevity</p>
      </UCard>
      
      <UCard class="hover-minimal dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm">
        <template #header>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Identity</h2>
        </template>
        <p class="text-gray-600 dark:text-gray-300">Skills 7-12: Creativity, Specific Knowledge, Learning, English, Personal Brand, Authentic Self</p>
      </UCard>
      
      <UCard class="hover-minimal dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm">
        <template #header>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Career</h2>
        </template>
        <p class="text-gray-600 dark:text-gray-300">Skills 13-15: Content Creation, AI Literacy, Agency</p>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '15ecosystem - 15 Essential Skills for 2025',
})
</script>

