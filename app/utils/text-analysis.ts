/**
 * Text analysis utilities for processing video transcripts
 * 
 * Provides core functions for word frequency analysis, phrase detection,
 * mention counting, and text normalization for both Persian and English.
 */

/**
 * Options for text analysis operations
 */
export interface AnalysisOptions {
  /** Whether search should be case-sensitive (default: false) */
  caseSensitive?: boolean
  /** Whether to include stop words (default: true) */
  includeStopWords?: boolean
  /** Custom stop words list (overrides default) */
  stopWords?: string[]
  /** Whether to normalize text before analysis (default: true) */
  normalize?: boolean
  /** Locale for normalization ('fa' | 'en') */
  locale?: 'fa' | 'en'
}

/**
 * Options for word frequency analysis
 */
export interface FrequencyOptions extends AnalysisOptions {
  /** Minimum word length to include (default: 2) */
  minWordLength?: number
  /** Maximum number of results to return (default: unlimited) */
  limit?: number
  /** Sort order ('count' | 'alphabetical') */
  sortBy?: 'count' | 'alphabetical'
}

/**
 * Word frequency result
 */
export interface WordFrequency {
  /** The word */
  word: string
  /** Number of occurrences */
  count: number
  /** Percentage of total words */
  percentage: number
  /** Total word count in text */
  totalWords: number
}

/**
 * Mention result for a search term
 */
export interface MentionResult {
  /** The search term */
  term: string
  /** Number of occurrences */
  count: number
  /** Positions where term appears (character indices) */
  positions: number[]
  /** Context around each mention (optional) */
  contexts?: string[]
}

/**
 * Default stop words for English
 */
const ENGLISH_STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'will', 'with', 'the', 'this', 'but', 'they', 'have',
  'had', 'what', 'said', 'each', 'which', 'their', 'time', 'if',
  'up', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her',
  'would', 'make', 'like', 'into', 'him', 'has', 'two', 'more',
  'very', 'after', 'words', 'long', 'than', 'first', 'been', 'call',
  'who', 'oil', 'sit', 'now', 'find', 'down', 'day', 'did', 'get',
  'come', 'made', 'may', 'part'
])

/**
 * Default stop words for Persian
 */
const PERSIAN_STOP_WORDS = new Set([
  'و', 'در', 'به', 'از', 'که', 'این', 'است', 'را', 'با', 'تا',
  'برای', 'آن', 'یک', 'هم', 'یا', 'اما', 'اگر', 'چون', 'چرا',
  'چگونه', 'چه', 'کجا', 'کی', 'چند', 'همه', 'هیچ', 'بعضی',
  'همچنین', 'همین', 'همان', 'همین', 'همچنین', 'همچنین'
])

/**
 * Normalize text for analysis
 * Removes punctuation, normalizes whitespace, handles locale-specific normalization
 * 
 * @param text - Text to normalize
 * @param locale - Locale ('fa' | 'en')
 * @returns Normalized text
 */
export function normalizeText(text: string, locale: 'fa' | 'en' = 'fa'): string {
  let normalized = text
  
  // Remove common punctuation (keep Persian/Arabic characters)
  if (locale === 'en') {
    // English: remove punctuation, keep alphanumeric and spaces
    normalized = normalized.replace(/[^\w\s]/g, ' ')
  } else {
    // Persian: remove English punctuation, keep Persian/Arabic characters
    normalized = normalized.replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]/g, ' ')
  }
  
  // Normalize whitespace (multiple spaces to single space)
  normalized = normalized.replace(/\s+/g, ' ').trim()
  
  // Convert to lowercase for English (Persian doesn't have case)
  if (locale === 'en') {
    normalized = normalized.toLowerCase()
  }
  
  return normalized
}

/**
 * Tokenize text into words
 * 
 * @param text - Text to tokenize
 * @param locale - Locale ('fa' | 'en')
 * @returns Array of words
 */
export function tokenize(text: string, locale: 'fa' | 'en' = 'fa'): string[] {
  const normalized = normalizeText(text, locale)
  return normalized.split(/\s+/).filter((word) => word.length > 0)
}

/**
 * Count occurrences of a word in text
 * 
 * @param text - Text to search in
 * @param word - Word to count
 * @param options - Analysis options
 * @returns Number of occurrences
 */
export function countWordOccurrences(
  text: string,
  word: string,
  options: AnalysisOptions = {}
): number {
  const {
    caseSensitive = false,
    normalize = true,
    locale = 'fa'
  } = options
  
  let searchText = normalize ? normalizeText(text, locale) : text
  let searchWord = normalize ? normalizeText(word, locale) : word
  
  if (!caseSensitive && locale === 'en') {
    searchText = searchText.toLowerCase()
    searchWord = searchWord.toLowerCase()
  }
  
  // Use word boundaries for accurate counting
  const regex = new RegExp(`\\b${escapeRegex(searchWord)}\\b`, 'g')
  const matches = searchText.match(regex)
  
  return matches ? matches.length : 0
}

/**
 * Count occurrences of a phrase in text
 * 
 * @param text - Text to search in
 * @param phrase - Phrase to count
 * @param options - Analysis options
 * @returns Number of occurrences
 */
export function countPhraseOccurrences(
  text: string,
  phrase: string,
  options: AnalysisOptions = {}
): number {
  const {
    caseSensitive = false,
    normalize = true,
    locale = 'fa'
  } = options
  
  let searchText = normalize ? normalizeText(text, locale) : text
  let searchPhrase = normalize ? normalizeText(phrase, locale) : phrase
  
  if (!caseSensitive && locale === 'en') {
    searchText = searchText.toLowerCase()
    searchPhrase = searchPhrase.toLowerCase()
  }
  
  // Count non-overlapping occurrences
  let count = 0
  let index = 0
  
  while ((index = searchText.indexOf(searchPhrase, index)) !== -1) {
    count++
    index += searchPhrase.length
  }
  
  return count
}

/**
 * Get word frequency analysis for text
 * 
 * @param text - Text to analyze
 * @param options - Frequency options
 * @returns Array of WordFrequency results
 */
export function getWordFrequency(
  text: string,
  options: FrequencyOptions = {}
): WordFrequency[] {
  const {
    includeStopWords = true,
    stopWords,
    minWordLength = 2,
    limit,
    sortBy = 'count',
    locale = 'fa'
  } = options
  
  // Tokenize text
  const words = tokenize(text, locale)
  const totalWords = words.length
  
  // Get stop words set
  const stopWordsSet = stopWords
    ? new Set(stopWords.map((w) => normalizeText(w, locale)))
    : locale === 'fa'
    ? PERSIAN_STOP_WORDS
    : ENGLISH_STOP_WORDS
  
  // Count word frequencies
  const wordCounts = new Map<string, number>()
  
  words.forEach((word) => {
    const normalizedWord = normalizeText(word, locale)
    
    // Filter by minimum length
    if (normalizedWord.length < minWordLength) {
      return
    }
    
    // Filter stop words if needed
    if (!includeStopWords && stopWordsSet.has(normalizedWord)) {
      return
    }
    
    wordCounts.set(normalizedWord, (wordCounts.get(normalizedWord) || 0) + 1)
  })
  
  // Convert to WordFrequency array
  const frequencies: WordFrequency[] = Array.from(wordCounts.entries()).map(([word, count]) => ({
    word,
    count,
    percentage: (count / totalWords) * 100,
    totalWords,
  }))
  
  // Sort
  if (sortBy === 'count') {
    frequencies.sort((a, b) => b.count - a.count)
  } else {
    frequencies.sort((a, b) => a.word.localeCompare(b.word, locale === 'fa' ? 'fa' : 'en'))
  }
  
  // Apply limit
  return limit ? frequencies.slice(0, limit) : frequencies
}

/**
 * Find mentions of search terms in text
 * 
 * @param text - Text to search in
 * @param searchTerms - Array of terms to search for
 * @param options - Analysis options
 * @returns Array of MentionResult objects
 */
export function findMentions(
  text: string,
  searchTerms: string[],
  options: AnalysisOptions = {}
): MentionResult[] {
  const {
    caseSensitive = false,
    normalize = true,
    locale = 'fa'
  } = options
  
  let searchText = normalize ? normalizeText(text, locale) : text
  
  if (!caseSensitive && locale === 'en') {
    searchText = searchText.toLowerCase()
  }
  
  return searchTerms.map((term) => {
    let searchTerm = normalize ? normalizeText(term, locale) : term
    
    if (!caseSensitive && locale === 'en') {
      searchTerm = searchTerm.toLowerCase()
    }
    
    const positions: number[] = []
    let index = 0
    
    // Find all positions
    while ((index = searchText.indexOf(searchTerm, index)) !== -1) {
      positions.push(index)
      index += searchTerm.length
    }
    
    return {
      term,
      count: positions.length,
      positions,
    }
  })
}

/**
 * Get top N words by frequency
 * 
 * @param text - Text to analyze
 * @param topN - Number of top words to return
 * @param options - Frequency options
 * @returns Array of top WordFrequency results
 */
export function getTopWords(
  text: string,
  topN: number = 10,
  options: FrequencyOptions = {}
): WordFrequency[] {
  return getWordFrequency(text, { ...options, limit: topN, sortBy: 'count' })
}

/**
 * Escape special regex characters
 * 
 * @param str - String to escape
 * @returns Escaped string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

