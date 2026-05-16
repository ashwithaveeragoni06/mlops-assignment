import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

export default function App() {
  const [form, setForm] = useState({
    merchant: 100, category: 5, amt: 50,
    gender: 1, city: 200, state: 10,
    zip: 50000, lat: 0.5, long: -0.5,
    city_pop: 0.3, job: 150, unix_time: 0.1,
    merch_lat: 0.5, merch_long: -0.5,
    transaction_hour: 14, transaction_day: 15,
    transaction_month: 6, transaction_year: 2023,
    transaction_dayofweek: 2, weekend_transaction: 0,
    night_transaction: 0, age: 0.2,
    high_amount_flag: 0, large_city_flag: 1
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: Number(e.target.value)
    }))
  }

  const handlePredict = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(
        `${API_URL}/predict`, form
      )
      setResult(res.data)
    } catch (err) {
      setError('Cannot reach API. Is FastAPI running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{maxWidth:600, margin:'0 auto',
      padding:24, fontFamily:'sans-serif'}}>
      <h1 style={{fontSize:24, marginBottom:4}}>
        🔍 Credit Card Fraud Detection
      </h1>
      <p style={{color:'#666', marginBottom:24}}>
        Enter transaction details to check for fraud
      </p>

      <div style={{background:'#f5f5f5',
        borderRadius:10, padding:16, marginBottom:16}}>
        <h3 style={{marginBottom:12}}>
          Transaction Details
        </h3>

        {[
          ['Amount', 'amt'],
          ['Transaction Hour', 'transaction_hour'],
          ['Transaction Month', 'transaction_month'],
          ['City Population', 'city_pop'],
          ['Age', 'age'],
        ].map(([label, key]) => (
          <div key={key} style={{marginBottom:10}}>
            <label style={{display:'block',
              fontSize:12, color:'#666', marginBottom:4}}>
              {label}
            </label>
            <input
              type="number"
              name={key}
              value={form[key]}
              onChange={handleChange}
              style={{width:'100%', padding:'8px',
                borderRadius:6, border:'1px solid #ddd',
                fontSize:14}}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handlePredict}
        disabled={loading}
        style={{width:'100%', padding:12,
          background:'#1a1a1a', color:'#fff',
          border:'none', borderRadius:8,
          fontSize:16, cursor:'pointer'}}>
        {loading ? 'Analyzing...' : 'Check for Fraud'}
      </button>

      {error && (
        <div style={{marginTop:16, padding:12,
          background:'#fff0f0', borderRadius:8,
          color:'#c00', fontSize:14}}>
          {error}
        </div>
      )}

      {result && (
        <div style={{marginTop:16, padding:20,
          borderRadius:10,
          background: result.prediction === 1
            ? '#fff4e5' : '#f0fff4',
          border: `2px solid ${
            result.prediction === 1 ? '#f90' : '#0c0'
          }`}}>
          <h3 style={{fontSize:20, marginBottom:8}}>
            {result.fraud === 'Yes'
              ? '⚠️ FRAUD DETECTED'
              : '✅ Transaction Looks Safe'}
          </h3>
          <p>Probability: <strong>
            {result.confidence}
          </strong></p>
          <p style={{color:'#666', fontSize:12}}>
            Raw score: {result.probability}
          </p>
        </div>
      )}
    </div>
  )
}