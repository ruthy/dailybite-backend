import { describe, it, expect } from 'vitest'

// YouTube ID extraction from WorkoutsPage
function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

describe('YouTube Embed', () => {
  it('extracts ID from standard watch URL', () => {
    expect(getYouTubeId('https://www.youtube.com/watch?v=4pKly2JojMw')).toBe('4pKly2JojMw')
  })

  it('extracts ID from short URL', () => {
    expect(getYouTubeId('https://youtu.be/4pKly2JojMw')).toBe('4pKly2JojMw')
  })

  it('extracts ID from URL with extra params', () => {
    expect(getYouTubeId('https://www.youtube.com/watch?v=4pKly2JojMw&t=30s')).toBe('4pKly2JojMw')
  })

  it('returns null for empty string', () => {
    expect(getYouTubeId('')).toBeNull()
  })

  it('returns null for non-YouTube URL', () => {
    expect(getYouTubeId('https://vimeo.com/12345')).toBeNull()
  })
})
