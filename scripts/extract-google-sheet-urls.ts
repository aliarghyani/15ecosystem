#!/usr/bin/env tsx

/**
 * YouTube URL Extraction from Google Sheets
 *
 * This script extracts YouTube URLs from Google Sheets containing multiple playlist tabs.
 * It processes each tab, extracts URLs, deduplicates them, and outputs a clean links.txt file.
 *
 * Usage:
 *   tsx scripts/extract-google-sheet-urls.ts
 *
 * Environment Variables:
 *   GOOGLE_SHEETS_API_KEY - API key for Google Sheets API
 *   GOOGLE_SHEETS_SPREADSHEET_ID - ID of the spreadsheet to process
 *   GOOGLE_SERVICE_ACCOUNT_KEY - Path to service account JSON file (alternative to API key)
 */

import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '1fvXSdch0HtATtpFLrDPFSstTBsismJ324-n1opuUpHk';
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const SERVICE_ACCOUNT_KEY_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
const OUTPUT_FILE = 'links.txt';

// Types
interface SheetData {
  title: string;
  url: string;
  uploadDate: string;
  views: string;
}

interface ProcessingStats {
  tabsProcessed: number;
  totalUrlsFound: number;
  uniqueUrls: number;
  invalidUrlsSkipped: number;
  errors: string[];
}

// YouTube URL validation
function isValidYouTubeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    const urlObj = new URL(url);

    // Check for YouTube domains
    if (!urlObj.hostname.includes('youtube.com') && !urlObj.hostname.includes('youtu.be')) {
      return false;
    }

    // Check for video ID parameter
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.has('v') || urlObj.pathname.includes('/watch');
    } else if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.length > 1; // youtu.be/VIDEO_ID
    }

    return false;
  } catch {
    return false;
  }
}

function extractVideoId(url: string): string | null {
  if (!url) return null;

  try {
    const urlObj = new URL(url);

    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    } else if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1); // Remove leading slash
    }
  } catch {
    return null;
  }

  return null;
}

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Google Sheets API functions
async function authenticateGoogleSheets() {
  if (SERVICE_ACCOUNT_KEY_PATH) {
    // Service account authentication
    const keyFile = JSON.parse(fs.readFileSync(path.resolve(SERVICE_ACCOUNT_KEY_PATH), 'utf-8'));
    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    return google.sheets({ version: 'v4', auth });
  } else if (API_KEY) {
    // API key authentication
    const auth = new google.auth.GoogleAuth({
      apiKey: API_KEY,
    });
    return google.sheets({ version: 'v4', auth });
  } else {
    throw new Error('No authentication method provided. Set GOOGLE_SHEETS_API_KEY or GOOGLE_SERVICE_ACCOUNT_KEY environment variable.');
  }
}

async function getSpreadsheetMetadata(sheets: any) {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    return response.data.sheets?.map(sheet => sheet.properties?.title).filter(Boolean) as string[];
  } catch (error) {
    console.error('Error fetching spreadsheet metadata:', error);
    throw error;
  }
}

async function getSheetData(sheets: any, sheetName: string): Promise<SheetData[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${sheetName}'!A4:D`, // Start from row 4 (skip header)
    });

    const rows = response.data.values || [];
    const sheetData: SheetData[] = [];

    for (const row of rows) {
      if (row.length >= 4) {
        const [title, url, uploadDate, views] = row;
        if (url && typeof url === 'string') {
          sheetData.push({
            title: title || '',
            url: url.trim(),
            uploadDate: uploadDate || '',
            views: views || ''
          });
        }
      }
    }

    return sheetData;
  } catch (error) {
    console.error(`Error reading sheet "${sheetName}":`, error);
    throw error;
  }
}

// CSV processing as fallback
function processCSVFile(filePath: string): SheetData[] {
  const csvContent = fs.readFileSync(filePath, 'utf-8');
  const lines = csvContent.split('\n');
  const sheetData: SheetData[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const columns = line.split(',');
    if (columns.length >= 4) {
      const [title, url, uploadDate, views] = columns.map(col => col.replace(/^"|"$/g, '').trim());
      if (url) {
        sheetData.push({
          title: title || '',
          url,
          uploadDate: uploadDate || '',
          views: views || ''
        });
      }
    }
  }

  return sheetData;
}

// Main processing function
async function extractYouTubeUrls(): Promise<void> {
  const stats: ProcessingStats = {
    tabsProcessed: 0,
    totalUrlsFound: 0,
    uniqueUrls: 0,
    invalidUrlsSkipped: 0,
    errors: []
  };

  console.log('🚀 Starting YouTube URL extraction from Google Sheets');
  console.log(`📊 Spreadsheet ID: ${SPREADSHEET_ID}`);
  console.log('');

  try {
    // Authenticate and get sheets client
    const sheets = await authenticateGoogleSheets();
    console.log('✅ Google Sheets API authenticated');

    // Get all sheet names
    const sheetNames = await getSpreadsheetMetadata(sheets);
    if (!sheetNames || sheetNames.length === 0) {
      throw new Error('No sheets found in spreadsheet');
    }

    console.log(`📋 Found ${sheetNames.length} sheets: ${sheetNames.join(', ')}`);
    console.log('');

    const allUrls = new Set<string>();
    const invalidUrls: string[] = [];

    // Process each sheet
    for (let i = 0; i < sheetNames.length; i++) {
      const sheetName = sheetNames[i];
      console.log(`📄 Processing sheet ${i + 1}/${sheetNames.length}: "${sheetName}"`);

      try {
        const sheetData = await getSheetData(sheets, sheetName);
        stats.tabsProcessed++;

        console.log(`   Found ${sheetData.length} rows in "${sheetName}"`);

        let validUrlsInSheet = 0;
        for (const row of sheetData) {
          stats.totalUrlsFound++;

          if (isValidYouTubeUrl(row.url)) {
            allUrls.add(row.url);
            validUrlsInSheet++;
          } else {
            invalidUrls.push(`${sheetName}: ${row.url}`);
            stats.invalidUrlsSkipped++;
          }
        }

        console.log(`   ✓ Valid YouTube URLs: ${validUrlsInSheet}`);
        console.log(`   ✗ Invalid URLs: ${sheetData.length - validUrlsInSheet}`);
        console.log(`   📊 Total unique URLs so far: ${allUrls.size}`);
        console.log('');

      } catch (error) {
        const errorMsg = `Failed to process sheet "${sheetName}": ${error}`;
        console.error(`❌ ${errorMsg}`);
        stats.errors.push(errorMsg);
        console.log('');
      }
    }

    // Sort URLs alphabetically
    const sortedUrls = Array.from(allUrls).sort();

    // Write to output file
    const outputContent = sortedUrls.join('\n') + '\n';
    fs.writeFileSync(OUTPUT_FILE, outputContent, 'utf-8');

    stats.uniqueUrls = sortedUrls.length;

    // Print summary
    console.log('🎉 Processing completed!');
    console.log('');
    console.log('📊 SUMMARY:');
    console.log(`   📄 Sheets processed: ${stats.tabsProcessed}`);
    console.log(`   🔗 Total URLs found: ${stats.totalUrlsFound}`);
    console.log(`   ✨ Unique URLs: ${stats.uniqueUrls}`);
    console.log(`   🚫 Invalid URLs skipped: ${stats.invalidUrlsSkipped}`);
    console.log(`   💾 Output file: ${OUTPUT_FILE}`);
    console.log('');

    if (stats.errors.length > 0) {
      console.log('⚠️  ERRORS:');
      stats.errors.forEach(error => console.log(`   - ${error}`));
      console.log('');
    }

    if (invalidUrls.length > 0 && invalidUrls.length <= 10) {
      console.log('🚫 INVALID URLs (first 10):');
      invalidUrls.slice(0, 10).forEach(url => console.log(`   - ${url}`));
      console.log('');
    } else if (invalidUrls.length > 10) {
      console.log(`🚫 INVALID URLs: ${invalidUrls.length} total (showing first 10)`);
      invalidUrls.slice(0, 10).forEach(url => console.log(`   - ${url}`));
      console.log('');
    }

    console.log('✅ YouTube URL extraction completed successfully!');

  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

// CSV fallback processing
function processCSVFiles(): void {
  console.log('📁 Processing CSV files (fallback mode)');
  console.log('');

  const csvFiles = fs.readdirSync('.')
    .filter(file => file.endsWith('.csv') && file.includes('khashayar'))
    .sort();

  if (csvFiles.length === 0) {
    console.error('❌ No CSV files found. Export sheets as CSV from Google Sheets first.');
    process.exit(1);
  }

  console.log(`📋 Found ${csvFiles.length} CSV files: ${csvFiles.join(', ')}`);
  console.log('');

  const allUrls = new Set<string>();
  const stats: ProcessingStats = {
    tabsProcessed: 0,
    totalUrlsFound: 0,
    uniqueUrls: 0,
    invalidUrlsSkipped: 0,
    errors: []
  };

  for (const csvFile of csvFiles) {
    console.log(`📄 Processing ${csvFile}`);

    try {
      const sheetData = processCSVFile(csvFile);
      stats.tabsProcessed++;
      stats.totalUrlsFound += sheetData.length;

      let validUrls = 0;
      for (const row of sheetData) {
        if (isValidYouTubeUrl(row.url)) {
          allUrls.add(row.url);
          validUrls++;
        } else {
          stats.invalidUrlsSkipped++;
        }
      }

      console.log(`   ✓ Valid URLs: ${validUrls}, Invalid: ${sheetData.length - validUrls}`);

    } catch (error) {
      console.error(`❌ Error processing ${csvFile}:`, error);
      stats.errors.push(`Error processing ${csvFile}: ${error}`);
    }
  }

  // Sort and save
  const sortedUrls = Array.from(allUrls).sort();
  const outputContent = sortedUrls.join('\n') + '\n';
  fs.writeFileSync(OUTPUT_FILE, outputContent, 'utf-8');

  stats.uniqueUrls = sortedUrls.length;

  console.log('');
  console.log('🎉 CSV processing completed!');
  console.log(`📊 Unique URLs: ${stats.uniqueUrls}`);
  console.log(`💾 Output file: ${OUTPUT_FILE}`);
}

// Main execution
if (process.argv[1]?.includes('extract-google-sheet-urls.ts')) {
  console.log('🚀 Starting YouTube URL extraction script');
  console.log('Arguments:', process.argv.slice(2));
  console.log('');

  const useCSV = process.argv.includes('--csv');

  if (useCSV) {
    console.log('📁 Using CSV mode (fallback)');
    processCSVFiles();
  } else {
    console.log('🌐 Using Google Sheets API mode');
    extractYouTubeUrls().catch(error => {
      console.error('💥 Script failed:', error.message);
      process.exit(1);
    });
  }
}

export { extractYouTubeUrls, processCSVFiles, isValidYouTubeUrl, extractVideoId };
