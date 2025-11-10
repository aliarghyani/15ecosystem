/**
 * Script to import videos from Excel file and extract structured data
 * Run with: pnpm tsx scripts/import-excel-videos.ts
 * 
 * This script will:
 * 1. Read Excel file from docs/sources/all khashayartalks videos .xlsx
 * 2. Parse each sheet (playlist) separately
 * 3. Extract playlist URL from cell A1
 * 4. Extract video data from rows 4+ (Title, URL, Upload Date, Views)
 * 5. Parse view counts and dates
 * 6. Extract YouTube video IDs
 * 7. Generate structured JSON output
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import XLSX from 'xlsx'
import { extractYouTubeVideoId } from '../app/utils/videos'

interface ExcelVideo {
  title: string // Persian title from Excel
  url: string // YouTube URL
  uploadDate: string // Relative date like "1 year ago"
  views: string // View count like "101K"
}

interface ExcelPlaylist {
  name: string // Sheet name (playlist name)
  url: string // Playlist URL from cell A1
  videos: ExcelVideo[]
}

interface ParsedVideo {
  id: string // YouTube video ID
  youtubeUrl: string // Full YouTube URL
  title: {
    fa: string
    en: string // Will be translated later
  }
  viewCount: number // Parsed view count
  publishedAt: string // ISO date string
  playlistId: string // Extracted playlist ID
  playlistName: string // Sheet name
}

interface ParsedPlaylist {
  id: string // Playlist ID extracted from URL
  youtubeId: string // Same as id
  name: string // Sheet name
  url: string // Full playlist URL
  videoIds: string[] // Array of video IDs
  videoCount: number
}

/**
 * Parse view count from format like "101K", "1.5M", "254K"
 */
function parseViewCount(viewCountStr: string): number {
  if (!viewCountStr || typeof viewCountStr !== 'string') {
    return 0
  }

  // Remove any whitespace
  const cleaned = viewCountStr.trim().toUpperCase()
  
  // Match pattern: number followed by optional K/M/B
  const match = cleaned.match(/^([\d.]+)([KMB])?$/)
  
  if (!match) {
    console.warn(`⚠️  Could not parse view count: "${viewCountStr}"`)
    return 0
  }

  const value = parseFloat(match[1])
  const unit = match[2]

  if (unit === 'K') {
    return Math.round(value * 1000)
  } else if (unit === 'M') {
    return Math.round(value * 1000000)
  } else if (unit === 'B') {
    return Math.round(value * 1000000000)
  }
  
  return Math.round(value)
}

/**
 * Parse relative date like "1 year ago", "2 months ago" to approximate ISO date
 */
function parseRelativeDate(dateStr: string): string {
  if (!dateStr || typeof dateStr !== 'string') {
    return new Date().toISOString()
  }

  const cleaned = dateStr.trim().toLowerCase()
  const now = new Date()
  const date = new Date(now)

  // Match pattern: number + unit + "ago"
  const match = cleaned.match(/(\d+)\s+(year|month|week|day|hour|minute)s?\s+ago/i)

  if (!match) {
    console.warn(`⚠️  Could not parse date: "${dateStr}", using current date`)
    return now.toISOString()
  }

  const amount = parseInt(match[1])
  const unit = match[2].toLowerCase()

  if (unit === 'year' || unit === 'years') {
    date.setFullYear(date.getFullYear() - amount)
  } else if (unit === 'month' || unit === 'months') {
    date.setMonth(date.getMonth() - amount)
  } else if (unit === 'week' || unit === 'weeks') {
    date.setDate(date.getDate() - amount * 7)
  } else if (unit === 'day' || unit === 'days') {
    date.setDate(date.getDate() - amount)
  } else if (unit === 'hour' || unit === 'hours') {
    date.setHours(date.getHours() - amount)
  } else if (unit === 'minute' || unit === 'minutes') {
    date.setMinutes(date.getMinutes() - amount)
  }

  return date.toISOString()
}

/**
 * Extract playlist ID from YouTube playlist URL
 */
function extractPlaylistId(url: string): string | null {
  if (!url) return null

  // Pattern: https://www.youtube.com/playlist?list=PLxxxxx
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

/**
 * Main function to import Excel data
 */
function main() {
  console.log('📊 Starting Excel video import...\n')

  const excelPath = join(process.cwd(), 'docs', 'sources', 'all khashayartalks videos .xlsx')

  // Check if file exists
  if (!existsSync(excelPath)) {
    console.error(`❌ Excel file not found at: ${excelPath}`)
    process.exit(1)
  }

  console.log(`📖 Reading Excel file: ${excelPath}`)

  // Read Excel file
  const workbook = XLSX.readFile(excelPath)
  const sheetNames = workbook.SheetNames

  console.log(`📋 Found ${sheetNames.length} sheets (playlists)\n`)

  const playlists: ExcelPlaylist[] = []
  const allVideos: ParsedVideo[] = []
  const parsedPlaylists: ParsedPlaylist[] = []

  // Process each sheet (playlist)
  for (const sheetName of sheetNames) {
    console.log(`📝 Processing sheet: "${sheetName}"`)

    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as any[][]

    // Extract playlist URL from cell A1 (row 0, column 0)
    let playlistUrl = String(data[0]?.[0] || '').trim()
    
    // Remove "Data from: " prefix if present
    if (playlistUrl.startsWith('Data from: ')) {
      playlistUrl = playlistUrl.replace('Data from: ', '').trim()
    }
    
    if (!playlistUrl || !playlistUrl.includes('youtube.com/playlist')) {
      console.warn(`⚠️  No valid playlist URL found in cell A1 for sheet "${sheetName}"`)
      continue
    }

    console.log(`   Playlist URL: ${playlistUrl}`)

    // Extract playlist ID
    const playlistId = extractPlaylistId(playlistUrl)
    if (!playlistId) {
      console.warn(`⚠️  Could not extract playlist ID from URL: ${playlistUrl}`)
      continue
    }

    // Headers are in row 2 (index 1): Title, URL, Upload Date, Views
    // Data starts from row 4 (index 3)
    const videos: ExcelVideo[] = []
    const videoIds: string[] = []

    for (let i = 3; i < data.length; i++) {
      const row = data[i]
      
      // Skip empty rows
      if (!row || !row[0] || !row[1]) {
        continue
      }

      const title = String(row[0] || '').trim()
      const url = String(row[1] || '').trim()
      const uploadDate = String(row[2] || '').trim()
      const views = String(row[3] || '').trim()

      if (!title || !url) {
        continue
      }

      // Extract video ID
      const videoId = extractYouTubeVideoId(url)
      if (!videoId) {
        console.warn(`⚠️  Could not extract video ID from URL: ${url}`)
        continue
      }

      // Parse view count and date
      const viewCount = parseViewCount(views)
      const publishedAt = parseRelativeDate(uploadDate)

      // Create parsed video
      const parsedVideo: ParsedVideo = {
        id: videoId,
        youtubeUrl: url,
        title: {
          fa: title,
          en: '' // Will be translated later
        },
        viewCount,
        publishedAt,
        playlistId: playlistId,
        playlistName: sheetName
      }

      allVideos.push(parsedVideo)
      videoIds.push(videoId)

      videos.push({
        title,
        url,
        uploadDate,
        views
      })
    }

    console.log(`   ✅ Extracted ${videos.length} videos\n`)

    // Create playlist object
    playlists.push({
      name: sheetName,
      url: playlistUrl,
      videos
    })

    // Create parsed playlist
    parsedPlaylists.push({
      id: playlistId,
      youtubeId: playlistId,
      name: sheetName,
      url: playlistUrl,
      videoIds,
      videoCount: videos.length
    })
  }

  // Summary
  console.log('\n📊 Import Summary:')
  console.log(`   Playlists: ${playlists.length}`)
  console.log(`   Total Videos: ${allVideos.length}`)
  console.log(`   Average videos per playlist: ${Math.round(allVideos.length / playlists.length)}\n`)

  // Output directory
  const outputDir = join(process.cwd(), 'docs', 'sources', 'imported')
  
  // Create output directory if it doesn't exist
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  // Write raw Excel data (for reference)
  const rawDataPath = join(outputDir, 'excel-raw-data.json')
  writeFileSync(rawDataPath, JSON.stringify({ playlists, videos: allVideos }, null, 2), 'utf-8')
  console.log(`✅ Raw Excel data saved to: ${rawDataPath}`)

  // Write parsed videos (ready for enrichment)
  const videosPath = join(outputDir, 'parsed-videos.json')
  writeFileSync(videosPath, JSON.stringify(allVideos, null, 2), 'utf-8')
  console.log(`✅ Parsed videos saved to: ${videosPath}`)

  // Write parsed playlists
  const playlistsPath = join(outputDir, 'parsed-playlists.json')
  writeFileSync(playlistsPath, JSON.stringify(parsedPlaylists, null, 2), 'utf-8')
  console.log(`✅ Parsed playlists saved to: ${playlistsPath}`)

  // Write summary report
  const summary = {
    importedAt: new Date().toISOString(),
    totalPlaylists: playlists.length,
    totalVideos: allVideos.length,
    playlists: parsedPlaylists.map(p => ({
      name: p.name,
      id: p.id,
      videoCount: p.videoCount
    })),
    videosByPlaylist: parsedPlaylists.map(p => ({
      playlist: p.name,
      count: p.videoCount
    }))
  }

  const summaryPath = join(outputDir, 'import-summary.json')
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8')
  console.log(`✅ Import summary saved to: ${summaryPath}`)

  console.log('\n✨ Excel import completed successfully!')
  console.log(`\n📁 Output files in: ${outputDir}`)
  console.log('\n📝 Next steps:')
  console.log('   1. Review parsed-videos.json')
  console.log('   2. Run data enrichment script (Story 8.0b)')
  console.log('   3. Translate Persian titles to English')
  console.log('   4. Map videos to skills and categories')
}

// Run the script
main()

