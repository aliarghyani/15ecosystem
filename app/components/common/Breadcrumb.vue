<template>
  <UBreadcrumb
    v-if="items && items.length > 0"
    :items="breadcrumbItems"
    class="mb-8"
  />
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
  icon?: string
}

interface Props {
  items?: BreadcrumbItem[]
}

const props = withDefaults(defineProps<Props>(), {
  items: () => []
})

const localePath = useLocalePath()

// Convert items to Nuxt UI Breadcrumb format
const breadcrumbItems = computed(() => {
  if (!props.items || props.items.length === 0) {
    return []
  }
  
  return props.items.map((item, index) => {
    const isLast = index === props.items.length - 1
    
    const link: {
      label: string
      to?: string
      icon?: string
    } = {
      label: item.label
    }
    
    // Only add 'to' for non-last items
    if (!isLast && item.to) {
      link.to = localePath(item.to)
    }
    
    if (item.icon) {
      link.icon = item.icon
    }
    
    return link
  })
})
</script>

