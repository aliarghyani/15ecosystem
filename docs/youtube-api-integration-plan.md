# YouTube API Integration Plan

**Date:** 2025-01-15  
**Status:** Future Enhancement  
**Current Approach:** Manual hardcoded database  
**Channel:** KhashayarTalks

## Overview

This document outlines the plan for integrating YouTube Data API v3 to automatically fetch video links, titles, and statistics from the KhashayarTalks channel. This is a future enhancement that will be discussed with Khashayar as part of our cooperation plan.

## Current Implementation

**Status:** Manual data entry with hardcoded database

- Videos and playlists are manually extracted and stored in static TypeScript files
- Video links and titles are manually entered
- Data is stored in `app/data/en/videos.ts` and `app/data/fa/videos.ts`
- No API integration currently active

## Future API Integration Workflow

### Minimal Workflow to Get All Video Links + Stats for a Channel

#### Step 1: Get Uploads Playlist ID

Use `channels.list` to retrieve the uploads playlist ID for the channel.

**Endpoint:**
```
GET https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id={CHANNEL_ID}&key={API_KEY}
```

**Response:**
- Read `items[0].contentDetails.relatedPlaylists.uploads` to get the uploads playlist ID

#### Step 2: Collect All Video IDs

Use `playlistItems.list` (with pagination) to collect all video IDs from the uploads playlist.

**Endpoint:**
```
GET https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId={UPLOADS_ID}&maxResults=50&pageToken={PAGE_TOKEN}&key={API_KEY}
```

**Process:**
- Make paginated requests with `maxResults=50`
- Use `pageToken` from response to get next page
- Continue until all video IDs are collected

#### Step 3: Get Video Details and Statistics

Use `videos.list` in batches of 50 IDs to get snippet and statistics for each video.

**Endpoint:**
```
GET https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id={COMMA_SEPARATED_IDS}&key={API_KEY}
```

**Process:**
- Batch video IDs (max 50 per request)
- Request `snippet` for title, description, thumbnail, published date
- Request `statistics` for view count, like count, etc.

#### Step 4: Construct Video Links

Construct YouTube watch URLs for each video:
```
https://www.youtube.com/watch?v={videoId}
```

## API Quota Management

### Quota Costs (Important)

- `channels.list`: **1 unit** per request
- `playlistItems.list`: **1 unit** per request
- `videos.list`: **1 unit** per request
- `search.list`: **100 units** per request (avoid for "all uploads")

**Default Daily Quota:** 10,000 units

### Quota Tips

1. **Avoid `search.list`** - Use the uploads playlist method instead (much more efficient)
2. **Batch requests** - Use `maxResults=50` to minimize number of requests
3. **Cache results** - Store fetched data to avoid repeated API calls
4. **Monitor usage** - Track quota consumption to stay within limits

### Example Quota Calculation

For a channel with 100 videos:
- `channels.list`: 1 unit (get uploads playlist ID)
- `playlistItems.list`: 2 units (2 pages × 50 videos)
- `videos.list`: 2 units (2 batches × 50 videos)
- **Total: ~5 units** (vs. 100+ units if using search.list)

## Implementation Considerations

### Data Structure

The API integration should populate the existing `Video` interface:

```typescript
interface Video {
  id: string                    // YouTube video ID
  youtubeUrl: string            // Full YouTube URL
  youtubeId: string              // YouTube video ID
  title: {
    fa: string                  // Manual translation or API fallback
    en: string                  // From API snippet.title
  }
  description?: {
    fa: string                  // Manual translation
    en: string                  // From API snippet.description
  }
  thumbnail: string             // From API snippet.thumbnails
  duration?: number             // From API contentDetails.duration (parse ISO 8601)
  publishedAt?: string          // From API snippet.publishedAt
  viewCount?: number            // From API statistics.viewCount
  playlistId?: string           // Optional playlist ID
  skillIds: number[]            // Manual mapping (still required)
  categoryIds: string[]         // Derived from skillIds
  tags: string[]                // From API snippet.tags or manual
  writerId?: string             // Manual mapping
  bookIds?: string[]            // Manual mapping
  channelId: string             // YouTube channel ID
  channelName: string           // Channel name
}
```

### Manual vs. Automated Fields

**Automated (from API):**
- Video ID, URL, YouTube ID
- Title (English)
- Description (English)
- Thumbnail URL
- Duration
- Published date
- View count
- Tags (if available)

**Manual (still required):**
- Title (Persian translation)
- Description (Persian translation)
- Skill mappings (`skillIds`)
- Category mappings (`categoryIds`)
- Writer associations (`writerId`)
- Book associations (`bookIds`)

### Integration Strategy

1. **Hybrid Approach:**
   - Use API to fetch video metadata automatically
   - Manual curation for skill/category mappings
   - Manual translation for Persian content

2. **Update Frequency:**
   - Initial bulk import: Fetch all videos once
   - Incremental updates: Check for new videos periodically
   - Manual review: Curate skill mappings and translations

3. **Data Storage:**
   - Store API data in structured format (YAML/JSON)
   - Generate TypeScript files at build time
   - Version control for manual mappings

## Benefits of API Integration

1. **Automation:** Reduce manual data entry work
2. **Accuracy:** Ensure video links and metadata are up-to-date
3. **Statistics:** Access view counts, publish dates, and other metrics
4. **Scalability:** Easily handle channels with many videos
5. **Maintenance:** Automatic updates when new videos are published

## Next Steps

1. **Discussion with Khashayar:**
   - Present this API integration plan
   - Discuss cooperation opportunities
   - Get approval for API usage

2. **API Setup:**
   - Obtain YouTube Data API v3 credentials
   - Set up API key management
   - Implement quota monitoring

3. **Development:**
   - Create API integration scripts
   - Build data synchronization workflow
   - Implement caching strategy

4. **Testing:**
   - Test with KhashayarTalks channel
   - Validate data accuracy
   - Monitor quota usage

## References

- [YouTube Data API v3 Documentation](https://developers.google.com/youtube/v3)
- [YouTube Data API Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)
- [Channels API Reference](https://developers.google.com/youtube/v3/docs/channels)
- [PlaylistItems API Reference](https://developers.google.com/youtube/v3/docs/playlistItems)
- [Videos API Reference](https://developers.google.com/youtube/v3/docs/videos)

## Notes

- This plan will be shared with Khashayar as part of our cooperation discussion
- Current manual approach will continue until API integration is approved and implemented
- API integration is a future enhancement, not blocking current development

