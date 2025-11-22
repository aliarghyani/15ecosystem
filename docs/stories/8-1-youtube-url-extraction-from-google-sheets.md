# Story 8.1: YouTube URL Extraction from Google Sheets

**Epic:** Epic 8 - Video Transcript Data Analysis & Analytics
**Status:** done
**Story ID:** 8-1-youtube-url-extraction-from-google-sheets

## User Story

As a content manager,
I want to extract YouTube URLs from Google Sheets containing multiple playlists,
So that I can process transcripts for bulk video analysis.

## Acceptance Criteria

**Given** I have a Google Sheet with multiple playlist tabs
**When** I extract URLs from all tabs
**Then** I have:
- All YouTube URLs extracted from each sheet tab
- URLs deduplicated across all tabs
- URLs sorted alphabetically
- Single file containing all unique URLs (one per line)
- URL validation (proper YouTube format)
- Error handling for invalid or missing data
- Progress reporting for large datasets (~100+ videos)

**Prerequisites:** None (can start in parallel with other data preparation)

## Technical Requirements

### Script Location
**Location:** `scripts/extract-google-sheet-urls.ts`

### Input Options
- **Google Sheets API approach:**
  - Use Google Sheets API v4
  - Authentication via service account or OAuth
  - Read spreadsheet by ID

- **CSV Export approach:**
  - Manual CSV export from Google Sheets
  - Process CSV files directly
  - Support both approaches for flexibility

### Data Processing

**Sheet Structure:**
- Each tab represents a playlist
- First row (A1): "Data from: playlist_url"
- Data rows start from row 4
- Columns: Title | URL | Upload Date | Views
- URL column is column B (index 1)

**URL Validation:**
- Must be valid YouTube URL format
- Support both youtube.com and youtu.be domains
- Extract video ID from URL
- Handle playlist URLs vs individual video URLs
- Filter out invalid or malformed URLs

### Output Format

**File:** `links.txt`
**Format:**
```
https://www.youtube.com/watch?v=VIDEO_ID_1
https://www.youtube.com/watch?v=VIDEO_ID_2
https://www.youtube.com/watch?v=VIDEO_ID_3
...
```

**Requirements:**
- One URL per line
- Alphabetically sorted
- No duplicates
- Valid YouTube URLs only
- UTF-8 encoding

### Error Handling

**Invalid Data:**
- Missing URL column
- Empty cells
- Non-YouTube URLs
- Malformed URLs

**API Errors:**
- Authentication failures
- Rate limiting
- Network timeouts
- Invalid spreadsheet ID

**Recovery:**
- Skip invalid rows with warnings
- Continue processing other tabs
- Generate error summary
- Partial success handling

### Progress Reporting

**Console Output:**
- Processing tab X of Y
- Found N URLs in current tab
- Total unique URLs so far: M
- Errors: Z invalid URLs skipped

**Summary Report:**
- Total tabs processed
- Total URLs found
- Unique URLs after deduplication
- Invalid URLs skipped
- Processing time

## Tasks

- [x] Task 1: Set up Google Sheets API authentication
- [x] Task 2: Create TypeScript interfaces for sheet data
- [x] Task 3: Implement sheet reading functionality
- [x] Task 4: Add URL extraction and validation logic
- [x] Task 5: Implement deduplication and sorting
- [x] Task 6: Create links.txt output file generation
- [x] Task 7: Add error handling and logging
- [x] Task 8: Implement progress reporting
- [x] Task 9: Add CSV fallback processing option
- [x] Task 10: Create configuration for spreadsheet ID
- [x] Task 11: Add package.json script integration
- [x] Task 12: Test script execution and error handling

## Implementation Notes

- Support both API and CSV approaches for flexibility
- Robust error handling for real-world data quality issues
- Progress feedback important for large datasets
- Output format compatible with yt-dlp input requirements
- Consider rate limiting and API quotas for large spreadsheets
- Future enhancement: support for OAuth flow if needed

## Configuration

**Environment Variables:**
- `GOOGLE_SHEETS_API_KEY` - For API access
- `GOOGLE_SHEETS_SPREADSHEET_ID` - Target spreadsheet
- `GOOGLE_SERVICE_ACCOUNT_KEY` - Path to service account JSON

**Default Values:**
- Spreadsheet ID from the provided Google Sheet URL
- API key from environment or service account
- Output file: `links.txt` in project root

## Completed Features

- ✅ Google Sheets API authentication framework
- ✅ TypeScript interfaces for sheet data processing
- ✅ Sheet reading functionality with proper error handling
- ✅ YouTube URL validation and extraction logic
- ✅ Deduplication and alphabetical sorting
- ✅ Clean links.txt output file generation
- ✅ Comprehensive error handling and logging
- ✅ Progress reporting for large datasets
- ✅ CSV fallback processing option
- ✅ Configuration for spreadsheet ID
- ✅ Package.json script integration (`pnpm run extract:urls`)
- ✅ Script execution testing and error handling
- ✅ ES module compatibility for modern Node.js
- ✅ Cross-platform path handling (Windows/Unix)
