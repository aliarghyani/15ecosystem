/**
 * Utility functions for accessing and querying skill data
 */

import type { Skill } from '~/types'
import { skills as skillsFa } from '~/data/fa/skills'
import { skills as skillsEn } from '~/data/en/skills'

/**
 * Get a skill by its ID
 * @param id - Skill ID (1-15)
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Skill object or undefined if not found
 */
export function getSkillById(id: number, locale: 'fa' | 'en' = 'fa'): Skill | undefined {
  const skills = locale === 'fa' ? skillsFa : skillsEn
  return skills.find((skill) => skill.id === id)
}

/**
 * Get all skills
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of all skills
 */
export function getAllSkills(locale: 'fa' | 'en' = 'fa'): Skill[] {
  return locale === 'fa' ? skillsFa : skillsEn
}

/**
 * Get skills by category
 * @param category - Category ID ('health' | 'identity' | 'career')
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of skills in the specified category
 */
export function getSkillsByCategory(
  category: 'health' | 'identity' | 'career',
  locale: 'fa' | 'en' = 'fa'
): Skill[] {
  const skills = locale === 'fa' ? skillsFa : skillsEn
  return skills.filter((skill) => skill.category === category)
}

/**
 * Get related skills for a given skill ID
 * @param skillId - Skill ID (1-15)
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of related skills, or empty array if none found
 */
export function getRelatedSkills(skillId: number, locale: 'fa' | 'en' = 'fa'): Skill[] {
  const skill = getSkillById(skillId, locale)
  if (!skill || !skill.relatedSkills || skill.relatedSkills.length === 0) {
    return []
  }

  const skills = locale === 'fa' ? skillsFa : skillsEn
  return skill.relatedSkills
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is Skill => s !== undefined)
}

/**
 * Get skills by IDs
 * @param ids - Array of skill IDs
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of skills matching the provided IDs
 */
export function getSkillsByIds(ids: number[], locale: 'fa' | 'en' = 'fa'): Skill[] {
  const skills = locale === 'fa' ? skillsFa : skillsEn
  return ids
    .map((id) => skills.find((skill) => skill.id === id))
    .filter((skill): skill is Skill => skill !== undefined)
}

/**
 * Get next skill in sequence (by ID)
 * @param skillId - Current skill ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Next skill or undefined if current skill is the last one
 */
export function getNextSkill(skillId: number, locale: 'fa' | 'en' = 'fa'): Skill | undefined {
  if (skillId >= 15) {
    return undefined
  }
  return getSkillById(skillId + 1, locale)
}

/**
 * Get previous skill in sequence (by ID)
 * @param skillId - Current skill ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Previous skill or undefined if current skill is the first one
 */
export function getPreviousSkill(skillId: number, locale: 'fa' | 'en' = 'fa'): Skill | undefined {
  if (skillId <= 1) {
    return undefined
  }
  return getSkillById(skillId - 1, locale)
}

