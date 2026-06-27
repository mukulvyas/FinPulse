import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { msmeAPI } from '../../api/client'

const KNOWN_GSTINS = [
  '27AABCU9603R1ZX',
  '07AAECS7456M1ZA',
  '27AADCA7592Q1ZB',
  '19AAHCS5690P1ZC',
  '27AANCA3429L1ZD',
]

function MobileHeader({ title, step, totalSteps }) {
  const navigate = useNavigate()
  return (
    <header className="flex items-center justify-between px-5 shrink-0" style={{ backgroundColor: '#8b0000', minHeight: '48px' }}>
      <button onClick={() => navigate(-1)} className="text-white p-1 rounded-full hover:bg-white/10">
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 className="text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '18px' }}>{title}</h1>
      <span className="text-white/70 text-sm">{step}/{totalSteps}</span>
    </header>
  )
}

function StepIndicator({ current, total }) {
  return (
    <div className="flex gap-2 justify-center py-4">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="h-1.5 rounded-full transition-all duration-300"
          style={{ width: i + 1 === current ? '32px' : '16px', backgroundColor: i + 1 <= current ? '#8b0000' : '#e3beb8' }}
        />
      ))}
    </div>
  )
}

export default function ConnectGST() {
  const navigate = useNavigate()
  const [gstin, setGstin] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [sector, setSector] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = async () => {
    if (!gstin || gstin.length !== 15) {
      setError('Please enter a valid 15-digit GSTIN')
      return
    }
    setLoading(true)
    setError('')

    try {
      const response = await msmeAPI.assess({
        gstin: gstin.toUpperCase(),
        business_name: businessName || 'MSME Business',
        sector: sector || 'general',
        connected_sources: ['gst'],
      })
      sessionStorage.setItem('application_id', response.data.application_id)
      sessionStorage.setItem('gstin', gstin.toUpperCase())
      navigate('/connect-upi')
    } catch (err) {
      setError('Failed to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fcf9f8' }}>
      <MobileHeader title="Connect GST" step={1} totalSteps={4} />
      <StepIndicator current={1} total={4} />

      <main className="flex-1 p-5 flex flex-col gap-5 max-w-md mx-auto w-full">
        {/* Icon + Title */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#ffdad4' }}>
            <span className="material-symbols-outlined text-3xl" style={{ color: '#8b0000', fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
          </div>
          <div className="text-center">
            <h2 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '22px', color: '#1c1b1b' }}>Connect your GST</h2>
            <p className="mt-1" style={{ fontSize: '14px', color: '#5a403c', lineHeight: '20px' }}>We'll securely read 24 months of your filing history to verify your tax compliance.</p>
          </div>
        </div>

        {/* GSTIN Input */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-sm" style={{ color: '#1c1b1b' }}>GSTIN *</label>
            <input
              id="gstin-input"
              type="text"
              maxLength={15}
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              placeholder="e.g. 27AABCU9603R1ZX"
              className="w-full rounded-lg border px-4 outline-none transition-all duration-200 focus:ring-2 font-mono"
              style={{
                height: '48px', borderColor: error ? '#ba1a1a' : '#e3beb8', fontSize: '14px',
                fontFamily: 'monospace', letterSpacing: '0.1em',
              }}
              onFocus={(e) => e.target.style.borderColor = '#8b0000'}
              onBlur={(e) => e.target.style.borderColor = error ? '#ba1a1a' : '#e3beb8'}
            />
            {error && <p className="text-sm" style={{ color: '#ba1a1a' }}>{error}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-sm" style={{ color: '#1c1b1b' }}>Business Name</label>
            <input
              id="business-name-input"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your registered business name"
              className="w-full rounded-lg border px-4 outline-none transition-all duration-200"
              style={{ height: '48px', borderColor: '#e3beb8', fontSize: '14px' }}
              onFocus={(e) => e.target.style.borderColor = '#8b0000'}
              onBlur={(e) => e.target.style.borderColor = '#e3beb8'}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-sm" style={{ color: '#1c1b1b' }}>Industry Sector</label>
            <select
              id="sector-select"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full rounded-lg border px-4 outline-none transition-all duration-200 bg-white"
              style={{ height: '48px', borderColor: '#e3beb8', fontSize: '14px', color: '#1c1b1b' }}
              onFocus={(e) => e.target.style.borderColor = '#8b0000'}
              onBlur={(e) => e.target.style.borderColor = '#e3beb8'}
            >
              <option value="">Select sector</option>
              <option value="textile">Textile</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="retail">Retail</option>
              <option value="logistics">Logistics</option>
              <option value="agri-processing">Agri-Processing</option>
              <option value="it">IT Services</option>
              <option value="general">Other</option>
            </select>
          </div>
        </div>

        {/* Demo GSTINs */}
        <div className="rounded-xl p-4" style={{ backgroundColor: '#f6f3f2', border: '1px solid #e3beb8' }}>
          <p className="font-medium text-xs mb-2" style={{ color: '#5a403c', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Demo GSTINs (tap to fill)</p>
          <div className="flex flex-wrap gap-2">
            {KNOWN_GSTINS.map((g) => (
              <button key={g} onClick={() => setGstin(g)}
                className="px-2 py-1 rounded-full text-xs font-mono transition-colors hover:opacity-80"
                style={{ backgroundColor: '#ffdad4', color: '#410000', fontSize: '11px' }}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Security notice */}
        <div className="flex items-start gap-2 rounded-xl p-4" style={{ backgroundColor: '#f0eded' }}>
          <span className="material-symbols-outlined text-lg shrink-0" style={{ color: '#5a403c' }}>security</span>
          <p style={{ fontSize: '13px', color: '#5a403c', lineHeight: '19px' }}>Your data is encrypted and only used for this assessment. We never share your information without consent.</p>
        </div>
      </main>

      {/* Bottom CTA */}
      <div className="p-5 border-t" style={{ borderColor: '#e3beb8', backgroundColor: '#fcf9f8' }}>
        <button
          id="connect-gst-btn"
          onClick={handleConnect}
          disabled={loading || !gstin}
          className="w-full font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ height: '48px', backgroundColor: '#8b0000', fontFamily: "'Poppins', sans-serif", fontSize: '16px' }}
        >
          {loading ? (
            <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span> Connecting...</>
          ) : (
            <>Connect GST <span className="material-symbols-outlined text-base">arrow_forward</span></>
          )}
        </button>
      </div>
    </div>
  )
}
