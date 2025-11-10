<template>
  <div class="vue-flow-diagram-container">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :fit-view-on-init="true"
      :min-zoom="0.2"
      :max-zoom="2"
      :default-viewport="{ zoom: 0.8 }"
      class="vue-flow-diagram"
    >
      <Background :pattern-color="patternColor" :gap="20" />
      <Controls />
      <MiniMap 
        :node-stroke-color="minimapNodeColor"
        :node-color="minimapNodeColor"
        :mask-color="minimapMaskColor"
        class="vue-flow-minimap"
      />
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
import type { Node, Edge } from '@vue-flow/core'
import { useColorMode } from '#imports'

interface Props {
  nodes: Node[]
  edges: Edge[]
}

const props = defineProps<Props>()
const colorMode = useColorMode()

// Dynamic colors based on theme
const patternColor = computed(() => colorMode.value === 'dark' ? '#475569' : '#cbd5e1')
const minimapNodeColor = computed(() => colorMode.value === 'dark' ? '#64748b' : '#94a3b8')
const minimapMaskColor = computed(() => colorMode.value === 'dark' ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.6)')
</script>

<style scoped>
.vue-flow-diagram-container {
  width: 100%;
  height: 700px;
  min-height: 600px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: white;
}

/* Mobile responsive height */
@media (max-width: 768px) {
  .vue-flow-diagram-container {
    height: 500px;
    min-height: 400px;
  }
}

@media (max-width: 640px) {
  .vue-flow-diagram-container {
    height: 450px;
    min-height: 350px;
  }
}

.dark .vue-flow-diagram-container {
  background: rgb(15 23 42); /* slate-900 */
}

.vue-flow-diagram {
  width: 100%;
  height: 100%;
}

/* Improve node text readability */
:deep(.vue-flow__node) {
  font-family: inherit;
  line-height: 1.4;
}

:deep(.vue-flow__edge-label) {
  font-size: 13px !important;
  font-weight: 700 !important;
}

@media (max-width: 640px) {
  :deep(.vue-flow__edge-label) {
    font-size: 11px !important;
  }
}

/* Minimap styling - make it more visible */
:deep(.vue-flow__minimap) {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Hide minimap on very small screens */
@media (max-width: 640px) {
  :deep(.vue-flow__minimap) {
    display: none;
  }
}

.dark :deep(.vue-flow__minimap) {
  background: rgba(15, 23, 42, 0.9);
  border-color: #475569;
}

/* Ensure controls are touch-friendly on mobile */
:deep(.vue-flow__controls) {
  touch-action: none;
}

:deep(.vue-flow__controls-button) {
  min-width: 44px;
  min-height: 44px;
}
</style>

