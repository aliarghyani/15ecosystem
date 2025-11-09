<template>
  <ClientOnly>
    <nav class="fixed inset-x-0 top-0 z-50 pointer-events-auto" data-section-header>
      <div class="mx-auto max-w-6xl px-4 pt-2">
        <div
          class="backdrop-blur-md bg-white/80 dark:bg-slate-900/70 shadow-md rounded-2xl border border-white/30 dark:border-slate-700/50 pointer-events-auto">
          <div class="flex items-center justify-between px-2 py-2">
            <div class="flex items-center gap-3">
              <!-- Home -->
              <div class="flex items-center gap-1.5">
                <UTooltip :text="$t('nav.home')">
                  <UButton class="cursor-pointer" :class="[isActive('home') ? activeClass : inactiveClass]"
                    variant="soft" square icon="i-twemoji-house" :aria-label="$t('nav.home')" @click="goTo('home')" />
                </UTooltip>
                <button type="button" class="hidden lg:inline-flex text-sm font-medium transition-colors"
                  :class="[isActive('home') ? labelActiveClass : labelInactiveClass]" @click="goTo('home')">
                  {{ $t('nav.home') }}
                </button>
              </div>

              <!-- Categories -->
              <div class="flex items-center gap-1.5">
                <UTooltip :text="$t('nav.categories')">
                  <UButton class="cursor-pointer" :class="[isActive('categories') ? activeClass : inactiveClass]"
                    variant="soft" square icon="i-twemoji-hammer-and-wrench" :aria-label="$t('nav.categories')"
                    @click="goTo('categories')" />
                </UTooltip>
                <button type="button" class="hidden lg:inline-flex text-sm font-medium transition-colors"
                  :class="[isActive('categories') ? labelActiveClass : labelInactiveClass]" @click="goTo('categories')">
                  {{ $t('nav.categories') }}
                </button>
              </div>

              <!-- Skills -->
              <div class="flex items-center gap-1.5">
                <UTooltip :text="$t('nav.skills')">
                  <UButton class="cursor-pointer" :class="[isActive('skills') ? activeClass : inactiveClass]"
                    variant="soft" square icon="i-twemoji-briefcase" :aria-label="$t('nav.skills')"
                    @click="goTo('skills')" />
                </UTooltip>
                <button type="button" class="hidden lg:inline-flex text-sm font-medium transition-colors"
                  :class="[isActive('skills') ? labelActiveClass : labelInactiveClass]" @click="goTo('skills')">
                  {{ $t('nav.skills') }}
                </button>
              </div>

              <!-- Books -->
              <div class="flex items-center gap-1.5">
                <UTooltip :text="$t('nav.books')">
                  <UButton class="cursor-pointer" :class="[isActive('books') ? activeClass : inactiveClass]"
                    variant="soft" square icon="i-heroicons-book-open" :aria-label="$t('nav.books')"
                    @click="goTo('books')" />
                </UTooltip>
                <button type="button" class="hidden lg:inline-flex text-sm font-medium transition-colors"
                  :class="[isActive('books') ? labelActiveClass : labelInactiveClass]" @click="goTo('books')">
                  {{ $t('nav.books') }}
                </button>
              </div>

              <!-- Transcript -->
              <div class="flex items-center gap-1.5">
                <UTooltip :text="$t('nav.transcript')">
                  <UButton class="cursor-pointer" :class="[isActive('transcript') ? activeClass : inactiveClass]"
                    variant="soft" square icon="i-heroicons-document-text" :aria-label="$t('nav.transcript')"
                    @click="goTo('transcript')" />
                </UTooltip>
                <button type="button" class="hidden lg:inline-flex text-sm font-medium transition-colors"
                  :class="[isActive('transcript') ? labelActiveClass : labelInactiveClass]" @click="goTo('transcript')">
                  {{ $t('nav.transcript') }}
                </button>
              </div>

              <!-- Summary -->
              <div class="flex items-center gap-1.5">
                <UTooltip :text="$t('nav.summary')">
                  <UButton class="cursor-pointer" :class="[isActive('summary') ? activeClass : inactiveClass]"
                    variant="soft" square icon="i-heroicons-clipboard-document-list" :aria-label="$t('nav.summary')"
                    @click="goTo('summary')" />
                </UTooltip>
                <button type="button" class="hidden lg:inline-flex text-sm font-medium transition-colors"
                  :class="[isActive('summary') ? labelActiveClass : labelInactiveClass]" @click="goTo('summary')">
                  {{ $t('nav.summary') }}
                </button>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeCustomizer />
            </div>
          </div>
        </div>
      </div>
    </nav>
  </ClientOnly>
</template>

<script setup lang="ts">
import ThemeCustomizer from '@/components/common/ThemeCustomizer.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const router = useRouter()
const route = useRoute()
const localePath = useLocalePath()

const activeClass = 'ring-1 ring-primary-400/40 bg-primary-500/15 text-primary-600 dark:text-primary-400 transform scale-105'
const inactiveClass = 'text-gray-500 dark:text-gray-300 hover:text-primary-400'
const labelActiveClass = 'text-primary-700 dark:text-primary-400'
const labelInactiveClass = 'text-gray-600 dark:text-gray-300 hover:text-primary-400'

const currentPath = computed(() => route.path)

const isActive = (id: string) => {
  if (id === 'home') {
    return currentPath.value === localePath('/') || currentPath.value === '/'
  }
  return currentPath.value.includes(id)
}

async function goTo(id: string) {
  const homePath = localePath('/')
  if (id === 'home') {
    if (route.path !== homePath) {
      await router.push(homePath)
    }
  } else {
    const targetPath = localePath(`/${id}`)
    if (route.path !== targetPath) {
      await router.push(targetPath)
    }
  }
}
</script>

