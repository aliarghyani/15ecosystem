# Story 8.3: Analysis Report Types & Data Models

**Epic:** Epic 8 - Video Transcript Data Analysis & Analytics  
**Status:** done  
**Story ID:** 8-3-analysis-report-types-data-models

## User Story

As a developer,
I want defined report types and data models,
So that I can structure analysis results consistently.

## Acceptance Criteria

**Given** I need to generate reports
**When** I define report types
**Then** I have:
- WordFrequencyReport type (word, count, percentage, videos)
- MentionReport type (term, count, videos, timestamps)
- TrendReport type (term, count over time, video dates)
- ComparisonReport type (compare multiple terms)
- TopWordsReport type (top N words with metadata)
- CategoryAnalysisReport type (analysis by category)
- SkillAnalysisReport type (analysis by skill)
- ReportOptions interface (configurable options)
- ReportMetadata interface (report metadata)

**Prerequisites:** Story 8.2

## Technical Requirements

### Report Types

**Location:** `app/types/reports.ts`

**Interfaces:**
- `WordFrequencyReport` - Word frequency with video references
- `MentionReport` - Term mentions with video details
- `TrendReport` - Term frequency over time
- `ComparisonReport` - Compare multiple terms
- `TopWordsReport` - Top N words report
- `CategoryAnalysisReport` - Analysis by category
- `SkillAnalysisReport` - Analysis by skill
- `ReportOptions` - Configurable report options
- `ReportMetadata` - Report metadata

### Features

- Consistent structure across all report types
- Video ID references for traceability
- Percentage calculations for context
- Date range support for time-based analysis
- Filtering options (category, skill, video IDs)
- Locale support (fa/en)
- Metadata for report tracking

## Tasks

- [x] Task 1: Create reports.ts type definitions file
- [x] Task 2: Define WordFrequencyReport interface
- [x] Task 3: Define MentionReport interface
- [x] Task 4: Define TrendReport interface
- [x] Task 5: Define ComparisonReport interface
- [x] Task 6: Define TopWordsReport interface
- [x] Task 7: Define CategoryAnalysisReport interface
- [x] Task 8: Define SkillAnalysisReport interface
- [x] Task 9: Define ReportOptions interface
- [x] Task 10: Define ReportMetadata interface
- [x] Task 11: Export types from main types index

## Implementation Notes

- All report types include video references for traceability
- Trend reports support time-based analysis
- Comparison reports enable multi-term analysis
- Category and skill reports enable filtered analysis
- Report options provide flexible configuration
- Metadata enables report tracking and caching

## Completed Features

- ✅ WordFrequencyReport type
- ✅ MentionReport type
- ✅ TrendReport type
- ✅ ComparisonReport type
- ✅ TopWordsReport type
- ✅ CategoryAnalysisReport type
- ✅ SkillAnalysisReport type
- ✅ ReportOptions interface
- ✅ ReportMetadata interface
- ✅ Type exports configured

