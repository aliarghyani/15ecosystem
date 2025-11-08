export default defineAppConfig({
  ui: {
    strategy: 'merge',
    primary: 'purple',
    gray: 'slate',
    colors: {
      primary: 'purple',
    },
    icons: {
      dynamic: true,
    },
    tooltip: {
      // removes fixed height and truncate
      base: 'h-auto overflow-visible text-overflow-clip whitespace-normal',
      popper: { placement: 'top' },
    },
  } as any,
})

