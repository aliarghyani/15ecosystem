<template>
  <div :class="cn('text-sm font-medium opacity-80', props.class)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'
import type { HTMLAttributes } from 'vue'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

