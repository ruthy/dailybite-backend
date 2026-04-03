import { describe, it, expect } from 'vitest'

// Mifflin-St Jeor formula for women
function calculateCalories(
  weightKg: number,
  heightCm: number,
  age: number,
  activity: string,
  goal: string
): number {
  const bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161
  const multipliers: Record<string, number> = {
    sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9
  }
  const tdee = bmr * (multipliers[activity] || 1.2)
  const adjustment = goal === 'lose' ? -500 : goal === 'gain' ? 250 : 0
  return Math.max(1200, Math.round(tdee + adjustment))
}

describe('Calorie Calculator', () => {
  it('calculates correct target for typical user wanting to lose weight', () => {
    // Woman, 70kg, 165cm, 42 years old, moderate activity, lose weight
    const result = calculateCalories(70, 165, 42, 'moderate', 'lose')
    expect(result).toBeGreaterThan(1200)
    expect(result).toBeLessThan(2000)
  })

  it('never goes below 1200 calories', () => {
    const result = calculateCalories(40, 140, 80, 'sedentary', 'lose')
    expect(result).toBe(1200)
  })

  it('returns higher for maintain than lose', () => {
    const lose = calculateCalories(70, 165, 42, 'moderate', 'lose')
    const maintain = calculateCalories(70, 165, 42, 'moderate', 'maintain')
    expect(maintain).toBeGreaterThan(lose)
    expect(maintain - lose).toBe(500)
  })

  it('returns higher for more active users', () => {
    const sedentary = calculateCalories(70, 165, 42, 'sedentary', 'maintain')
    const active = calculateCalories(70, 165, 42, 'active', 'maintain')
    expect(active).toBeGreaterThan(sedentary)
  })

  it('returns higher for gain than maintain', () => {
    const maintain = calculateCalories(70, 165, 42, 'moderate', 'maintain')
    const gain = calculateCalories(70, 165, 42, 'moderate', 'gain')
    expect(gain - maintain).toBe(250)
  })

  it('handles unknown activity level by defaulting to sedentary', () => {
    const unknown = calculateCalories(70, 165, 42, 'unknown', 'maintain')
    const sedentary = calculateCalories(70, 165, 42, 'sedentary', 'maintain')
    expect(unknown).toBe(sedentary)
  })
})
