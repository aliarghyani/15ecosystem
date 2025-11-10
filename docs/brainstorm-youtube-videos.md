# Brainstorming: YouTube Videos Integration

**Date:** 2025-01-15  
**Feature:** YouTube Videos from KhashayarTalks Channel  
**Epic:** Epic 7 - Video Content Integration

## Overview

Integrate YouTube videos from the KhashayarTalks channel playlists into the 15ecosystem platform. Each video should be mapped to related skills, and videos should be categorized similar to how books and writers are organized.

## Source Channel

**Channel:** KhashayarTalks  
**URL:** https://www.youtube.com/@KhashayarTalks/playlists

## Identified Playlists

Based on the provided samples, here are the 11 playlists identified:

### Health Category (Skills 1-6)

1. **"طول عمر" (Longevity)** - 2 videos
   - Related to Skill 6: طول‌عمرِ سالم (Longevity)
   - Videos about David Sinclair and Peter Attia

2. **"تمرکز و حافظه" (Focus and Memory)** - 6 videos
   - Related to Skill 2: تمرکز (Economy of Attention)
   - Videos about focus enhancement

3. **"دوپامین، اعتیاد و انگیزه" (Dopamine, Addiction, Motivation)** - 9 videos
   - Related to Skill 3: مدیریت دوپامین
   - Videos about dopamine management

4. **"خواب و مدیریت انرژی" (Sleep and Energy Management)** - 4 videos
   - Related to Skill 1: خوابِ باکیفیت
   - Videos about sleep regulation

5. **"اندرو هیوبر من فارسی" (Andrew Huberman Farsi)** - 28 videos
   - Related to Skills 1-6 (Health category)
   - Neuroscience, mental health, dopamine, depression

6. **"تغذیه و تناسب اندام" (Nutrition and Fitness)** - 10 videos
   - Related to Skills 1, 6: Health and Longevity
   - Videos about nutrition and fitness

### Identity Category (Skills 7-12)

7. **"خلاقیت و دانش تخصصی" (Creativity and Specialized Knowledge)** - 6 videos
   - Related to Skills 7, 8: خلاقیت and دانشِ تخصصیِ شخصی
   - Videos about creativity and specialized knowledge

8. **"یادگیری و مطالعه" (Learning and Studying)** - 8 videos
   - Related to Skill 9: یادگیری مؤثر و ادامه‌دار
   - Videos about learning techniques

### Career Category (Skills 13-15)

9. **"سواد مالی" (Financial Literacy)** - 5 videos
   - Related to Skills 13-15 (Career category)
   - Videos about wealth management

10. **"فضای مجازی" (Virtual Space / Social Media)** - 3 videos
    - Related to Skills 2, 13: تمرکز and تولید محتوا
    - Videos about digital minimalism, social media

11. **"TED talks"** - 4 videos
    - General knowledge, skill acquisition
    - Related to multiple skills

## Key Requirements

### Data Structure

1. **Video Entity:**
   - YouTube video URL (full link, e.g., https://youtu.be/hxnS40NolrA?si=...)
   - YouTube video ID (extracted from URL)
   - Title (bilingual: fa, en)
   - Description (bilingual: fa, en)
   - Thumbnail URL (generated from video ID or provided)
   - Duration (optional)
   - Published date (optional)
   - View count (optional)
   - Playlist ID (optional)
   - Related skill IDs (array)
   - Related category IDs (array)
   - Tags (array)
   - Writer/Author (if applicable)

2. **Playlist Entity:**
   - Playlist ID
   - Title (bilingual: fa, en)
   - Description (bilingual: fa, en)
   - Thumbnail URL
   - Video count
   - Related skill IDs (array)
   - Related category IDs (array)
   - Videos (array of video IDs)

### Mapping Strategy

1. **Primary Mapping:** Each video maps to 1-3 primary skills
2. **Secondary Mapping:** Videos can relate to multiple skills
3. **Category Mapping:** Videos inherit category from primary skill
4. **Playlist Mapping:** Playlists map to skills based on content

### Display Requirements

1. **Videos List Page:**
   - Similar to books page structure
   - Grouped by category (Health, Identity, Career)
   - Filterable by skill
   - Searchable

2. **Video Detail Page:**
   - Large video thumbnail (clickable, opens YouTube in new tab)
   - "Watch on YouTube" button
   - Title, description
   - Related skills (with links)
   - Related books (if any)
   - Related writers (if any)
   - Tags
   - Breadcrumb navigation
   - Note: Videos open on YouTube, not embedded

3. **Skill Detail Page:**
   - Add "Related Videos" section
   - Display videos related to the skill
   - Show playlist if video is part of one

4. **Playlist Detail Page:**
   - List all videos in playlist
   - Playlist description
   - Related skills
   - Related categories

### Technical Considerations

1. **Data Source:**
   - Manual mapping file for skill relationships
   - YAML files for structured data (similar to books/writers)
   - YouTube URLs stored directly in data files
   - No API calls needed (static data)

2. **Thumbnail Display:**
   - Generate thumbnail URLs from video ID: `https://img.youtube.com/vi/{VIDEO_ID}/hqdefault.jpg`
   - Use @nuxt/image for optimization
   - Lazy load thumbnails
   - Add play icon overlay (YouTube-style)

3. **Link Handling:**
   - Extract video ID from YouTube URL (support multiple formats)
   - Open YouTube URL in new tab (`target="_blank"`)
   - Add `rel="noopener noreferrer"` for security

4. **Performance:**
   - Lazy load video thumbnails
   - Optimize images with @nuxt/image
   - Code splitting for video components
   - No iframe/embed code (faster page loads)

## User Stories (High Level)

1. As a user, I want to browse videos by category, so I can find content related to my interests.
2. As a user, I want to see videos related to a skill, so I can learn more about that skill.
3. As a user, I want to click on video thumbnails to watch videos on YouTube, so I can access the full YouTube experience.
4. As a user, I want to see which playlist a video belongs to, so I can explore related content.
5. As a user, I want to filter videos by skill, so I can focus on specific topics.

## Open Questions

1. ✅ Store video data statically (YAML files) - No API needed
2. ✅ Update manually when adding new videos
3. Should we support multiple YouTube channels in the future? (Currently: KhashayarTalks only)
4. Do we need video transcripts/subtitles? (Future enhancement)
5. Should videos have ratings/reviews? (Future enhancement)
6. Do we need video playlists as a separate entity or just group by skill? (Both - playlists and skill grouping)

## Next Steps

1. Create architecture document for video integration
2. Design data structure for videos and playlists
3. Create stories for implementation
4. Design UI/UX for video pages
5. Plan YouTube API integration (if needed)

