<template>
  <div ref="containerEl" :class="['mermaid-container', props.class]" tabindex="0">
    <!-- Zoom/Pan Controls -->
    <div class="mermaid-controls">
      <UButton
        icon="i-heroicons-plus"
        size="xs"
        color="gray"
        variant="soft"
        square
        @click="zoomIn"
        aria-label="Zoom In"
      />
      <UButton
        icon="i-heroicons-minus"
        size="xs"
        color="gray"
        variant="soft"
        square
        @click="zoomOut"
        aria-label="Zoom Out"
      />
      <UButton
        icon="i-heroicons-arrow-path"
        size="xs"
        color="gray"
        variant="soft"
        square
        @click="resetView"
        aria-label="Reset View"
      />
    </div>

    <!-- Diagram Wrapper with Pan/Zoom -->
    <div ref="wrapperEl" class="mermaid-wrapper" @wheel.prevent="handleWheel">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div ref="svgContainerEl" v-html="svgHtml" />
    </div>
  </div>
</template>

<script setup lang="ts">
import mermaid from 'mermaid'
import { onMounted, ref, watch, nextTick, onUnmounted } from 'vue'
import { useColorMode } from '#imports'
import Panzoom from '@panzoom/panzoom'
import type { PanzoomOptions, PanzoomObject } from '@panzoom/panzoom'

const props = withDefaults(defineProps<{
  /** Mermaid graph definition */
  definition: string
  /** Optional: 'default' | 'dark' | 'forest' | ... */
  theme?: string
  /** Optional: container classes */
  class?: string
  /** Enable zoom/pan controls */
  interactive?: boolean
}>(), {
  theme: undefined,
  class: '',
  interactive: true,
})

const svgHtml = ref<string>('')
const containerEl = ref<HTMLElement | null>(null)
const wrapperEl = ref<HTMLElement | null>(null)
const svgContainerEl = ref<HTMLElement | null>(null)
const colorMode = useColorMode()
let panzoomInstance: PanzoomObject | null = null

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
        useMaxWidth: false, // Allow diagrams to use full available width
        padding: 20,
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

    // Initialize panzoom after SVG is rendered
    if (props.interactive && wrapperEl.value) {
      await nextTick()
      initPanzoom()
      // Auto-fit diagram to viewport on initial load
      autoFitToViewport()
    }
  } catch (error) {
    console.error('Mermaid rendering error:', error)
    svgHtml.value = `<div class="text-red-500 p-4">Error rendering diagram: ${error instanceof Error ? error.message : 'Unknown error'}</div>`
  }
}

function initPanzoom() {
  if (!wrapperEl.value || panzoomInstance) return

  const svgElement = wrapperEl.value.querySelector('svg')
  if (!svgElement) return

  const options: PanzoomOptions = {
    maxScale: 5, // Increased max zoom for better detail viewing
    minScale: 0.3, // Allow zooming out more to see full diagram
    step: 0.15, // Larger steps for faster zoom
    animate: true,
    contain: 'outside', // Allow panning outside bounds
    cursor: 'grab',
    disablePan: false,
    disableZoom: false,
  }

  panzoomInstance = Panzoom(svgElement, options)

  // Change cursor on drag
  svgElement.addEventListener('panzoomstart', () => {
    if (svgElement) svgElement.style.cursor = 'grabbing'
  })
  svgElement.addEventListener('panzoomend', () => {
    if (svgElement) svgElement.style.cursor = 'grab'
  })

  // Add arrow key navigation
  if (containerEl.value) {
    containerEl.value.addEventListener('keydown', handleKeyDown)
    containerEl.value.setAttribute('tabindex', '0') // Make focusable for keyboard events
  }
}

function autoFitToViewport(retries = 3) {
  if (!panzoomInstance || !wrapperEl.value || retries === 0) return

  const svgElement = wrapperEl.value.querySelector('svg')
  if (!svgElement) {
    // Retry if SVG not ready
    setTimeout(() => autoFitToViewport(retries - 1), 100)
    return
  }

  // Wait a bit for SVG to fully render
  setTimeout(() => {
    if (!panzoomInstance || !wrapperEl.value) return

    try {
      // Get SVG dimensions
      const svgBox = svgElement.getBBox()
      const svgWidth = svgBox.width || svgElement.clientWidth
      const svgHeight = svgBox.height || svgElement.clientHeight

      // Get container dimensions
      const containerWidth = wrapperEl.value.clientWidth - 32 // Account for padding
      const containerHeight = Math.min(wrapperEl.value.clientHeight - 32, 800) // Max height

      if (svgWidth === 0 || svgHeight === 0) {
        // Retry if dimensions not ready
        if (retries > 0) {
          setTimeout(() => autoFitToViewport(retries - 1), 100)
        }
        return
      }

      // Calculate scale to fit
      const scaleX = containerWidth / svgWidth
      const scaleY = containerHeight / svgHeight
      const scale = Math.min(scaleX, scaleY, 1) * 0.9 // 90% to add some padding

      // Center the diagram
      const centerX = containerWidth / 2
      const centerY = containerHeight / 2
      const svgCenterX = svgBox.x + svgWidth / 2
      const svgCenterY = svgBox.y + svgHeight / 2

      // Reset and set initial view
      if (panzoomInstance) {
        panzoomInstance.reset()
        panzoomInstance.zoom(scale, { animate: false })
        panzoomInstance.pan(
          centerX - svgCenterX * scale,
          centerY - svgCenterY * scale,
          { animate: false }
        )
      }
    } catch (error) {
      console.warn('Auto-fit failed, retrying...', error)
      if (retries > 0) {
        setTimeout(() => autoFitToViewport(retries - 1), 100)
      }
    }
  }, 150) // Small delay to ensure SVG is fully rendered
}

function handleKeyDown(event: KeyboardEvent) {
  if (!panzoomInstance || !props.interactive) return

  const panStep = 50 // Pixels to pan per arrow key press

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      if (panzoomInstance) {
        const { x, y } = panzoomInstance.getPan()
        panzoomInstance.pan(x + panStep, y, { animate: true })
      }
      break
    case 'ArrowRight':
      event.preventDefault()
      if (panzoomInstance) {
        const { x, y } = panzoomInstance.getPan()
        panzoomInstance.pan(x - panStep, y, { animate: true })
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (panzoomInstance) {
        const { x, y } = panzoomInstance.getPan()
        panzoomInstance.pan(x, y + panStep, { animate: true })
      }
      break
    case 'ArrowDown':
      event.preventDefault()
      if (panzoomInstance) {
        const { x, y } = panzoomInstance.getPan()
        panzoomInstance.pan(x, y - panStep, { animate: true })
      }
      break
  }
}

function zoomIn() {
  if (panzoomInstance) {
    panzoomInstance.zoomIn()
  }
}

function zoomOut() {
  if (panzoomInstance) {
    panzoomInstance.zoomOut()
  }
}

function resetView() {
  if (panzoomInstance) {
    panzoomInstance.reset()
  }
}

function handleWheel(event: WheelEvent) {
  if (!panzoomInstance || !props.interactive) return
  event.preventDefault()
  const delta = event.deltaY > 0 ? -0.1 : 0.1
  panzoomInstance.zoomWithWheel(event, { step: delta })
}

onMounted(() => {
  render()
})

onUnmounted(() => {
  if (panzoomInstance) {
    panzoomInstance.destroy()
    panzoomInstance = null
  }
  // Remove keyboard event listener
  if (containerEl.value) {
    containerEl.value.removeEventListener('keydown', handleKeyDown)
  }
})

// Re-render on theme change or definition change
watch(() => colorMode.value, () => {
  if (panzoomInstance) {
    panzoomInstance.destroy()
    panzoomInstance = null
  }
  render()
})
watch(() => props.definition, () => {
  if (panzoomInstance) {
    panzoomInstance.destroy()
    panzoomInstance = null
  }
  render()
})
</script>

<style scoped>
.mermaid-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 0.5rem;
  background: white;
  min-height: 500px; /* Increased minimum height for better visibility */
  outline: none; /* Remove focus outline, but keep keyboard functionality */
}

.mermaid-container:focus {
  outline: 2px solid rgb(59 130 246); /* Primary color focus indicator */
  outline-offset: 2px;
}

.dark .mermaid-container {
  background: rgb(15 23 42); /* slate-900 */
}

.mermaid-wrapper {
  width: 100%;
  height: 100%;
  min-height: 500px; /* Match container min-height */
  max-height: 800px; /* Limit max height to ensure visibility */
  overflow: hidden;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center; /* Center initially, then user can pan */
  padding: 1rem;
}

.mermaid-wrapper:active {
  cursor: grabbing;
}

.mermaid-wrapper :deep(svg) {
  width: auto;
  min-width: 100%;
  height: auto;
  display: block;
  max-width: none; /* Remove max-width constraint */
}

.mermaid-wrapper :deep(.node-label) {
  font-family: var(--font-sans);
}

.mermaid-controls {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.dark .mermaid-controls {
  background: rgba(15, 23, 42, 0.9);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3);
}

/* Enhanced styling for better readability */
.mermaid-wrapper :deep(.node rect),
.mermaid-wrapper :deep(.node circle),
.mermaid-wrapper :deep(.node polygon) {
  stroke-width: 2px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.dark .mermaid-wrapper :deep(.node rect),
.dark .mermaid-wrapper :deep(.node circle),
.dark .mermaid-wrapper :deep(.node polygon) {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.mermaid-wrapper :deep(.edgePath .path) {
  stroke-width: 2px;
}

.mermaid-wrapper :deep(.cluster rect) {
  fill-opacity: 0.1;
  stroke-width: 2px;
}

/* Improve text readability - larger fonts for better visibility */
.mermaid-wrapper :deep(text) {
  font-weight: 500;
  font-size: 16px; /* Increased from 14px */
}

.mermaid-wrapper :deep(.nodeLabel) {
  font-weight: 600;
  font-size: 16px; /* Ensure node labels are readable */
}

/* Make nodes larger for better visibility */
.mermaid-wrapper :deep(.node) {
  font-size: 16px;
}

/* Ensure subgraphs are more visible */
.mermaid-wrapper :deep(.cluster-label) {
  font-size: 18px;
  font-weight: 700;
}

/* Better spacing for readability */
.mermaid-wrapper :deep(.node rect),
.mermaid-wrapper :deep(.node circle) {
  min-width: 120px; /* Ensure nodes have minimum width */
  min-height: 60px; /* Ensure nodes have minimum height */
}
</style>

