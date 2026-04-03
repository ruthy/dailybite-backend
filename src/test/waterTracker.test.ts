import { describe, it, expect } from 'vitest'

// Water toggle logic from WaterPage
function toggleGlass(currentGlasses: number, index: number): number {
  const tapping = index + 1
  return tapping === currentGlasses ? tapping - 1 : tapping
}

describe('Water Tracker', () => {
  it('fills to tapped glass when empty', () => {
    expect(toggleGlass(0, 0)).toBe(1) // tap glass 1 -> fill 1
    expect(toggleGlass(0, 4)).toBe(5) // tap glass 5 -> fill to 5
  })

  it('fills to tapped glass when partially filled', () => {
    expect(toggleGlass(3, 5)).toBe(6) // have 3, tap glass 6 -> fill to 6
  })

  it('unfills last glass when tapping the current count', () => {
    expect(toggleGlass(5, 4)).toBe(4) // have 5, tap glass 5 (index 4) -> goes to 4
  })

  it('resets to lower count when tapping below current', () => {
    expect(toggleGlass(5, 1)).toBe(2) // have 5, tap glass 2 -> fill to 2
  })

  it('fills all 8 glasses', () => {
    expect(toggleGlass(7, 7)).toBe(8) // have 7, tap glass 8 -> fill to 8
  })

  it('can unfill from 8 to 7', () => {
    expect(toggleGlass(8, 7)).toBe(7) // have 8, tap glass 8 -> unfill to 7
  })

  it('fills from 0 to 1 by tapping first glass', () => {
    expect(toggleGlass(0, 0)).toBe(1)
  })
})
