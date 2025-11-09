/**
 * Utility functions for diagram generation and skill relationship scoring
 */

import type { Skill } from '~/types'
import { getAllSkills } from './skills'

/**
 * Calculate foundation score for a skill
 * Foundation Score = (Incoming × 2) + Outgoing
 * Higher incoming connections = more foundational (prerequisite for others)
 */
export function calculateFoundationScore(
  skillId: number,
  allSkills: Skill[],
  locale: 'fa' | 'en' = 'fa'
): number {
  let incoming = 0
  let outgoing = 0

  // Count outgoing connections (skills this skill connects to)
  const skill = allSkills.find((s) => s.id === skillId)
  if (skill?.relatedSkills) {
    outgoing = skill.relatedSkills.length
  }

  // Count incoming connections (skills that connect to this skill)
  allSkills.forEach((s) => {
    if (s.relatedSkills && s.relatedSkills.includes(skillId)) {
      incoming++
    }
  })

  // Foundation Score = (Incoming × 2) + Outgoing
  return incoming * 2 + outgoing
}

/**
 * Get all skills sorted by foundation score (highest first)
 */
export function getSkillsByFoundationScore(
  locale: 'fa' | 'en' = 'fa'
): Array<{ skill: Skill; score: number; incoming: number; outgoing: number }> {
  const allSkills = getAllSkills(locale)
  const scored = allSkills.map((skill) => {
    let incoming = 0
    let outgoing = 0

    // Count outgoing
    if (skill.relatedSkills) {
      outgoing = skill.relatedSkills.length
    }

    // Count incoming
    allSkills.forEach((s) => {
      if (s.relatedSkills && s.relatedSkills.includes(skill.id)) {
        incoming++
      }
    })

    const score = incoming * 2 + outgoing

    return {
      skill,
      score,
      incoming,
      outgoing,
    }
  })

  return scored.sort((a, b) => b.score - a.score)
}

/**
 * Get top foundational skills (top N by score)
 */
export function getTopFoundationalSkills(
  topN: number = 5,
  locale: 'fa' | 'en' = 'fa'
): Array<{ skill: Skill; score: number; incoming: number; outgoing: number }> {
  return getSkillsByFoundationScore(locale).slice(0, topN)
}

/**
 * Generate Mermaid flowchart definition for skill progression
 * Shows Health → Identity → Career flow with foundational skills emphasized
 */
export function generateProgressionFlowchart(
  locale: 'fa' | 'en' = 'fa'
): string {
  const allSkills = getAllSkills(locale)
  const scored = getSkillsByFoundationScore(locale)

  // Group by category
  const healthSkills = allSkills.filter((s) => s.category === 'health').sort((a, b) => a.id - b.id)
  const identitySkills = allSkills.filter((s) => s.category === 'identity').sort((a, b) => a.id - b.id)
  const careerSkills = allSkills.filter((s) => s.category === 'career').sort((a, b) => a.id - b.id)

  // Get top foundational skills for styling
  const topFoundational = getTopFoundationalSkills(5, locale)
  const foundationalIds = new Set(topFoundational.map((s) => s.skill.id))

  // Helper to escape special characters and create safe node IDs
  function escapeText(text: string): string {
    return text.replace(/"/g, '&quot;').replace(/\n/g, ' ')
  }

  function getNodeId(skillId: number, category: string): string {
    const prefix = category === 'health' ? 'H' : category === 'identity' ? 'I' : 'C'
    return `${prefix}${skillId}`
  }

  // Build Mermaid syntax
  let mermaid = 'flowchart TD\n'

  // Health category subgraph
  mermaid += '  subgraph Health["Health - Foundation"]\n'
  healthSkills.forEach((skill) => {
    const score = scored.find((s) => s.skill.id === skill.id)?.score || 0
    const isFoundational = foundationalIds.has(skill.id)
    const nodeId = getNodeId(skill.id, 'health')
    const skillName = escapeText(skill.name[locale] || skill.name.fa)
    const foundationalClass = isFoundational ? ':::foundational' : ''
    mermaid += `    ${nodeId}["${skill.id}. ${skillName}<br/>Score: ${score}"]${foundationalClass}\n`
  })
  mermaid += '  end\n\n'

  // Identity category subgraph
  mermaid += '  subgraph Identity["Identity - Building"]\n'
  identitySkills.forEach((skill) => {
    const score = scored.find((s) => s.skill.id === skill.id)?.score || 0
    const isFoundational = foundationalIds.has(skill.id)
    const nodeId = getNodeId(skill.id, 'identity')
    const skillName = escapeText(skill.name[locale] || skill.name.fa)
    const foundationalClass = isFoundational ? ':::foundational' : ''
    mermaid += `    ${nodeId}["${skill.id}. ${skillName}<br/>Score: ${score}"]${foundationalClass}\n`
  })
  mermaid += '  end\n\n'

  // Career category subgraph
  mermaid += '  subgraph Career["Career - Advanced"]\n'
  careerSkills.forEach((skill) => {
    const score = scored.find((s) => s.skill.id === skill.id)?.score || 0
    const isFoundational = foundationalIds.has(skill.id)
    const nodeId = getNodeId(skill.id, 'career')
    const skillName = escapeText(skill.name[locale] || skill.name.fa)
    const foundationalClass = isFoundational ? ':::foundational' : ''
    mermaid += `    ${nodeId}["${skill.id}. ${skillName}<br/>Score: ${score}"]${foundationalClass}\n`
  })
  mermaid += '  end\n\n'

  // Add connections between categories
  mermaid += '  Health --> Identity\n'
  mermaid += '  Identity --> Career\n\n'

  // Add key cross-category connections (limit to avoid clutter)
  let crossCategoryCount = 0
  const maxCrossCategory = 15
  allSkills.forEach((skill) => {
    if (skill.relatedSkills && skill.relatedSkills.length > 0 && crossCategoryCount < maxCrossCategory) {
      skill.relatedSkills.forEach((relatedId) => {
        if (crossCategoryCount < maxCrossCategory) {
          const relatedSkill = allSkills.find((s) => s.id === relatedId)
          if (relatedSkill && skill.category !== relatedSkill.category) {
            // Cross-category connection
            const sourceId = getNodeId(skill.id, skill.category)
            const targetId = getNodeId(relatedId, relatedSkill.category)
            mermaid += `  ${sourceId} -.-> ${targetId}\n`
            crossCategoryCount++
          }
        }
      })
    }
  })

  // Add foundational class styling
  mermaid += '\n  classDef foundational fill:#fbbf24,stroke:#f59e0b,stroke-width:3px,color:#000\n'

  return mermaid
}

/**
 * Generate Mermaid graph definition for all skill connections
 * Shows comprehensive network of relationships
 */
export function generateConnectionGraph(
  locale: 'fa' | 'en' = 'fa',
  maxConnections: number = 30
): string {
  const allSkills = getAllSkills(locale)
  const scored = getSkillsByFoundationScore(locale)

  // Get top foundational skills
  const topFoundational = getTopFoundationalSkills(5, locale)
  const foundationalIds = new Set(topFoundational.map((s) => s.skill.id))

  // Helper to escape text
  function escapeText(text: string): string {
    return text.replace(/"/g, '&quot;').replace(/\n/g, ' ')
  }

  let mermaid = 'graph LR\n'

  // Add all skills as nodes
  allSkills.forEach((skill) => {
    const score = scored.find((s) => s.skill.id === skill.id)?.score || 0
    const isFoundational = foundationalIds.has(skill.id)
    const skillName = escapeText(skill.name[locale] || skill.name.fa)
    const nodeId = `S${skill.id}`
    const foundationalClass = isFoundational ? ':::foundational' : ''
    mermaid += `  ${nodeId}["${skill.id}. ${skillName}<br/>${score}"]${foundationalClass}\n`
  })

  mermaid += '\n'

  // Add connections (limit to avoid clutter)
  let connectionCount = 0
  const seen = new Set<string>()
  allSkills.forEach((skill) => {
    if (skill.relatedSkills && skill.relatedSkills.length > 0 && connectionCount < maxConnections) {
      skill.relatedSkills.forEach((relatedId) => {
        if (connectionCount < maxConnections) {
          const relatedSkill = allSkills.find((s) => s.id === relatedId)
          if (relatedSkill) {
            // Create unique key
            const key = skill.id < relatedId ? `${skill.id}-${relatedId}` : `${relatedId}-${skill.id}`
            if (!seen.has(key)) {
              seen.add(key)
              // Only show if it's a cross-category connection or if it's a foundational skill
              if (
                skill.category !== relatedSkill.category ||
                foundationalIds.has(skill.id) ||
                foundationalIds.has(relatedId)
              ) {
                mermaid += `  S${skill.id} --> S${relatedId}\n`
                connectionCount++
              }
            }
          }
        }
      })
    }
  })

  // Add foundational class styling
  mermaid += '\n  classDef foundational fill:#fbbf24,stroke:#f59e0b,stroke-width:3px,color:#000\n'

  return mermaid
}

/**
 * Generate Mermaid flowchart showing foundational skills and their dependencies
 * Emphasizes prerequisite relationships
 */
export function generateFoundationalFlowchart(
  locale: 'fa' | 'en' = 'fa'
): string {
  const allSkills = getAllSkills(locale)
  const topFoundational = getTopFoundationalSkills(5, locale)
  const foundationalIds = new Set(topFoundational.map((s) => s.skill.id))

  // Helper to escape text
  function escapeText(text: string): string {
    return text.replace(/"/g, '&quot;').replace(/\n/g, ' ')
  }

  let mermaid = 'flowchart TD\n'

  // Start with foundational skills at top
  mermaid += '  subgraph Foundational["Foundational Skills - Start Here"]\n'
  topFoundational.forEach(({ skill, score }) => {
    const skillName = escapeText(skill.name[locale] || skill.name.fa)
    mermaid += `    F${skill.id}["${skill.id}. ${skillName}<br/>Score: ${score}"]:::foundational\n`
  })
  mermaid += '  end\n\n'

  // Show what foundational skills enable (limit to avoid clutter)
  const enabledSkills = new Set<number>()
  topFoundational.forEach(({ skill }) => {
    if (skill.relatedSkills && skill.relatedSkills.length > 0) {
      skill.relatedSkills.forEach((relatedId) => {
        const relatedSkill = allSkills.find((s) => s.id === relatedId)
        if (relatedSkill && !foundationalIds.has(relatedId) && enabledSkills.size < 20) {
          enabledSkills.add(relatedId)
          const skillName = escapeText(relatedSkill.name[locale] || relatedSkill.name.fa)
          mermaid += `  F${skill.id} --> S${relatedId}["${relatedId}. ${skillName}"]\n`
        }
      })
    }
  })

  // Add foundational class styling
  mermaid += '\n  classDef foundational fill:#fbbf24,stroke:#f59e0b,stroke-width:3px,color:#000\n'

  return mermaid
}

