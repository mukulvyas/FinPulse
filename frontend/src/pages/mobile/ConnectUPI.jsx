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

export default function ConnectUPI() {
  const navigate = useNavigate()
  const [upiHandle, setUpiHandle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConnect = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/connect-epfo')
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fcf9f8' }}>
      <MobileHeader title="Connect UPI" step={2} totalSteps={4} />
      <StepIndicator current={2} total={4} />

      <main className="flex-1 p-5 flex flex-col gap-5 max-w-md mx-auto w-full">
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#ffdea7' }}>
            <span className="material-symbols-outlined text-3xl" style={{ color: '#7c5800', fontVariationSettings: "'FILL' 1" }}>payments</span>
          </div>
          <div className="text-center">
            <h2 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '22px', color: '#1c1b1b' }}>Connect UPI Transactions</h2>
            <p className="mt-1" style={{ fontSize: '14px', color: '#5a403c', lineHeight: '20px' }}>We'll analyze 12 months of your daily UPI cash flow to assess financial health.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-sm" style={{ color: '#1c1b1b' }}>UPI Business Handle</label>
            <input
              id="upi-handle-input"
              type="text"
              value={upiHandle}
              onChange={(e) => setUpiHandle(e.target.value)}
              placeholder="e.g. rajutextiles@okaxis"
              className="w-full rounded-lg border px-4 outline-none transition-all"
              style={{ height: '48px', borderColor: '#e3beb8', fontSize: '14px' }}
              onFocus={(e) => e.target.style.borderColor = '#8b0000'}
              onBlur={(e) => e.target.style.borderColor = '#e3beb8'}
            />
          </div>
        </div>

        {/* UPI apps */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'PhonePe', color: '#5f259f', bg: '#f3e8ff' },
            { name: 'Google Pay', color: '#1a73e8', bg: '#e8f0fe' },
            { name: 'Paytm', color: '#00b9f1', bg: '#e0f7fe' },
          ].map((app) => (
            <button key={app.name} onClick={() => setUpiHandle(`business@${app.name.toLowerCase().replace(' ', '')}`)}
              className="p-3 rounded-xl border flex flex-col items-center gap-1 transition-all hover:opacity-80"
              style={{ backgroundColor: app.bg, borderColor: '#e3beb8' }}>
              <span className="material-symbols-outlined" style={{ color: app.color, fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
              <span className="text-xs font-medium" style={{ color: '#1c1b1b' }}>{app.name}</span>
            </button>
          ))}
        </div>

        <div className="rounded-xl p-4" style={{ backgroundColor: '#f0eded' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-lg" style={{ color: '#004e10' }}>verified</span>
            <p className="font-medium text-sm" style={{ color: '#1c1b1b' }}>What we look for</p>
          </div>
          <ul className="space-y-1">
            {['Monthly inflow consistency', 'Average transaction value', 'Positive net cash flow months'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm" style={{ color: '#5a403c' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#004e10' }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </main>

      <div className="p-5 border-t" style={{ borderColor: '#e3beb8' }}>
        <button
          id="connect-upi-btn"
          onClick={handleConnect}
          disabled={loading}
          className="w-full font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ height: '48px', backgroundColor: '#8b0000', fontFamily: "'Poppins', sans-serif", fontSize: '16px' }}
        >
          {loading ? (
            <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span> Connecting...</>
          ) : (
            <>Connect UPI <span className="material-symbols-outlined text-base">arrow_forward</span></>
          )}
        </button>
      </div>
    </div>
  )
}
