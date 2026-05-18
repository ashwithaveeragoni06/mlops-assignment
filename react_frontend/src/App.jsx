import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (username.length > 0 && password === 'admin123') {
      onLogin(username)
    } else {
      setError('Invalid credentials. Password: admin123')
    }
  }

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:'Arial, sans-serif'
    }}>
      <div style={{
        background:'rgba(255,255,255,0.05)',
        backdropFilter:'blur(10px)',
        border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:20, padding:'48px 40px', width:380,
        boxShadow:'0 25px 50px rgba(0,0,0,0.5)'
      }}>
        <div style={{textAlign:'center', marginBottom:32}}>
          <div style={{fontSize:48, marginBottom:12}}>🛡️</div>
          <h1 style={{color:'#fff', fontSize:24, fontWeight:700, marginBottom:4}}>
            FraudGuard AI
          </h1>
          <p style={{color:'rgba(255,255,255,0.5)', fontSize:14}}>
            MLOps Fraud Detection System
          </p>
        </div>

        {['Username', 'Password'].map((label) => (
          <div key={label} style={{marginBottom:16}}>
            <label style={{
              display:'block', color:'rgba(255,255,255,0.7)',
              fontSize:13, marginBottom:8, fontWeight:500
            }}>{label}</label>
            <input
              type={label === 'Password' ? 'password' : 'text'}
              value={label === 'Username' ? username : password}
              onChange={e => label === 'Username'
                ? setUsername(e.target.value)
                : setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder={`Enter ${label.toLowerCase()}`}
              style={{
                width:'100%', padding:'12px 16px', borderRadius:10,
                border:'1px solid rgba(255,255,255,0.2)',
                background:'rgba(255,255,255,0.1)', color:'#fff',
                fontSize:14, outline:'none', boxSizing:'border-box'
              }}
            />
          </div>
        ))}

        {error && (
          <div style={{
            background:'rgba(255,50,50,0.2)',
            border:'1px solid rgba(255,50,50,0.3)',
            borderRadius:8, padding:'10px 14px',
            color:'#ff6b6b', fontSize:13, marginBottom:16
          }}>{error}</div>
        )}

        <button onClick={handleLogin} style={{
          width:'100%', padding:14,
          background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color:'#fff', border:'none', borderRadius:10,
          fontSize:15, fontWeight:600, cursor:'pointer',
          boxShadow:'0 4px 15px rgba(102,126,234,0.4)'
        }}>Sign In</button>

        <p style={{
          textAlign:'center', color:'rgba(255,255,255,0.3)',
          fontSize:12, marginTop:24
        }}>Password: admin123</p>
      </div>
    </div>
  )
}

function Dashboard({ username, onLogout }) {
  const [form, setForm] = useState({
    amt: '', age: '', city_pop: '',
    transaction_hour: '', transaction_month: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  const fullForm = {
    merchant: 100, category: 5,
    gender: 1, city: 200, state: 10,
    zip: 50000, lat: 38.5, long: -90.2,
    job: 150, unix_time: 1344905832,
    merch_lat: 38.5, merch_long: -90.2,
    transaction_day: 15, transaction_year: 2023,
    transaction_dayofweek: 2, weekend_transaction: 0,
    night_transaction: Number(form.transaction_hour) >= 22 ||
      Number(form.transaction_hour) <= 5 ? 1 : 0,
    high_amount_flag: Number(form.amt) > 500 ? 1 : 0,
    large_city_flag: Number(form.city_pop) > 100000 ? 1 : 0
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePredict = async () => {
    // Validate all fields filled
    const empty = Object.entries(form).filter(([k,v]) => v === '')
    if (empty.length > 0) {
      setError('Please fill in all fields!')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const payload = {
        ...fullForm,
        amt: Number(form.amt),
        age: Number(form.age),
        city_pop: Number(form.city_pop),
        transaction_hour: Number(form.transaction_hour),
        transaction_month: Number(form.transaction_month),
        night_transaction: Number(form.transaction_hour) >= 22 ||
          Number(form.transaction_hour) <= 5 ? 1 : 0,
        high_amount_flag: Number(form.amt) > 500 ? 1 : 0,
        large_city_flag: Number(form.city_pop) > 100000 ? 1 : 0
      }

      const res = await axios.post(`${API_URL}/predict`, payload)
      setResult(res.data)
      setHistory(prev => [{
        time: new Date().toLocaleTimeString(),
        amt: form.amt,
        hour: form.transaction_hour,
        result: res.data
      }, ...prev.slice(0, 4)])
    } catch (err) {
      setError('Cannot reach API. Is FastAPI running?')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { label: 'Transaction Amount ($)', name: 'amt',
      placeholder: 'e.g. 150.50', hint: 'Actual transaction amount' },
    { label: 'Customer Age (years)', name: 'age',
      placeholder: 'e.g. 35', hint: 'Age of the cardholder' },
    { label: 'City Population', name: 'city_pop',
      placeholder: 'e.g. 50000', hint: 'Population of transaction city' },
    { label: 'Transaction Hour (0-23)', name: 'transaction_hour',
      placeholder: 'e.g. 14', hint: '0=midnight, 14=2PM, 23=11PM' },
    { label: 'Transaction Month (1-12)', name: 'transaction_month',
      placeholder: 'e.g. 6', hint: '1=January, 12=December' },
  ]

  return (
    <div style={{
      minHeight:'100vh', background:'#0f0f1a',
      fontFamily:'Arial, sans-serif', color:'#fff'
    }}>
      {/* Header */}
      <div style={{
        background:'rgba(255,255,255,0.05)',
        borderBottom:'1px solid rgba(255,255,255,0.1)',
        padding:'16px 32px',
        display:'flex', alignItems:'center', justifyContent:'space-between'
      }}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <span style={{fontSize:28}}>🛡️</span>
          <div>
            <h1 style={{fontSize:18, fontWeight:700, margin:0}}>FraudGuard AI</h1>
            <p style={{fontSize:12, color:'rgba(255,255,255,0.4)', margin:0}}>
              Welcome, {username}
            </p>
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:16}}>
          <div style={{
            background:'rgba(0,255,100,0.1)',
            border:'1px solid rgba(0,255,100,0.3)',
            borderRadius:20, padding:'4px 12px',
            fontSize:12, color:'#00ff64'
          }}>● Model Online</div>
          <button onClick={onLogout} style={{
            background:'rgba(255,255,255,0.1)',
            border:'1px solid rgba(255,255,255,0.2)',
            borderRadius:8, padding:'8px 16px',
            color:'#fff', cursor:'pointer', fontSize:13
          }}>Logout</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(4,1fr)',
        gap:16, padding:'24px 32px 0'
      }}>
        {[
          ['97%','Accuracy','🎯'],
          ['0.987','AUC-ROC','📈'],
          ['92%','Fraud Recall','🔍'],
          ['4.76%','Fraud Rate','⚠️'],
        ].map(([value, label, icon]) => (
          <div key={label} style={{
            background:'rgba(255,255,255,0.05)',
            border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:12, padding:'16px 20px', textAlign:'center'
          }}>
            <div style={{fontSize:24, marginBottom:4}}>{icon}</div>
            <div style={{fontSize:22, fontWeight:700, color:'#667eea'}}>{value}</div>
            <div style={{fontSize:12, color:'rgba(255,255,255,0.4)'}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{
        display:'grid', gridTemplateColumns:'1fr 1fr',
        gap:24, padding:32
      }}>
        {/* Input Form */}
        <div style={{
          background:'rgba(255,255,255,0.05)',
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:16, padding:24
        }}>
          <h2 style={{fontSize:16, fontWeight:600, marginBottom:6}}>
            🔍 Transaction Analysis
          </h2>
          <p style={{
            fontSize:12, color:'rgba(255,255,255,0.4)',
            marginBottom:20
          }}>
            Enter real transaction details below
          </p>

          {fields.map(({ label, name, placeholder, hint }) => (
            <div key={name} style={{marginBottom:16}}>
              <label style={{
                display:'block', fontSize:13,
                color:'rgba(255,255,255,0.7)',
                marginBottom:4, fontWeight:500
              }}>{label}</label>
              <input
                type="number"
                name={name}
                value={form[name]}
                onChange={handleChange}
                onWheel={e => e.target.blur()}
                placeholder={placeholder}
                style={{
                  width:'100%', padding:'10px 14px', borderRadius:8,
                  border:'1px solid rgba(255,255,255,0.15)',
                  background:'rgba(255,255,255,0.08)', color:'#fff',
                  fontSize:14, outline:'none', boxSizing:'border-box'
                }}
              />
              <p style={{
                fontSize:11, color:'rgba(255,255,255,0.3)',
                marginTop:3
              }}>{hint}</p>
            </div>
          ))}

          {/* Smart flags display */}
          {(form.amt || form.transaction_hour || form.city_pop) && (
            <div style={{
              background:'rgba(102,126,234,0.1)',
              border:'1px solid rgba(102,126,234,0.2)',
              borderRadius:8, padding:'10px 14px', marginBottom:16
            }}>
              <p style={{fontSize:12, color:'rgba(255,255,255,0.6)', marginBottom:4}}>
                Auto-detected flags:
              </p>
              <p style={{fontSize:12, color:'#667eea'}}>
                {Number(form.amt) > 500 ? '⚠️ High amount ' : '✅ Normal amount '}
                {Number(form.transaction_hour) >= 22 ||
                  Number(form.transaction_hour) <= 5
                  ? '⚠️ Night transaction ' : '✅ Daytime '}
                {Number(form.city_pop) > 100000
                  ? '✅ Large city' : '⚠️ Small city'}
              </p>
            </div>
          )}

          <button
            onClick={handlePredict}
            disabled={loading}
            style={{
              width:'100%', padding:14,
              background: loading
                ? 'rgba(102,126,234,0.3)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color:'#fff', border:'none', borderRadius:10,
              fontSize:15, fontWeight:600,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow:'0 4px 15px rgba(102,126,234,0.3)'
            }}>
            {loading ? '⏳ Analyzing...' : '🔍 Analyze Transaction'}
          </button>

          {error && (
            <div style={{
              marginTop:12, padding:12,
              background:'rgba(255,50,50,0.1)',
              border:'1px solid rgba(255,50,50,0.3)',
              borderRadius:8, color:'#ff6b6b', fontSize:13
            }}>❌ {error}</div>
          )}
        </div>

        {/* Result + History */}
        <div style={{display:'flex', flexDirection:'column', gap:20}}>
          <div style={{
            background:'rgba(255,255,255,0.05)',
            border:`1px solid ${result
              ? result.prediction === 1
                ? 'rgba(255,150,0,0.4)'
                : 'rgba(0,255,100,0.4)'
              : 'rgba(255,255,255,0.1)'}`,
            borderRadius:16, padding:24, flex:1,
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', textAlign:'center'
          }}>
            {!result ? (
              <div>
                <div style={{fontSize:48, marginBottom:12}}>💳</div>
                <p style={{color:'rgba(255,255,255,0.4)', fontSize:14}}>
                  Fill in transaction details and click Analyze
                </p>
              </div>
            ) : (
              <div>
                <div style={{fontSize:56, marginBottom:16}}>
                  {result.prediction === 1 ? '⚠️' : '✅'}
                </div>
                <h2 style={{
                  fontSize:24, fontWeight:700, marginBottom:8,
                  color: result.prediction === 1 ? '#ff9800' : '#00e676'
                }}>
                  {result.fraud === 'Yes' ? 'FRAUD DETECTED' : 'TRANSACTION SAFE'}
                </h2>
                <div style={{
                  background:'rgba(255,255,255,0.05)',
                  borderRadius:12, padding:'16px 32px', marginTop:16
                }}>
                  <div style={{
                    fontSize:36, fontWeight:700,
                    color: result.prediction === 1 ? '#ff9800' : '#00e676'
                  }}>{result.confidence}</div>
                  <div style={{
                    fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:4
                  }}>Fraud Probability</div>
                </div>
                <div style={{
                  marginTop:12, padding:'8px 16px',
                  background:'rgba(255,255,255,0.05)',
                  borderRadius:8, fontSize:12,
                  color:'rgba(255,255,255,0.4)'
                }}>Raw score: {result.probability}</div>
              </div>
            )}
          </div>

          {history.length > 0 && (
            <div style={{
              background:'rgba(255,255,255,0.05)',
              border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:16, padding:20
            }}>
              <h3 style={{
                fontSize:14, fontWeight:600, marginBottom:12,
                color:'rgba(255,255,255,0.7)'
              }}>Recent Predictions</h3>
              {history.map((h, i) => (
                <div key={i} style={{
                  display:'flex', justifyContent:'space-between',
                  alignItems:'center', padding:'8px 0',
                  borderBottom: i < history.length-1
                    ? '1px solid rgba(255,255,255,0.05)' : 'none'
                }}>
                  <div>
                    <span style={{fontSize:12, color:'rgba(255,255,255,0.6)'}}>
                      ${h.amt} • Hour {h.hour}
                    </span>
                    <span style={{
                      fontSize:11, color:'rgba(255,255,255,0.3)', marginLeft:8
                    }}>{h.time}</span>
                  </div>
                  <span style={{
                    fontSize:12, fontWeight:600,
                    color: h.result.prediction === 1 ? '#ff9800' : '#00e676'
                  }}>
                    {h.result.fraud === 'Yes' ? '⚠️ Fraud' : '✅ Safe'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  return isLoggedIn
    ? <Dashboard username={username} onLogout={() => setIsLoggedIn(false)} />
    : <LoginPage onLogin={(name) => { setUsername(name); setIsLoggedIn(true) }} />
}