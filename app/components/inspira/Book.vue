<template>
  <div
    :class="cn(
      'relative z-10 w-min [perspective:900px]',
      props.class
    )"
  >
    <div
      :style="{
        width: BOOK_SIZE_MAP[props.size].width,
        transition: `transform ${props.duration}ms ease`
      }"
      :class="cn(
        'relative aspect-[3/4] [transform-style:preserve-3d]',
        props.isStatic ? '[transform:rotateY(-28deg)]' : '[transform:rotateY(0deg)] hover:[transform:rotateY(-28deg)]',
        BOOK_RADIUS_MAP[props.radius]
      )"
    >
      <div
        :class="cn(
          'absolute inset-0 flex size-full flex-col justify-end overflow-hidden bg-gradient-to-tr p-6 text-white shadow-xl',
          BOOK_RADIUS_MAP[props.radius],
          BOOK_COLOR_MAP[props.color].from,
          BOOK_COLOR_MAP[props.color].to
        )"
        :style="{ transform: 'translateZ(26px)' }"
      >
        <div
          class="absolute left-0 top-0 h-full opacity-30"
          :style="shineStyle"
        />
        <div class="relative z-10 space-y-2">
          <slot />
        </div>
      </div>

      <div
        class="absolute left-0 bg-white/95 dark:bg-slate-900/95"
        :style="{
          top: '4px',
          bottom: '4px',
          width: '44px',
          transform: `translateX(${BOOK_SIZE_MAP[props.size].spineTranslation}) rotateY(90deg)`,
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 100%)'
        }"
      />

      <div
        :class="cn(
          'absolute inset-0 flex size-full flex-col justify-end overflow-hidden bg-gradient-to-tr p-6',
          BOOK_RADIUS_MAP[props.radius],
          BOOK_COLOR_MAP[props.color].from,
          BOOK_COLOR_MAP[props.color].to
        )"
        :style="{
          transform: 'translateZ(-26px)',
          boxShadow: BOOK_SHADOW_SIZE_MAP[props.shadowSize].replace('var(--shadowColor)', 'rgba(0,0,0,0.3)')
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'
import { computed, type HTMLAttributes } from 'vue'
import { BOOK_RADIUS_MAP, BOOK_SIZE_MAP, BOOK_SHADOW_SIZE_MAP, BOOK_COLOR_MAP, type BookColor, type BookSize, type BookRadius, type BookShadowSize } from './index'

interface Props {
  class?: HTMLAttributes['class']
  duration?: number
  color?: BookColor
  isStatic?: boolean
  size?: BookSize
  radius?: BookRadius
  shadowSize?: BookShadowSize
}

const props = withDefaults(defineProps<Props>(), {
  duration: 1000,
  color: 'zinc',
  isStatic: false,
  size: 'md',
  radius: 'md',
  shadowSize: 'lg'
})

const shineStyle = computed(() => ({
  minWidth: '10%',
  background:
    'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.22) 45%, rgba(255,255,255,0))'
}))
</script>

