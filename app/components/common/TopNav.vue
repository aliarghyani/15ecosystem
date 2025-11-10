<template>
  <ClientOnly>
    <nav class="fixed inset-x-0 top-0 z-50 pointer-events-auto" data-section-header>
      <div class="mx-auto max-w-6xl px-4 pt-2">
        <div
          class="backdrop-blur-md bg-white/80 dark:bg-slate-900/70 shadow-md rounded-2xl border border-white/30 dark:border-slate-700/50 pointer-events-auto">
          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center justify-between px-2 py-2">
            <div class="flex items-center gap-3">
              <!-- Home -->
              <div class="flex items-center gap-1.5">
                <UTooltip :text="$t('nav.home')">
                  <UButton class="cursor-pointer" :class="[isActive('home') ? activeClass : inactiveClass]"
                    variant="soft" square icon="i-twemoji-house" :aria-label="$t('nav.home')" @click="goTo('home')" />
                </UTooltip>
                <button type="button" class="text-sm font-medium transition-colors"
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
                <button type="button" class="text-sm font-medium transition-colors"
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
                <button type="button" class="text-sm font-medium transition-colors"
                  :class="[isActive('skills') ? labelActiveClass : labelInactiveClass]" @click="goTo('skills')">
                  {{ $t('nav.skills') }}
                </button>
              </div>

              <!-- Books -->
              <div class="flex items-center gap-1.5">
                <UTooltip :text="$t('nav.books')">
                  <UButton class="cursor-pointer" :class="[isActive('books') ? activeClass : inactiveClass]"
                    variant="soft" square icon="i-twemoji-open-book" :aria-label="$t('nav.books')"
                    @click="goTo('books')" />
                </UTooltip>
                <button type="button" class="text-sm font-medium transition-colors"
                  :class="[isActive('books') ? labelActiveClass : labelInactiveClass]" @click="goTo('books')">
                  {{ $t('nav.books') }}
                </button>
              </div>

              <!-- Videos -->
              <div class="flex items-center gap-1.5">
                <UTooltip :text="$t('nav.videos')">
                  <UButton class="cursor-pointer" :class="[isActive('videos') ? activeClass : inactiveClass]"
                    variant="soft" square icon="i-twemoji-video-camera" :aria-label="$t('nav.videos')"
                    @click="goTo('videos')" />
                </UTooltip>
                <button type="button" class="text-sm font-medium transition-colors"
                  :class="[isActive('videos') ? labelActiveClass : labelInactiveClass]" @click="goTo('videos')">
                  {{ $t('nav.videos') }}
                </button>
              </div>

              <!-- Playlists -->
              <div class="flex items-center gap-1.5">
                <UTooltip :text="$t('nav.playlists')">
                  <UButton class="cursor-pointer" :class="[isActive('playlists') ? activeClass : inactiveClass]"
                    variant="soft" square icon="i-twemoji-video-camera" :aria-label="$t('nav.playlists')"
                    @click="goTo('playlists')" />
                </UTooltip>
                <button type="button" class="text-sm font-medium transition-colors"
                  :class="[isActive('playlists') ? labelActiveClass : labelInactiveClass]" @click="goTo('playlists')">
                  {{ $t('nav.playlists') }}
                </button>
              </div>

              <!-- Writers -->
              <div class="flex items-center gap-1.5">
                <UTooltip :text="$t('nav.writers')">
                  <UButton class="cursor-pointer" :class="[isActive('writers') ? activeClass : inactiveClass]"
                    variant="soft" square icon="i-twemoji-busts-in-silhouette" :aria-label="$t('nav.writers')"
                    @click="goTo('writers')" />
                </UTooltip>
                <button type="button" class="text-sm font-medium transition-colors"
                  :class="[isActive('writers') ? labelActiveClass : labelInactiveClass]" @click="goTo('writers')">
                  {{ $t('nav.writers') }}
                </button>
              </div>

              <!-- Transcript -->
              <div class="flex items-center gap-1.5">
                <UTooltip :text="$t('nav.transcript')">
                  <UButton class="cursor-pointer" :class="[isActive('transcript') ? activeClass : inactiveClass]"
                    variant="soft" square icon="i-twemoji-scroll" :aria-label="$t('nav.transcript')"
                    @click="goTo('transcript')" />
                </UTooltip>
                <button type="button" class="text-sm font-medium transition-colors"
                  :class="[isActive('transcript') ? labelActiveClass : labelInactiveClass]" @click="goTo('transcript')">
                  {{ $t('nav.transcript') }}
                </button>
              </div>

              <!-- Summary -->
              <div class="flex items-center gap-1.5">
                <UTooltip :text="$t('nav.summary')">
                  <UButton class="cursor-pointer" :class="[isActive('summary') ? activeClass : inactiveClass]"
                    variant="soft" square icon="i-twemoji-clipboard" :aria-label="$t('nav.summary')"
                    @click="goTo('summary')" />
                </UTooltip>
                <button type="button" class="text-sm font-medium transition-colors"
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

          <!-- Mobile Navigation -->
          <div class="lg:hidden flex items-center justify-between px-2 py-2">
            <div class="flex items-center gap-2">
              <!-- Hamburger Menu Button -->
              <UButton
                :icon="isMobileMenuOpen ? 'i-twemoji-cross-mark' : 'i-twemoji-hamburger'"
                variant="soft"
                square
                :aria-label="isMobileMenuOpen ? $t('nav.closeMenu') : $t('nav.openMenu')"
                @click="toggleMobileMenu"
              />
              <!-- Logo/Title (optional) -->
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ $t('nav.home') }}</span>
            </div>

            <div class="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeCustomizer />
            </div>
          </div>

          <!-- Mobile Menu Dropdown -->
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div v-if="isMobileMenuOpen" class="lg:hidden border-t border-gray-200 dark:border-slate-700 mt-2 pt-2 pb-2">
              <div class="flex flex-col gap-1 px-2">
                <UButton
                  :class="[isActive('home') ? activeClass : inactiveClass]"
                  variant="soft"
                  block
                  :icon="'i-twemoji-house'"
                  @click="goTo('home'); closeMobileMenu()"
                >
                  {{ $t('nav.home') }}
                </UButton>
                <UButton
                  :class="[isActive('categories') ? activeClass : inactiveClass]"
                  variant="soft"
                  block
                  :icon="'i-twemoji-hammer-and-wrench'"
                  @click="goTo('categories'); closeMobileMenu()"
                >
                  {{ $t('nav.categories') }}
                </UButton>
                <UButton
                  :class="[isActive('skills') ? activeClass : inactiveClass]"
                  variant="soft"
                  block
                  :icon="'i-twemoji-briefcase'"
                  @click="goTo('skills'); closeMobileMenu()"
                >
                  {{ $t('nav.skills') }}
                </UButton>
                <UButton
                  :class="[isActive('books') ? activeClass : inactiveClass]"
                  variant="soft"
                  block
                  :icon="'i-twemoji-open-book'"
                  @click="goTo('books'); closeMobileMenu()"
                >
                  {{ $t('nav.books') }}
                </UButton>
                <UButton
                  :class="[isActive('videos') ? activeClass : inactiveClass]"
                  variant="soft"
                  block
                  :icon="'i-twemoji-video-camera'"
                  @click="goTo('videos'); closeMobileMenu()"
                >
                  {{ $t('nav.videos') }}
                </UButton>
                <UButton
                  :class="[isActive('playlists') ? activeClass : inactiveClass]"
                  variant="soft"
                  block
                  :icon="'i-twemoji-video-camera'"
                  @click="goTo('playlists'); closeMobileMenu()"
                >
                  {{ $t('nav.playlists') }}
                </UButton>
                <UButton
                  :class="[isActive('writers') ? activeClass : inactiveClass]"
                  variant="soft"
                  block
                  :icon="'i-twemoji-busts-in-silhouette'"
                  @click="goTo('writers'); closeMobileMenu()"
                >
                  {{ $t('nav.writers') }}
                </UButton>
                <UButton
                  :class="[isActive('transcript') ? activeClass : inactiveClass]"
                  variant="soft"
                  block
                  :icon="'i-twemoji-scroll'"
                  @click="goTo('transcript'); closeMobileMenu()"
                >
                  {{ $t('nav.transcript') }}
                </UButton>
                <UButton
                  :class="[isActive('summary') ? activeClass : inactiveClass]"
                  variant="soft"
                  block
                  :icon="'i-twemoji-clipboard'"
                  @click="goTo('summary'); closeMobileMenu()"
                >
                  {{ $t('nav.summary') }}
                </UButton>
              </div>
            </div>
          </Transition>
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
const isMobileMenuOpen = ref(false)

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

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

// Close mobile menu when route changes
watch(() => route.path, () => {
  closeMobileMenu()
})

// Close mobile menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (isMobileMenuOpen.value && !target.closest('nav')) {
      closeMobileMenu()
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

