# yt-dlp Setup Guide

## Installation

### Windows
```powershell
# Using winget
winget install yt-dlp

# OR using scoop
scoop install yt-dlp

# OR download from GitHub
# Download from: https://github.com/yt-dlp/yt-dlp/releases
# Add to PATH
```

### Verify Installation
```powershell
yt-dlp --version
```

## Usage

### Fetch Transcript for a Single Video
```http
GET /api/youtube/transcript?videoId=VIDEO_ID&title=Video+Title&language=en
```

### Get Transcript Stats
```http
GET /api/youtube/transcript-stats
```

Response:
```json
{
  "total": 10,
  "available": 8,
  "unavailable": 2,
  "generated": 6,
  "manual": 2,
  "directory": "E:\\personal\\15ecosystem\\server\\data\\transcripts"
}
```

### Batch Fetch Transcripts
```http
POST /api/youtube/transcript-batch
Content-Type: application/json

{
  "videoIds": ["VIDEO_ID_1", "VIDEO_ID_2", "VIDEO_ID_3"],
  "language": "en"
}
```

Response:
```json
{
  "total": 3,
  "processed": 2,
  "skipped": 1,
  "failed": 0,
  "results": [
    { "videoId": "VIDEO_ID_1", "status": "success", "segments": 145 },
    { "videoId": "VIDEO_ID_2", "status": "success", "segments": 203 }
  ]
}
```

## Storage

Transcripts are stored in: `server/data/transcripts/`

Each transcript is saved as: `{VIDEO_ID}.json`

### Transcript Format
```json
{
  "videoId": "hxnS40NolrA",
  "title": "Video Title",
  "fetchedAt": "2025-11-22T18:00:00Z",
  "source": "generated",
  "language": "en",
  "segments": [
    {
      "start": 0.0,
      "end": 4.5,
      "text": "Welcome to the video..."
    }
  ],
  "fullText": "Welcome to the video..."
}
```

## Notes

- Transcripts are cached permanently until manually deleted
- If a transcript is unavailable, it's marked with `source: "unavailable"` to avoid re-fetching
- The system prefers manual captions over auto-generated when available
- Batch fetching includes a 1-second delay between requests to avoid overwhelming yt-dlp
