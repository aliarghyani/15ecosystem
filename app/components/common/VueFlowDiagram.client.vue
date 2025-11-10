<template>
  <div class="vue-flow-diagram-container">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :fit-view-on-init="true"
      :min-zoom="0.1"
      :max-zoom="2"
      class="vue-flow-diagram"
    >
      <Background />
      <Controls />
      <MiniMap />
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

interface Props {
  nodes: Node[]
  edges: Edge[]
}

const props = defineProps<Props>()
</script>

<style scoped>
.vue-flow-diagram-container {
  width: 100%;
  height: 600px;
  min-height: 500px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: white;
}

.dark .vue-flow-diagram-container {
  background: rgb(15 23 42); /* slate-900 */
}

.vue-flow-diagram {
  width: 100%;
  height: 100%;
}
</style>

