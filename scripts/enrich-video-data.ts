/**
 * Script to enrich imported video data with skill/category mappings, tags, and metadata
 * Run with: pnpm tsx scripts/enrich-video-data.ts
 * 
 * This script will:
 * 1. Read parsed videos from import
 * 2. Map videos to skills (1-15) based on title analysis
 * 3. Map videos to categories (health/identity/career) derived from skill mappings
 * 4. Extract tags from titles
 * 5. Identify writers from titles
 * 6. Generate thumbnail URLs
 * 7. Prepare structure for English translations
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { getYouTubeThumbnail } from '../app/utils/videos'

interface ParsedVideo {
  id: string
  youtubeUrl: string
  title: {
    fa: string
    en: string
  }
  viewCount: number
  publishedAt: string
  playlistId: string
  playlistName: string
}

interface EnrichedVideo {
  id: string
  youtubeUrl: string
  youtubeId: string
  title: {
    fa: string
    en: string // Placeholder for translation
  }
  description?: {
    fa?: string
    en?: string
  }
  thumbnail: string
  duration?: number
  publishedAt: string
  viewCount: number
  playlistId: string
  skillIds: number[]
  categoryIds: string[]
  tags: string[]
  writerId?: string
  bookIds?: string[]
  channelId: string
  channelName: string
}

/**
 * Skill keyword dictionaries for title-based mapping
 * Each skill has Persian keywords that might appear in video titles
 */
const skillKeywords: Record<number, string[]> = {
  // Health Category (1-6)
  1: ['خواب', 'sleep', 'bedtime', 'insomnia', 'خوابیدن', 'خواب باکیفیت', 'خوابمان', 'خواب را'],
  2: ['تمرکز', 'focus', 'concentration', 'attention', 'deep work', 'deepwork', 'حافظه', 'memory'],
  3: ['دوپامین', 'dopamine', 'انگیزه', 'motivation', 'اعتیاد', 'addiction', 'لذت', 'pleasure'],
  4: ['استرس', 'stress', 'اضطراب', 'anxiety', 'مدیریت استرس', 'استرس را'],
  5: ['روان', 'mental', 'افسردگی', 'depression', 'روابط', 'relationships', 'عاشق', 'love', 'تنهایی', 'loneliness'],
  6: ['طول عمر', 'longevity', 'age', 'health', 'پیری', 'aging', 'عمر', 'زندگی', 'سلامت', 'health'],

  // Identity Category (7-12)
  7: ['خلاقیت', 'creativity', 'creative', 'خلاق', 'ایده', 'idea', 'نوآوری', 'innovation'],
  8: ['دانش', 'knowledge', 'تخصصی', 'specialized', 'expertise', 'مهارت', 'skill', 'تخصص'],
  9: ['یادگیری', 'learning', 'learn', 'مطالعه', 'study', 'خواندن', 'reading', 'آموزش', 'education'],
  10: ['انگلیسی', 'english', 'language', 'زبان', 'زبان انگلیسی', 'english language'],
  11: ['برند', 'brand', 'personal brand', 'برند شخصی', 'شناسایی', 'identity', 'شخصیت'],
  12: ['اصالت', 'authenticity', 'authentic', 'واقعی', 'real', 'صادق', 'honest'],

  // Career Category (13-15)
  13: ['محتو', 'content', 'تولید', 'production', 'تولید محتوا', 'content creation', 'ویدیو', 'video'],
  14: ['هوش مصنوعی', 'ai', 'artificial intelligence', 'chatgpt', 'gpt', 'machine learning', 'ml'],
  15: ['آژانس', 'agency', 'کارآفرینی', 'entrepreneurship', 'business', 'کسب و کار', 'استقلال', 'independence']
}

/**
 * Writer identification patterns
 */
const writerPatterns: Array<{ id: string; name: string; patterns: string[] }> = [
  {
    id: 'andrew-huberman',
    name: 'Andrew Huberman',
    patterns: ['andrew huberman', 'huberman', 'اندرو هیوبرمن', 'هیوبرمن']
  },
  {
    id: 'peter-attia',
    name: 'Peter Attia',
    patterns: ['peter attia', 'attia', 'پیتر آتیا', 'آتیا']
  },
  {
    id: 'matthew-walker',
    name: 'Matthew Walker',
    patterns: ['matthew walker', 'walker', 'متیو واکر', 'واکر']
  },
  {
    id: 'cal-newport',
    name: 'Cal Newport',
    patterns: ['cal newport', 'newport', 'کال نیوپورت', 'نیوپورت']
  },
  {
    id: 'robert-greene',
    name: 'Robert Greene',
    patterns: ['robert greene', 'greene', 'رابرت گرین', 'گرین']
  }
]

/**
 * Extract skill IDs from video title
 */
function extractSkillIds(title: string): number[] {
  const titleLower = title.toLowerCase()
  const matchedSkills: number[] = []

  for (const [skillIdStr, keywords] of Object.entries(skillKeywords)) {
    const skillId = parseInt(skillIdStr)
    for (const keyword of keywords) {
      if (titleLower.includes(keyword.toLowerCase())) {
        if (!matchedSkills.includes(skillId)) {
          matchedSkills.push(skillId)
        }
        break // Found a match for this skill, move to next skill
      }
    }
  }

  return matchedSkills.sort((a, b) => a - b)
}

/**
 * Derive category IDs from skill IDs
 */
function deriveCategoryIds(skillIds: number[]): string[] {
  const categories: string[] = []

  // Health: Skills 1-6
  if (skillIds.some(id => id >= 1 && id <= 6)) {
    categories.push('health')
  }

  // Identity: Skills 7-12
  if (skillIds.some(id => id >= 7 && id <= 12)) {
    categories.push('identity')
  }

  // Career: Skills 13-15
  if (skillIds.some(id => id >= 13 && id <= 15)) {
    categories.push('career')
  }

  return categories
}

/**
 * Extract tags from title and playlist name
 */
function extractTags(title: string, playlistName: string): string[] {
  const tags: string[] = []
  const titleLower = title.toLowerCase()
  const playlistLower = playlistName.toLowerCase()

  // Common topic tags
  const topicTags: Array<{ tag: string; patterns: string[] }> = [
    { tag: 'andrew-huberman', patterns: ['andrew huberman', 'huberman', 'اندرو هیوبرمن'] },
    { tag: 'peter-attia', patterns: ['peter attia', 'attia', 'پیتر آتیا'] },
    { tag: 'harvard', patterns: ['harvard', 'هاروارد'] },
    { tag: 'ted', patterns: ['ted', 'ted talks', 'ted talk'] },
    { tag: 'sleep', patterns: ['خواب', 'sleep'] },
    { tag: 'focus', patterns: ['تمرکز', 'focus'] },
    { tag: 'dopamine', patterns: ['دوپامین', 'dopamine'] },
    { tag: 'longevity', patterns: ['طول عمر', 'longevity'] },
    { tag: 'financial', patterns: ['سواد مالی', 'financial', 'مالی'] },
    { tag: 'nutrition', patterns: ['تغذیه', 'nutrition', 'nutrition'] },
    { tag: 'fitness', patterns: ['تناسب اندام', 'fitness', 'exercise'] },
    { tag: 'learning', patterns: ['یادگیری', 'learning', 'study'] },
    { tag: 'creativity', patterns: ['خلاقیت', 'creativity'] },
    { tag: 'social-media', patterns: ['فضای مجازی', 'social media', 'digital'] }
  ]

  for (const { tag, patterns } of topicTags) {
    const text = titleLower + ' ' + playlistLower
    if (patterns.some(pattern => text.includes(pattern.toLowerCase()))) {
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    }
  }

  return tags.sort()
}

/**
 * Identify writer from title
 */
function identifyWriter(title: string): string | undefined {
  const titleLower = title.toLowerCase()

  for (const writer of writerPatterns) {
    if (writer.patterns.some(pattern => titleLower.includes(pattern.toLowerCase()))) {
      return writer.id
    }
  }

  return undefined
}

/**
 * Generate English title placeholder (will be translated later)
 * For now, use a simple transliteration or placeholder
 */
function generateEnglishTitlePlaceholder(faTitle: string, playlistName: string): string {
  // Placeholder - will be translated manually or via API later
  // For now, return empty string or a simple transliteration attempt
  return '' // Empty for now, to be filled manually or via translation API
}

/**
 * Main enrichment function
 */
function main() {
  console.log('🔧 Starting video data enrichment...\n')

  const importedDir = join(process.cwd(), 'docs', 'sources', 'imported')
  const parsedVideosPath = join(importedDir, 'parsed-videos.json')

  if (!existsSync(parsedVideosPath)) {
    console.error(`❌ Parsed videos file not found: ${parsedVideosPath}`)
    console.error('   Please run: pnpm import:excel first')
    process.exit(1)
  }

  console.log(`📖 Reading parsed videos from: ${parsedVideosPath}`)
  const parsedVideos: ParsedVideo[] = JSON.parse(readFileSync(parsedVideosPath, 'utf-8'))

  console.log(`📹 Processing ${parsedVideos.length} videos...\n`)

  const enrichedVideos: EnrichedVideo[] = []
  const mappingStats = {
    videosWithSkills: 0,
    videosWithoutSkills: 0,
    videosWithWriters: 0,
    skillDistribution: {} as Record<number, number>,
    categoryDistribution: {} as Record<string, number>
  }

  for (const video of parsedVideos) {
    // Extract skill IDs from title
    const skillIds = extractSkillIds(video.title.fa)
    
    // Derive category IDs from skill IDs
    const categoryIds = deriveCategoryIds(skillIds)

    // Extract tags
    const tags = extractTags(video.title.fa, video.playlistName)

    // Identify writer
    const writerId = identifyWriter(video.title.fa)

    // Generate thumbnail
    const thumbnail = getYouTubeThumbnail(video.id, 'high')

    // Create enriched video
    const enrichedVideo: EnrichedVideo = {
      id: video.id,
      youtubeUrl: video.youtubeUrl,
      youtubeId: video.id,
      title: {
        fa: video.title.fa,
        en: generateEnglishTitlePlaceholder(video.title.fa, video.playlistName)
      },
      thumbnail,
      publishedAt: video.publishedAt,
      viewCount: video.viewCount,
      playlistId: video.playlistId,
      skillIds: skillIds.length > 0 ? skillIds : [], // Default to empty array if no matches
      categoryIds: categoryIds.length > 0 ? categoryIds : [], // Default to empty array if no matches
      tags,
      writerId,
      channelId: 'KhashayarTalks',
      channelName: 'KhashayarTalks'
    }

    enrichedVideos.push(enrichedVideo)

    // Update statistics
    if (skillIds.length > 0) {
      mappingStats.videosWithSkills++
      skillIds.forEach(skillId => {
        mappingStats.skillDistribution[skillId] = (mappingStats.skillDistribution[skillId] || 0) + 1
      })
    } else {
      mappingStats.videosWithoutSkills++
    }

    if (writerId) {
      mappingStats.videosWithWriters++
    }

    categoryIds.forEach(catId => {
      mappingStats.categoryDistribution[catId] = (mappingStats.categoryDistribution[catId] || 0) + 1
    })
  }

  // Summary
  console.log('📊 Enrichment Summary:')
  console.log(`   Total videos: ${enrichedVideos.length}`)
  console.log(`   Videos with skill mappings: ${mappingStats.videosWithSkills}`)
  console.log(`   Videos without skill mappings: ${mappingStats.videosWithoutSkills}`)
  console.log(`   Videos with writer identification: ${mappingStats.videosWithWriters}`)
  console.log('\n   Skill distribution:')
  for (const [skillId, count] of Object.entries(mappingStats.skillDistribution).sort((a, b) => parseInt(b[0]) - parseInt(a[0]))) {
    console.log(`     Skill ${skillId}: ${count} videos`)
  }
  console.log('\n   Category distribution:')
  for (const [catId, count] of Object.entries(mappingStats.categoryDistribution).sort()) {
    console.log(`     ${catId}: ${count} videos`)
  }

  // Write enriched videos
  const enrichedPath = join(importedDir, 'enriched-videos.json')
  writeFileSync(enrichedPath, JSON.stringify(enrichedVideos, null, 2), 'utf-8')
  console.log(`\n✅ Enriched videos saved to: ${enrichedPath}`)

  // Write mapping report
  const mappingReport = {
    enrichedAt: new Date().toISOString(),
    totalVideos: enrichedVideos.length,
    statistics: mappingStats,
    videosNeedingManualReview: enrichedVideos
      .filter(v => v.skillIds.length === 0)
      .map(v => ({
        id: v.id,
        title: v.title.fa,
        playlistName: v.playlistName || 'Unknown'
      }))
  }

  const reportPath = join(importedDir, 'enrichment-report.json')
  writeFileSync(reportPath, JSON.stringify(mappingReport, null, 2), 'utf-8')
  console.log(`✅ Enrichment report saved to: ${reportPath}`)

  console.log('\n✨ Data enrichment completed!')
  console.log(`\n📝 Next steps:`)
  console.log('   1. Review videos without skill mappings (in enrichment-report.json)')
  console.log('   2. Manually map unmapped videos to skills')
  console.log('   3. Translate Persian titles to English')
  console.log('   4. Review and refine skill mappings')
  console.log('   5. Integrate enriched data into app/data files')
}

// Run the script
main()

