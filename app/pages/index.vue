<template>
  <div class="min-h-screen p-8">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8 flex justify-end">
        <LanguageSwitcher />
      </div>
      
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">
          {{ $t('home.title') }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          {{ $t('home.subtitle') }}
        </p>
        <p class="mt-4 text-gray-500">
          {{ $t('home.description') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Health</h2>
          </template>
          <p>Skills 1-6: Quality Sleep, Focus, Dopamine Control, Stress Control, Mental Health, Healthy Longevity</p>
        </UCard>
        
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Identity</h2>
          </template>
          <p>Skills 7-12: Creativity, Specific Knowledge, Learning, English, Personal Brand, Authentic Self</p>
        </UCard>
        
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Career</h2>
          </template>
          <p>Skills 13-15: Content Creation, AI Literacy, Agency</p>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '15ecosystem - 15 Essential Skills for 2025',
})
</script>

