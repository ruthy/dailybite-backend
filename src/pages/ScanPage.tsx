import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/common/PageHeader'
import './ScanPage.css'

interface FoodItem {
  name: string
  portion: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

const API_URL = import.meta.env.VITE_API_URL || ''

export default function ScanPage() {
  const { user } = useAuth()
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState<FoodItem[] | null>(null)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleScan() {
    try {
      setError('')
      setScanning(true)
      setSaved(false)

      // Use Capacitor Camera plugin
      const { Camera } = await import('@capacitor/camera')
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: (await import('@capacitor/camera')).CameraResultType.Base64,
        source: (await import('@capacitor/camera')).CameraSource.Camera,
      })

      if (!photo.base64String) {
        setScanning(false)
        return
      }

      // Upload to Supabase Storage
      const fileName = `${user!.id}/${Date.now()}.jpg`
      const { error: uploadError } = await supabase.storage
        .from('meal-photos')
        .upload(fileName, decode(photo.base64String), { contentType: 'image/jpeg' })

      if (uploadError) throw uploadError

      const { data: urlData } = await supabase.storage.from('meal-photos').createSignedUrl(fileName, 3600)

      // Call API for AI scan
      const response = await fetch(`${API_URL}/api/scan-plate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ imageUrl: urlData?.signedUrl })
      })

      if (!response.ok) throw new Error('Scan failed')
      const data = await response.json()
      setResults(data.items)
    } catch (err: any) {
      setError(err.message || 'Failed to scan. Try again.')
    } finally {
      setScanning(false)
    }
  }

  async function handleSave() {
    if (!results || !user) return
    const today = new Date().toISOString().split('T')[0]
    const totalCal = results.reduce((s, r) => s + r.calories, 0)
    const totalP = results.reduce((s, r) => s + r.protein_g, 0)
    const totalC = results.reduce((s, r) => s + r.carbs_g, 0)
    const totalF = results.reduce((s, r) => s + r.fat_g, 0)

    await supabase.from('meal_logs').insert({
      user_id: user.id,
      date: today,
      food_items: results,
      total_calories: totalCal,
      total_protein_g: totalP,
      total_carbs_g: totalC,
      total_fat_g: totalF,
      source: 'scan',
    })

    setSaved(true)
  }

  return (
    <div className="scan-page">
      <PageHeader title="Scan My Plate" color="#2c3e6b" />
      <p className="scan-desc">Take a photo of your meal and AI will estimate the calories and macros.</p>

      {!results && !scanning && (
        <div className="scan-area" onClick={handleScan}>
          <div className="scan-circle">
            <span className="scan-icon">📸</span>
          </div>
          <p>Tap to scan your meal</p>
        </div>
      )}

      {scanning && (
        <div className="scan-area">
          <div className="scan-loading" />
          <p>Analyzing your meal...</p>
        </div>
      )}

      {error && <div className="scan-error">{error}</div>}

      {results && (
        <div className="scan-results">
          <h2>Results</h2>
          <div className="results-list">
            {results.map((item, i) => (
              <div key={i} className="result-item">
                <div className="result-header">
                  <span className="result-name">{item.name}</span>
                  <span className="result-cal">{item.calories} cal</span>
                </div>
                <span className="result-portion">{item.portion}</span>
                <div className="result-macros">
                  <span>P: {item.protein_g}g</span>
                  <span>C: {item.carbs_g}g</span>
                  <span>F: {item.fat_g}g</span>
                </div>
              </div>
            ))}
          </div>
          <div className="result-total">
            Total: {results.reduce((s, r) => s + r.calories, 0)} calories
          </div>
          <p className="scan-disclaimer">Nutritional estimates are approximate. Actual values may vary.</p>
          {saved ? (
            <button className="scan-btn saved" disabled>Saved!</button>
          ) : (
            <button className="scan-btn" onClick={handleSave}>Save to My Log</button>
          )}
          <button className="scan-btn-secondary" onClick={() => { setResults(null); setSaved(false) }}>
            Scan Another
          </button>
        </div>
      )}
    </div>
  )
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}
