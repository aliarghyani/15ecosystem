export type ClassValue = string | number | null | undefined | boolean | ClassValue[] | Record<string, boolean | string | number | null | undefined | boolean>

function normalize(value: ClassValue, accumulator: string[]): void {
  if (!value) {
    return
  }

  if (Array.isArray(value)) {
    value.forEach(entry => normalize(entry, accumulator))
    return
  }

  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, condition]) => {
      if (condition) {
        accumulator.push(key)
      }
    })
    return
  }

  accumulator.push(String(value))
}

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = []
  inputs.forEach(value => normalize(value, classes))
  return classes.join(' ')
}

