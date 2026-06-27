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

export default function ConnectEPFO() {
  const navigate = useNavigate()
  const [empCode, setEmpCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConnect = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/connect-aa') }, 1200)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fcf9f8' }}>
      <MobileHeader title="Connect EPFO" step={3} totalSteps={4} />
      <StepIndicator current={3} total={4} />

      <main className="flex-1 p-5 flex flex-col gap-5 max-w-md mx-auto w-full">
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#a3f69c' }}>
            <span className="material-symbols-outlined text-3xl" style={{ color: '#003508', fontVariationSettings: "'FILL' 1" }}>groups</span>
          </div>
          <div className="text-center">
            <h2 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '22px', color: '#1c1b1b' }}>Connect EPFO Records</h2>
            <p className="mt-1" style={{ fontSize: '14px', color: '#5a403c', lineHeight: '20px' }}>Verify your employee count history and provident fund compliance over 24 months.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-sm" style={{ color: '#1c1b1b' }}>Employer Code (EPFO)</label>
            <input
              id="epfo-code-input"
              type="text"
              value={empCode}
              onChange={(e) => setEmpCode(e.target.value)}
              placeholder="e.g. MH/PUN/001234"
              className="w-full rounded-lg border px-4 outline-none transition-all"
              style={{ height: '48px', borderColor: '#e3beb8', fontSize: '14px', fontFamily: 'monospace' }}
              onFocus={(e) => e.target.style.borderColor = '#8b0000'}
              onBlur={(e) => e.target.style.borderColor = '#e3beb8'}
            />
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ backgroundColor: '#f0eded' }}>
          <p className="font-medium text-sm mb-2" style={{ color: '#1c1b1b' }}>Why EPFO data matters</p>
          <ul className="space-y-2">
            {[
              { icon: 'trending_up', text: 'Employee growth shows business expansion' },
              { icon: 'verified_user', text: 'PF compliance reflects financial discipline' },
              { icon: 'schedule', text: 'Business tenure indicates stability' },
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-2 text-sm" style={{ color: '#5a403c' }}>
                <span className="material-symbols-outlined text-base shrink-0 mt-0.5" style={{ color: '#003508' }}>{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </main>

      <div className="p-5 border-t" style={{ borderColor: '#e3beb8' }}>
        <button
          id="connect-epfo-btn"
          onClick={handleConnect}
          disabled={loading}
          className="w-full font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ height: '48px', backgroundColor: '#8b0000', fontFamily: "'Poppins', sans-serif", fontSize: '16px' }}
        >
          {loading ? (
            <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span> Connecting...</>
          ) : (
            <>Connect EPFO <span className="material-symbols-outlined text-base">arrow_forward</span></>
          )}
        </button>
      </div>
    </div>
  )
}
