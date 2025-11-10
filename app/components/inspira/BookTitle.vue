<template>
  <h3 :class="cn('text-lg font-semibold leading-tight', props.class)">
    <slot />
  </h3>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'
import type { HTMLAttributes } from 'vue'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

