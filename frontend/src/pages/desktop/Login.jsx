import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../api/client'

export default function OfficerLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('officer@idbi.in')
  const [password, setPassword] = useState('demo1234')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await authAPI.login(email, password)
      localStorage.setItem('finpulse_token', res.data.access_token)
      localStorage.setItem('finpulse_officer', JSON.stringify({ name: res.data.officer_name, id: res.data.officer_id }))
      navigate('/officer/dashboard')
    } catch (err) {
      setError('Invalid credentials. Try officer@idbi.in / demo1234')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#fcf9f8' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-12" style={{ backgroundColor: '#8b0000' }}>
        <div>
          <div className="flex items-center gap-3 mb-12">
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
            <div>
              <h1 className="text-white font-bold text-2xl" style={{ fontFamily: "'Poppins', sans-serif" }}>FinPulse</h1>
              <p className="text-white/70 text-sm">by IDBI Bank</p>
            </div>
          </div>
          <h2 className="text-white font-semibold text-3xl leading-tight mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            AI-Powered MSME<br />Credit Intelligence
          </h2>
          <p className="text-white/80 text-base leading-relaxed">
            Review loan applications enriched with AI scoring from GST, UPI, EPFO and Account Aggregator data.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { icon: 'psychology', text: 'AI-powered 900-point scoring' },
            { icon: 'speed', text: 'Instant risk assessment' },
            { icon: 'verified_user', text: 'OCEN 4.0 compliant' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <span className="material-symbols-outlined text-white/80" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              <span className="text-white/80 text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-bold text-3xl mb-2" style={{ fontFamily: "'Poppins', sans-serif", color: '#1c1b1b' }}>Officer Login</h2>
            <p style={{ color: '#5a403c', fontSize: '15px' }}>Access your MSME loan review portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-medium text-sm" style={{ color: '#1c1b1b' }}>Email Address</label>
              <input
                id="officer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border px-4 outline-none transition-all"
                style={{ height: '52px', borderColor: '#e3beb8', fontSize: '15px' }}
                onFocus={(e) => e.target.style.borderColor = '#8b0000'}
                onBlur={(e) => e.target.style.borderColor = '#e3beb8'}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-medium text-sm" style={{ color: '#1c1b1b' }}>Password</label>
              <input
                id="officer-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border px-4 outline-none transition-all"
                style={{ height: '52px', borderColor: '#e3beb8', fontSize: '15px' }}
                onFocus={(e) => e.target.style.borderColor = '#8b0000'}
                onBlur={(e) => e.target.style.borderColor = '#e3beb8'}
              />
            </div>

            {error && (
              <div className="rounded-xl p-3 flex items-center gap-2" style={{ backgroundColor: '#ffdad6' }}>
                <span className="material-symbols-outlined text-sm" style={{ color: '#ba1a1a' }}>error</span>
                <p className="text-sm" style={{ color: '#93000a' }}>{error}</p>
              </div>
            )}

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full font-semibold text-white rounded-xl transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ height: '52px', backgroundColor: '#8b0000', fontFamily: "'Poppins', sans-serif", fontSize: '16px' }}
            >
              {loading ? <><span className="material-symbols-outlined animate-spin">progress_activity</span> Logging in...</> : 'Login to Portal'}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: '#f6f3f2', border: '1px solid #e3beb8' }}>
            <p className="text-xs font-medium mb-1" style={{ color: '#5a403c' }}>Demo Credentials</p>
            <p className="text-xs font-mono" style={{ color: '#1c1b1b' }}>officer@idbi.in / demo1234</p>
          </div>

          <div className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-sm hover:underline" style={{ color: '#5a403c' }}>
              ← Back to MSME Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
