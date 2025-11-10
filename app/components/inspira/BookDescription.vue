<template>
  <p :class="cn('text-sm opacity-90 leading-relaxed break-words', props.class)">
    <slot />
  </p>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'
import type { HTMLAttributes } from 'vue'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

