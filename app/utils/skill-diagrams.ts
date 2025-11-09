/**
 * Utility functions for generating skill-specific relationship diagrams
 * These diagrams show "mother" (enables) and "child" (prerequisites) relationships
 */

import type { Skill } from '~/types'
import { getAllSkills } from './skills'

/**
 * Generate Mermaid flowchart showing a skill's relationships
 * Shows: Prerequisites (parents) → Current Skill → Enabled Skills (children)
 */
export function generateSkillRelationshipDiagram(
  skillId: number,
  locale: 'fa' | 'en' = 'fa'
): string {
  const allSkills = getAllSkills(locale)
  const currentSkill = allSkills.find((s) => s.id === skillId)

  if (!currentSkill) {
    return ''
  }

  // Helper to escape text
  function escapeText(text: string): string {
    return text.replace(/"/g, '&quot;').replace(/\n/g, ' ')
  }

  // Find prerequisites (skills that enable this skill)
  const prerequisites: Skill[] = []
  allSkills.forEach((skill) => {
    if (skill.relatedSkills && skill.relatedSkills.includes(skillId)) {
      prerequisites.push(skill)
    }
  })

  // Find enabled skills (skills this skill enables)
  const enabledSkills: Skill[] = []
  if (currentSkill.relatedSkills) {
    currentSkill.relatedSkills.forEach((relatedId) => {
      const relatedSkill = allSkills.find((s) => s.id === relatedId)
      if (relatedSkill) {
        enabledSkills.push(relatedSkill)
      }
    })
  }

  const skillName = escapeText(currentSkill.name[locale] || currentSkill.name.fa)

  // Build Mermaid flowchart
  let mermaid = 'flowchart TD\n'

  // Prerequisites section (top)
  if (prerequisites.length > 0) {
    mermaid += '  subgraph Prerequisites["Prerequisites - Required Skills"]\n'
    prerequisites.forEach((skill) => {
      const name = escapeText(skill.name[locale] || skill.name.fa)
      mermaid += `    P${skill.id}["${skill.id}. ${name}"]\n`
    })
    mermaid += '  end\n\n'
  }

  // Current skill (center)
  mermaid += `  Current["${skillId}. ${skillName}"]:::current\n\n`

  // Enabled skills section (bottom)
  if (enabledSkills.length > 0) {
    mermaid += '  subgraph Enabled["Enabled Skills - This Skill Helps"]\n'
    enabledSkills.forEach((skill) => {
      const name = escapeText(skill.name[locale] || skill.name.fa)
      mermaid += `    E${skill.id}["${skill.id}. ${name}"]\n`
    })
    mermaid += '  end\n\n'
  }

  // Add connections from prerequisites to current
  prerequisites.forEach((skill) => {
    mermaid += `  P${skill.id} -->|"enables"| Current\n`
  })

  // Add connections from current to enabled
  enabledSkills.forEach((skill) => {
    mermaid += `  Current -->|"enables"| E${skill.id}\n`
  })

  // Add styling
  mermaid += '\n  classDef current fill:#fbbf24,stroke:#f59e0b,stroke-width:4px,color:#000\n'

  return mermaid
}

/**
 * Generate a comprehensive network diagram for a specific skill
 * Shows all bidirectional relationships
 */
export function generateSkillNetworkDiagram(
  skillId: number,
  locale: 'fa' | 'en' = 'fa'
): string {
  const allSkills = getAllSkills(locale)
  const currentSkill = allSkills.find((s) => s.id === skillId)

  if (!currentSkill) {
    return ''
  }

  // Helper to escape text
  function escapeText(text: string): string {
    return text.replace(/"/g, '&quot;').replace(/\n/g, ' ')
  }

  // Get all related skills
  const relatedSkills: Skill[] = []
  if (currentSkill.relatedSkills) {
    currentSkill.relatedSkills.forEach((relatedId) => {
      const relatedSkill = allSkills.find((s) => s.id === relatedId)
      if (relatedSkill) {
        relatedSkills.push(relatedSkill)
      }
    })
  }

  if (relatedSkills.length === 0) {
    return ''
  }

  const skillName = escapeText(currentSkill.name[locale] || currentSkill.name.fa)

  // Build Mermaid graph
  let mermaid = 'graph LR\n'

  // Current skill (center)
  mermaid += `  Current["${skillId}. ${skillName}"]:::current\n\n`

  // Add all related skills
  relatedSkills.forEach((skill) => {
    const name = escapeText(skill.name[locale] || skill.name.fa)
    mermaid += `  S${skill.id}["${skill.id}. ${name}"]\n`
  })

  mermaid += '\n'

  // Add bidirectional connections
  relatedSkills.forEach((skill) => {
    mermaid += `  Current <--> S${skill.id}\n`
  })

  // Add styling
  mermaid += '\n  classDef current fill:#fbbf24,stroke:#f59e0b,stroke-width:4px,color:#000\n'

  return mermaid
}

