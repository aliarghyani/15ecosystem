# YAML Schema for Videos

**Purpose:** Define the structure for video data entry in YAML files

## Video Schema

```yaml
videos:
  - id: "hxnS40NolrA"  # YouTube video ID
    youtubeUrl: "https://youtu.be/hxnS40NolrA?si=D-AT3SQGC0gADEwX"  # Full YouTube URL
    title:
      fa: "عنوان ویدیو به فارسی"
      en: "Video Title in English"
    description:
      fa: "توضیحات ویدیو به فارسی"
      en: "Video description in English"
    duration: 1980  # Duration in seconds (optional)
    publishedAt: "2024-01-15T10:00:00Z"  # ISO date string (optional)
    viewCount: 50000  # View count (optional)
    playlistId: "PLxxxxx"  # Playlist ID (optional)
    skillIds: [1, 2, 3]  # Related skill IDs (1-15)
    categoryIds: ["health"]  # Related category IDs (health, identity, career)
    tags: ["sleep", "health"]  # Tag slugs (optional)
    writerId: "matthew-walker"  # Writer ID if video features a writer (optional)
    bookIds: ["why-we-sleep-matthew-walker"]  # Related book IDs (optional)
    channelId: "UCxxxxx"  # YouTube channel ID
    channelName: "KhashayarTalks"  # Channel name
```

## Playlist Schema

```yaml
playlists:
  - id: "PLxxxxx"  # YouTube playlist ID
    youtubeId: "PLxxxxx"  # Same as id
    title:
      fa: "عنوان پلی لیست به فارسی"
      en: "Playlist Title in English"
    description:
      fa: "توضیحات پلی لیست به فارسی"
      en: "Playlist description in English"
    thumbnail: "https://img.youtube.com/vi/xxxxx/hqdefault.jpg"  # Playlist thumbnail
    videoCount: 6  # Number of videos in playlist
    videoIds: ["hxnS40NolrA", "IFoDg0FJwnk"]  # Array of video IDs
    skillIds: [1, 2]  # Related skill IDs
    categoryIds: ["health"]  # Related category IDs
    tags: ["sleep", "focus"]  # Tag slugs (optional)
    channelId: "UCxxxxx"  # YouTube channel ID
    channelName: "KhashayarTalks"  # Channel name
```

## Example Video Entry

```yaml
videos:
  - id: "hxnS40NolrA"
    youtubeUrl: "https://youtu.be/hxnS40NolrA?si=D-AT3SQGC0gADEwX"
    title:
      fa: "عادت برای افزایش سلامت، قدرت و طول عمر"
      en: "Habits for increasing health, strength, and longevity"
    description:
      fa: "ویدیو درباره عادات سالم برای افزایش طول عمر"
      en: "Video about healthy habits for increasing longevity"
    skillIds: [6]
    categoryIds: ["health"]
    tags: ["longevity", "health"]
    channelId: "UCxxxxx"
    channelName: "KhashayarTalks"
```

## Notes

- Video ID is extracted from `youtubeUrl` automatically
- Thumbnail URL is generated from video ID automatically
- Skill IDs must be between 1 and 15
- Category IDs must be: `health`, `identity`, or `career`
- Tags should reference existing tag slugs
- Writer IDs should reference existing writer slugs
- Book IDs should reference existing book slugs

