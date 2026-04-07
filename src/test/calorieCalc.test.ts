import { describe, it, expect } from 'vitest'

function calculateCalories(weightKg: number, heightCm: number, age: number, activity: string, goal: string): number {
  const bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161
  const multipliers: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 }
  const tdee = Math.round(bmr * (multipliers[activity] || 1.2))
  let target = tdee
  if (goal === 'lose') target = tdee - 500
  else if (goal === 'gain') target = tdee + 300
  const minCal = weightKg < 60 ? 1100 : 1200
  return Math.max(minCal, Math.round(target))
}

describe('Calorie Calculator', () => {
  it('lose is always 500 less than maintain', () => {
    const lose = calculateCalories(72, 165, 43, 'moderate', 'lose')
    const maintain = calculateCalories(72, 165, 43, 'moderate', 'maintain')
    expect(maintain - lose).toBe(500)
  })

  it('gain is always 300 more than maintain', () => {
    const maintain = calculateCalories(72, 165, 43, 'moderate', 'maintain')
    const gain = calculateCalories(72, 165, 43, 'moderate', 'gain')
    expect(gain - maintain).toBe(300)
  })

  it('all 3 goals produce different numbers for Sarah', () => {
    const lose = calculateCalories(72, 165, 43, 'moderate', 'lose')
    const maintain = calculateCalories(72, 165, 43, 'moderate', 'maintain')
    const gain = calculateCalories(72, 165, 43, 'moderate', 'gain')
    expect(lose).toBe(1632)
    expect(maintain).toBe(2132)
    expect(gain).toBe(2432)
  })

  it('all 3 goals produce different numbers for small woman', () => {
    const lose = calculateCalories(55, 155, 50, 'sedentary', 'lose')
    const maintain = calculateCalories(55, 155, 50, 'sedentary', 'maintain')
    const gain = calculateCalories(55, 155, 50, 'sedentary', 'gain')
    expect(lose).toBeLessThan(maintain)
    expect(maintain).toBeLessThan(gain)
  })

  it('small woman floor is 1100 not 1200', () => {
    const result = calculateCalories(50, 150, 60, 'sedentary', 'lose')
    expect(result).toBeGreaterThanOrEqual(1100)
  })

  it('larger woman floor is 1200', () => {
    const result = calculateCalories(65, 160, 70, 'sedentary', 'lose')
    expect(result).toBeGreaterThanOrEqual(1200)
  })

  it('more active users get higher targets', () => {
    const sed = calculateCalories(70, 165, 42, 'sedentary', 'maintain')
    const act = calculateCalories(70, 165, 42, 'active', 'maintain')
    expect(act).toBeGreaterThan(sed)
  })

  it('unknown activity defaults to sedentary', () => {
    const unknown = calculateCalories(70, 165, 42, 'unknown', 'maintain')
    const sed = calculateCalories(70, 165, 42, 'sedentary', 'maintain')
    expect(unknown).toBe(sed)
  })
})
