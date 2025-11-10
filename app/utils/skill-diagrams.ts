/**
 * Utility functions for generating skill-specific relationship diagrams using Vue Flow
 * These diagrams show "mother" (enables) and "child" (prerequisites) relationships
 */

import type { Skill } from '~/types'
import { getAllSkills } from './skills'
import type { Node, Edge } from '@vue-flow/core'

interface DiagramData {
  nodes: Node[]
  edges: Edge[]
}

/**
 * Generate Vue Flow nodes and edges showing a skill's relationships
 * Shows: Prerequisites (parents) → Current Skill → Enabled Skills (children)
 */
export function generateSkillRelationshipDiagram(
  skillId: number,
  locale: 'fa' | 'en' = 'fa'
): DiagramData {
  const allSkills = getAllSkills(locale)
  const currentSkill = allSkills.find((s) => s.id === skillId)

  if (!currentSkill) {
    return { nodes: [], edges: [] }
  }

  const nodes: Node[] = []
  const edges: Edge[] = []

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

  const skillName = currentSkill.name[locale] || currentSkill.name.fa

  // Layout configuration - larger nodes for better readability
  const nodeWidth = 280
  const nodeHeight = 100
  const horizontalSpacing = 320
  const verticalSpacing = 200

  // Calculate positions
  let yOffset = 0

  // Prerequisites section (top)
  if (prerequisites.length > 0) {
    const prerequisitesPerRow = Math.min(prerequisites.length, 3) // Reduced to 3 per row for larger nodes
    const startX = -(prerequisitesPerRow - 1) * horizontalSpacing / 2

    prerequisites.forEach((skill, index) => {
      const row = Math.floor(index / prerequisitesPerRow)
      const col = index % prerequisitesPerRow
      const x = startX + col * horizontalSpacing
      const y = yOffset + row * verticalSpacing

      nodes.push({
        id: `prerequisite-${skill.id}`,
        type: 'default',
        position: { x, y },
        data: {
          label: `${skill.id}. ${skill.name[locale] || skill.name.fa}`,
        },
        style: {
          background: '#e0f2fe',
          color: '#0c4a6e',
          border: '3px solid #0284c7',
          borderRadius: '12px',
          padding: '16px 20px',
          fontSize: '16px',
          fontWeight: 600,
          minWidth: nodeWidth,
          minHeight: nodeHeight,
          textAlign: 'center',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
        },
      })

      edges.push({
        id: `edge-prerequisite-${skill.id}-current`,
        source: `prerequisite-${skill.id}`,
        target: 'current-skill',
        label: locale === 'fa' ? 'پیش‌نیاز' : 'Prerequisite',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#0284c7', strokeWidth: 3 },
        labelStyle: { 
          fill: '#0284c7', 
          fontWeight: 700,
          fontSize: '14px',
          background: '#ffffff',
          padding: '4px 8px',
          borderRadius: '4px',
        },
        labelBgStyle: { fill: '#ffffff', fillOpacity: 0.9 },
      })
    })

    yOffset += Math.ceil(prerequisites.length / prerequisitesPerRow) * verticalSpacing + 120
  }

  // Current skill (center) - larger and more prominent
  nodes.push({
    id: 'current-skill',
    type: 'default',
    position: { x: -nodeWidth / 2, y: yOffset },
    data: {
      label: `${skillId}. ${skillName}`,
    },
    style: {
      background: '#fbbf24',
      color: '#000',
      border: '5px solid #f59e0b',
      borderRadius: '12px',
      padding: '20px 24px',
      fontSize: '20px',
      fontWeight: 800,
      minWidth: nodeWidth + 40,
      minHeight: nodeHeight + 20,
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)',
    },
  })

  yOffset += verticalSpacing + 80

  // Enabled skills section (bottom)
  if (enabledSkills.length > 0) {
    const enabledPerRow = Math.min(enabledSkills.length, 3) // Reduced to 3 per row
    const startX = -(enabledPerRow - 1) * horizontalSpacing / 2

    enabledSkills.forEach((skill, index) => {
      const row = Math.floor(index / enabledPerRow)
      const col = index % enabledPerRow
      const x = startX + col * horizontalSpacing
      const y = yOffset + row * verticalSpacing

      nodes.push({
        id: `enabled-${skill.id}`,
        type: 'default',
        position: { x, y },
        data: {
          label: `${skill.id}. ${skill.name[locale] || skill.name.fa}`,
        },
        style: {
          background: '#dcfce7',
          color: '#14532d',
          border: '3px solid #16a34a',
          borderRadius: '12px',
          padding: '16px 20px',
          fontSize: '16px',
          fontWeight: 600,
          minWidth: nodeWidth,
          minHeight: nodeHeight,
          textAlign: 'center',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
        },
      })

      edges.push({
        id: `edge-current-enabled-${skill.id}`,
        source: 'current-skill',
        target: `enabled-${skill.id}`,
        label: locale === 'fa' ? 'فعال می‌کند' : 'Enables',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#16a34a', strokeWidth: 3 },
        labelStyle: { 
          fill: '#16a34a', 
          fontWeight: 700,
          fontSize: '14px',
          background: '#ffffff',
          padding: '4px 8px',
          borderRadius: '4px',
        },
        labelBgStyle: { fill: '#ffffff', fillOpacity: 0.9 },
      })
    })
  }

  return { nodes, edges }
}

/**
 * Generate a comprehensive network diagram for a specific skill
 * Shows all bidirectional relationships
 */
export function generateSkillNetworkDiagram(
  skillId: number,
  locale: 'fa' | 'en' = 'fa'
): DiagramData {
  const allSkills = getAllSkills(locale)
  const currentSkill = allSkills.find((s) => s.id === skillId)

  if (!currentSkill) {
    return { nodes: [], edges: [] }
  }

  const nodes: Node[] = []
  const edges: Edge[] = []

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
    return { nodes: [], edges: [] }
  }

  const skillName = currentSkill.name[locale] || currentSkill.name.fa

  // Layout: current skill in center, related skills in a circle around it
  const radius = 200
  const centerX = 0
  const centerY = 0

  // Current skill (center)
  nodes.push({
    id: 'current-skill',
    type: 'default',
    position: { x: centerX - 100, y: centerY - 40 },
    data: {
      label: `${skillId}. ${skillName}`,
    },
    style: {
      background: '#fbbf24',
      color: '#000',
      border: '4px solid #f59e0b',
      borderRadius: '8px',
      padding: '15px',
      fontSize: '16px',
      fontWeight: 700,
      minWidth: 200,
    },
  })

  // Related skills in a circle
  relatedSkills.forEach((skill, index) => {
    const angle = (2 * Math.PI * index) / relatedSkills.length
    const x = centerX + radius * Math.cos(angle) - 100
    const y = centerY + radius * Math.sin(angle) - 40

    nodes.push({
      id: `related-${skill.id}`,
      type: 'default',
      position: { x, y },
      data: {
        label: `${skill.id}. ${skill.name[locale] || skill.name.fa}`,
      },
      style: {
        background: '#e0e7ff',
        color: '#312e81',
        border: '2px solid #6366f1',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '14px',
        fontWeight: 500,
      },
    })

    // Bidirectional edge
    edges.push({
      id: `edge-current-related-${skill.id}`,
      source: 'current-skill',
      target: `related-${skill.id}`,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#6366f1', strokeWidth: 2 },
    })
  })

  return { nodes, edges }
}
