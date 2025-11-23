/**
 * Parse ISO 8601 duration format (e.g., PT1H23M45S) to seconds
 * @param duration - ISO 8601 duration string (format: PT[hours]H[minutes]M[seconds]S)
 * @returns Duration in seconds, or 0 if invalid format
 * @example
 * parseIsoDuration('PT1H23M45S') // returns 5025 (1*3600 + 23*60 + 45)
 * parseIsoDuration('PT5M30S') // returns 330
 * parseIsoDuration('PT45S') // returns 45
 */
export function parseIsoDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return 0

    const hours = parseInt(match[1]) || 0
    const minutes = parseInt(match[2]) || 0
    const seconds = parseInt(match[3]) || 0

    return hours * 3600 + minutes * 60 + seconds
}

/**
 * Format seconds to ISO 8601 duration format
 * @param seconds - Duration in seconds
 * @returns ISO 8601 duration string (format: PT[H]H[M]M[S]S)
 * @example
 * formatToIsoDuration(5025) // returns 'PT1H23M45S'
 * formatToIsoDuration(330) // returns 'PT5M30S'
 * formatToIsoDuration(45) // returns 'PT45S'
 */
export function formatToIsoDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    let result = 'PT'
    if (hours > 0) result += `${hours}H`
    if (minutes > 0) result += `${minutes}M`
    if (secs > 0 || result === 'PT') result += `${secs}S`

    return result
}

/**
 * Format seconds to human-readable duration (MM:SS or HH:MM:SS)
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 * @example
 * formatDuration(5025) // returns '1:23:45'
 * formatDuration(330) // returns '5:30'
 * formatDuration(45) // returns '0:45'
 */
export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
}
