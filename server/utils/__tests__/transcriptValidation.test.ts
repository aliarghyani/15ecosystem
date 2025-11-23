import { describe, it, expect } from 'vitest'
import { validateTranscript, validateTranscriptStructure } from '../transcriptValidation'

describe('transcriptValidation', () => {
    describe('validateTranscript', () => {
        it('should validate a valid transcript', () => {
            const validTranscript = {
                videoId: 'test123',
                title: 'Test Video',
                fullText: 'This is a test transcript with enough content.',
                segments: Array.from({ length: 15 }, (_, i) => ({
                    start: i * 10,
                    end: (i + 1) * 10,
                    text: `Segment ${i + 1} text`
                })),
                source: 'generated' as const,
                language: 'en',
                fetchedAt: new Date().toISOString()
            }

            const result = validateTranscript(validTranscript)

            expect(result.valid).toBe(true)
            expect(result.errors).toHaveLength(0)
            expect(result.stats.segmentCount).toBe(15)
            expect(result.stats.textLength).toBeGreaterThan(0)
        })

        it('should detect missing videoId', () => {
            const invalidTranscript = {
                title: 'Test Video',
                fullText: 'Test content',
                segments: []
            }

            const result = validateTranscript(invalidTranscript)

            expect(result.valid).toBe(false)
            expect(result.errors).toContain('Missing or invalid videoId field')
        })

        it('should detect empty fullText', () => {
            const invalidTranscript = {
                videoId: 'test123',
                title: 'Test Video',
                fullText: '   ',
                segments: []
            }

            const result = validateTranscript(invalidTranscript)

            expect(result.valid).toBe(false)
            expect(result.errors).toContain('fullText is empty')
        })

        it('should warn about low segment count', () => {
            const transcript = {
                videoId: 'test123',
                title: 'Test Video',
                fullText: 'Short transcript',
                segments: [
                    { start: 0, end: 5, text: 'Short' }
                ],
                source: 'generated' as const,
                language: 'en',
                fetchedAt: new Date().toISOString()
            }

            const result = validateTranscript(transcript)

            expect(result.warnings.length).toBeGreaterThan(0)
            expect(result.warnings[0]).toContain('Low segment count')
        })

        it('should detect invalid segment structure', () => {
            const transcript = {
                videoId: 'test123',
                title: 'Test Video',
                fullText: 'Test',
                segments: [
                    { start: 0, end: 5 } // Missing text
                ]
            }

            const result = validateTranscript(transcript)

            expect(result.valid).toBe(false)
            expect(result.errors.some(e => e.includes('missing or invalid text'))).toBe(true)
        })
    })

    describe('validateTranscriptStructure', () => {
        it('should return true for valid structure', () => {
            const data = {
                videoId: 'test123',
                segments: [],
                fullText: 'test'
            }

            expect(validateTranscriptStructure(data)).toBe(true)
        })

        it('should return false for invalid structure', () => {
            expect(validateTranscriptStructure(null)).toBe(false)
            expect(validateTranscriptStructure({})).toBe(false)
            expect(validateTranscriptStructure({ videoId: 'test' })).toBe(false)
        })
    })
})
