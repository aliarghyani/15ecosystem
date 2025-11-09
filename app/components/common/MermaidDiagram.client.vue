<template>
  <div ref="el" :class="['mermaid-wrapper', props.class]">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="svgHtml" />
  </div>
</template>

<script setup lang="ts">
import mermaid from 'mermaid'
import { onMounted, ref, watch, nextTick } from 'vue'
import { useColorMode } from '#imports'

const props = withDefaults(defineProps<{
  /** Mermaid graph definition */
  definition: string
  /** Optional: 'default' | 'dark' | 'forest' | ... */
  theme?: string
  /** Optional: container classes */
  class?: string
}>(), {
  theme: undefined,
  class: '',
})

const svgHtml = ref<string>('')
const el = ref<HTMLElement | null>(null)
const colorMode = useColorMode()

function currentTheme() {
  // If prop.theme is set, prefer it; else map color-mode
  if (props.theme) return props.theme
  return colorMode.value === 'dark' ? 'dark' : 'default'
}

async function render() {
  if (!props.definition || !props.definition.trim()) {
    svgHtml.value = ''
    return
  }

  try {
    // Re-init with theme, safe since you're CSR-only (ssr: false)
    mermaid.initialize({
      startOnLoad: false,
      theme: currentTheme(),
      securityLevel: 'loose', // allows styling inside container
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        useMaxWidth: true,
      },
      themeVariables: {
        primaryColor: 'rgb(59 130 246)', // primary-500
        primaryTextColor: '#fff',
        primaryBorderColor: 'rgb(37 99 235)', // primary-700
        lineColor: 'rgb(59 130 246)', // primary-500
        secondaryColor: 'rgb(239 246 255)', // blue-50
        tertiaryColor: 'rgb(219 234 254)', // blue-200
      },
    })

    // Unique key so multiple components don't collide
    const id = `mmd-${Math.random().toString(36).slice(2)}`
    const { svg } = await mermaid.render(id, props.definition)
    svgHtml.value = svg
    await nextTick()
  } catch (error) {
    console.error('Mermaid rendering error:', error)
    svgHtml.value = `<div class="text-red-500 p-4">Error rendering diagram: ${error instanceof Error ? error.message : 'Unknown error'}</div>`
  }
}

onMounted(render)

// Re-render on theme change or definition change
watch(() => colorMode.value, render)
watch(() => props.definition, render)
</script>

<style scoped>
.mermaid-wrapper :deep(svg) {
  width: 100%;
  height: auto;
  max-width: 100%;
}

.mermaid-wrapper :deep(.node-label) {
  font-family: var(--font-sans);
}

/* Dark mode adjustments */
.dark .mermaid-wrapper :deep(svg) {
  background: transparent;
}
</style>

