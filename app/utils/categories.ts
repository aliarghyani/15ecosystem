/**
 * Utility functions for accessing and querying category data
 */

import type { Category } from '~/types'
import { categories as categoriesFa } from '~/data/fa/categories'
import { categories as categoriesEn } from '~/data/en/categories'

/**
 * Get all categories
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of all categories
 */
export function getAllCategories(locale: 'fa' | 'en' = 'fa'): Category[] {
  return locale === 'fa' ? categoriesFa : categoriesEn
}

/**
 * Get a category by its ID
 * @param id - Category ID ('health' | 'identity' | 'career')
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Category object or undefined if not found
 */
export function getCategoryById(
  id: 'health' | 'identity' | 'career',
  locale: 'fa' | 'en' = 'fa'
): Category | undefined {
  const categories = locale === 'fa' ? categoriesFa : categoriesEn
  return categories.find((category) => category.id === id)
}

/**
 * Get category slug for routing
 * @param categoryId - Category ID ('health' | 'identity' | 'career')
 * @returns Slug string for routing
 */
export function getCategorySlug(categoryId: 'health' | 'identity' | 'career'): string {
  return categoryId
}

