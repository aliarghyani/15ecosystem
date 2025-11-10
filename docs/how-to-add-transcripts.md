# How to Add Video Transcripts

This guide explains how to add transcripts for videos using the YAML file approach.

## File Location

**Persian Transcripts:** `app/data/transcripts/fa/`  
**English Transcripts:** `app/data/transcripts/en/`

## File Naming Convention

**Use the Persian video title as the filename:**

- Example: `۷ عادت برای افزایش سلامت، قدرت و طول عمر.yml`
- The script will automatically match the title to the video ID from `parsed-videos.json`

## File Format

You can use either format:

### Option 1: Plain Text (Simplest)

Just paste your transcript text directly in the file:

```yaml
آقای دکتر دیوید سینکلر استاد ژنتیک دانشگاه هاروارد...
```

### Option 2: YAML Format

```yaml
transcript: |
  آقای دکتر دیوید سینکلر استاد ژنتیک دانشگاه هاروارد...
  Your transcript text here...
  Can be multiple lines.
```

## Workflow

1. **Create a YAML file** with the Persian video title as filename
   - Example: `app/data/transcripts/fa/۷ عادت برای افزایش سلامت، قدرت و طول عمر.yml`

2. **Paste your transcript** into the file (plain text or YAML format)

3. **Run the generation script:**
   ```bash
   pnpm generate:transcripts
   ```

4. The script will:
   - Match the filename (title) to video ID from `parsed-videos.json`
   - Calculate word/character counts
   - Generate TypeScript files in `app/data/transcripts/fa/index.ts` and `app/data/transcripts/en/index.ts`

## Important Notes

- **File names must match exactly** with the Persian title in `parsed-videos.json`
- If a file can't be matched, the script will warn you and skip it
- The script supports both plain text and YAML format files
- Transcripts are stored by video ID in the generated TypeScript files

## Example

For video with title "۷ عادت برای افزایش سلامت، قدرت و طول عمر":

1. Create file: `app/data/transcripts/fa/۷ عادت برای افزایش سلامت، قدرت و طول عمر.yml`
2. Add transcript text
3. Run `pnpm generate:transcripts`
4. The transcript will be available in `app/data/transcripts/fa/index.ts` with video ID `hxnS40NolrA`

