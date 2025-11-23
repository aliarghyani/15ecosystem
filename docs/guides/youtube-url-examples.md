# YouTube URL Examples and Parsing

**Date:** 2025-01-15  
**Purpose:** Document YouTube URL formats and parsing logic

## Supported URL Formats

### Format 1: Short URL (youtu.be)
```
https://youtu.be/hxnS40NolrA?si=D-AT3SQGC0gADEwX
```
- Video ID: `hxnS40NolrA`
- Pattern: `youtu.be/{VIDEO_ID}`

### Format 2: Standard URL (youtube.com/watch)
```
https://www.youtube.com/watch?v=IFoDg0FJwnk&si=mtudR5CBN6FN08jC
```
- Video ID: `IFoDg0FJwnk`
- Pattern: `youtube.com/watch?v={VIDEO_ID}`

### Format 3: Embed URL (youtube.com/embed)
```
https://www.youtube.com/embed/hxnS40NolrA
```
- Video ID: `hxnS40NolrA`
- Pattern: `youtube.com/embed/{VIDEO_ID}`

## Video ID Extraction

**Function:** `extractYouTubeVideoId(url: string): string | null`

**Logic:**
1. Check for `youtu.be/{ID}` pattern
2. Check for `youtube.com/watch?v={ID}` pattern
3. Check for `youtube.com/embed/{ID}` pattern
4. Return video ID or null if invalid

## Thumbnail URL Generation

**Function:** `getYouTubeThumbnail(videoId: string, quality?: string): string`

**Base URL:** `https://img.youtube.com/vi/{VIDEO_ID}/{quality}.jpg`

**Quality Options:**
- `default` - 120x90
- `mqdefault` - 320x180
- `hqdefault` - 480x360 (recommended default)
- `sddefault` - 640x480
- `maxresdefault` - 1280x720 (if available)

**Example:**
```
Video ID: hxnS40NolrA
Thumbnail URL: https://img.youtube.com/vi/hxnS40NolrA/hqdefault.jpg
```

## Example Videos

### Video 1
- **URL:** https://youtu.be/hxnS40NolrA?si=D-AT3SQGC0gADEwX
- **Video ID:** hxnS40NolrA
- **Thumbnail:** https://img.youtube.com/vi/hxnS40NolrA/hqdefault.jpg

### Video 2
- **URL:** https://youtu.be/IFoDg0FJwnk?si=mtudR5CBN6FN08jC
- **Video ID:** IFoDg0FJwnk
- **Thumbnail:** https://img.youtube.com/vi/IFoDg0FJwnk/hqdefault.jpg

## Implementation Notes

- Store full YouTube URL in data files
- Extract video ID at runtime or build time
- Generate thumbnail URL from video ID
- Use `hqdefault` quality as default (good balance of quality and size)
- Fallback to `mqdefault` if `hqdefault` not available

