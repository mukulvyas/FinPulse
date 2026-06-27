import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

export default function ConnectAA() {
  const navigate = useNavigate()
  const [bank, setBank] = useState('')
  const [consented, setConsented] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConnect = () => {
    if (!consented) return
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/analyzing') }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fcf9f8' }}>
      <MobileHeader title="Connect Bank Account" step={4} totalSteps={4} />
      <StepIndicator current={4} total={4} />

      <main className="flex-1 p-5 flex flex-col gap-5 max-w-md mx-auto w-full">
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#ffdad4' }}>
            <span className="material-symbols-outlined text-3xl" style={{ color: '#8b0000', fontVariationSettings: "'FILL' 1" }}>account_balance</span>
          </div>
          <div className="text-center">
            <h2 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '22px', color: '#1c1b1b' }}>Account Aggregator</h2>
            <p className="mt-1" style={{ fontSize: '14px', color: '#5a403c', lineHeight: '20px' }}>Share your bank statement summary through the RBI-regulated Account Aggregator framework.</p>
          </div>
        </div>

        {/* Bank selector */}
        <div className="flex flex-col gap-1.5">
          <label className="font-medium text-sm" style={{ color: '#1c1b1b' }}>Select your primary bank</label>
          <select
            id="bank-select"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="w-full rounded-lg border px-4 bg-white outline-none transition-all"
            style={{ height: '48px', borderColor: '#e3beb8', fontSize: '14px', color: '#1c1b1b' }}
            onFocus={(e) => e.target.style.borderColor = '#8b0000'}
            onBlur={(e) => e.target.style.borderColor = '#e3beb8'}
          >
            <option value="">Select bank</option>
            <option value="sbi">State Bank of India</option>
            <option value="idbi">IDBI Bank</option>
            <option value="hdfc">HDFC Bank</option>
            <option value="icici">ICICI Bank</option>
            <option value="pnb">Punjab National Bank</option>
            <option value="bom">Bank of Maharashtra</option>
            <option value="uco">UCO Bank</option>
          </select>
        </div>

        {/* AA Framework info */}
        <div className="rounded-xl p-4 border" style={{ backgroundColor: '#f6f3f2', borderColor: '#e3beb8' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined" style={{ color: '#004e10', fontVariationSettings: "'FILL' 1" }}>shield</span>
            <p className="font-semibold text-sm" style={{ color: '#1c1b1b' }}>RBI Account Aggregator Framework</p>
          </div>
          <ul className="space-y-2">
            {['Data shared only with your explicit consent', 'Read-only access — no transactions possible', 'Consent can be revoked at any time', 'Regulated by Reserve Bank of India'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs" style={{ color: '#5a403c' }}>
                <span className="material-symbols-outlined text-sm" style={{ color: '#004e10' }}>check_circle</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Consent checkbox */}
        <label className="flex items-start gap-3 cursor-pointer">
          <div
            onClick={() => setConsented(!consented)}
            className="w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all"
            style={{ borderColor: consented ? '#8b0000' : '#8e706b', backgroundColor: consented ? '#8b0000' : 'transparent' }}
          >
            {consented && <span className="material-symbols-outlined text-white text-sm">check</span>}
          </div>
          <span style={{ fontSize: '13px', color: '#5a403c', lineHeight: '19px' }}>
            I consent to sharing my bank statement summary via the Account Aggregator framework for this loan assessment only.
          </span>
        </label>
      </main>

      <div className="p-5 border-t" style={{ borderColor: '#e3beb8' }}>
        <button
          id="connect-aa-btn"
          onClick={handleConnect}
          disabled={loading || !consented}
          className="w-full font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ height: '48px', backgroundColor: '#8b0000', fontFamily: "'Poppins', sans-serif", fontSize: '16px' }}
        >
          {loading ? (
            <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span> Authorizing...</>
          ) : (
            <>Authorize & Analyze <span className="material-symbols-outlined text-base">arrow_forward</span></>
          )}
        </button>
      </div>
    </div>
  )
}
