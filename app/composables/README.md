# Composables

Reusable composables for data management and business logic.

## Planned Composables

- **useSkills.ts** - Skill data and operations
- **useCategories.ts** - Category data and operations
- **useI18n.ts** - i18n helpers (if needed beyond Nuxt's useI18n)
- **useContent.ts** - Content parsing and formatting

## Usage

All composables in this directory are auto-imported by Nuxt 4. Use them directly:

```vue
<script setup lang="ts">
const { skills, getSkillById } = useSkills()
</script>
```

