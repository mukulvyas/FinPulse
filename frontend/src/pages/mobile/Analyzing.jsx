import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { msmeAPI } from '../../api/client'

const STATUS_MESSAGES = [
  { text: 'Reading your GST history...', icon: 'receipt_long' },
  { text: 'Checking your cash flow...', icon: 'payments' },
  { text: 'Analyzing EPFO records...', icon: 'groups' },
  { text: 'Reviewing bank statements...', icon: 'account_balance' },
  { text: 'Calculating your score...', icon: 'analytics' },
  { text: 'Preparing your report...', icon: 'description' },
]

export default function Analyzing() {
  const navigate = useNavigate()
  const [currentMsg, setCurrentMsg] = useState(0)
  const [dots, setDots] = useState('')
  const [progress, setProgress] = useState(0)
  const pollRef = useRef(null)
  const msgRef = useRef(null)
  const applicationId = sessionStorage.getItem('application_id')

  useEffect(() => {
    // Rotate status messages
    msgRef.current = setInterval(() => {
      setCurrentMsg((prev) => (prev + 1) % STATUS_MESSAGES.length)
    }, 2000)

    // Animate dots
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
    }, 400)

    // Animate progress bar
    let p = 0
    const progInterval = setInterval(() => {
      p = Math.min(90, p + Math.random() * 8)
      setProgress(p)
    }, 800)

    // Poll for results
    if (applicationId) {
      pollRef.current = setInterval(async () => {
        try {
          const res = await msmeAPI.getResult(applicationId)
          if (res.data.status === 'complete') {
            clearAll()
            setProgress(100)
            sessionStorage.setItem('health_card', JSON.stringify(res.data))
            setTimeout(() => navigate('/health-card'), 500)
          } else if (res.data.status === 'error') {
            clearAll()
            navigate('/health-card') // Still navigate, will use fallback
          }
        } catch (e) {
          // Server not yet ready, keep polling
        }
      }, 3000)
    } else {
      // No application ID, simulate and use demo data
      setTimeout(() => {
        clearAll()
        setProgress(100)
        setTimeout(() => navigate('/health-card'), 500)
      }, 8000)
    }

    const clearAll = () => {
      clearInterval(msgRef.current)
      clearInterval(dotInterval)
      clearInterval(progInterval)
      if (pollRef.current) clearInterval(pollRef.current)
    }

    return clearAll
  }, [applicationId, navigate])

  const msg = STATUS_MESSAGES[currentMsg]

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fcf9f8' }}>
      <header className="flex items-center justify-center px-5 shrink-0" style={{ backgroundColor: '#8b0000', minHeight: '48px' }}>
        <h1 className="text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '18px' }}>FinPulse Analysis</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-5 gap-8">
        {/* Animated orb */}
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: '#8b0000' }} />
          <div className="absolute inset-2 rounded-full animate-pulse opacity-30" style={{ backgroundColor: '#8b0000' }} />
          <div className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#8b0000' }}>
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>{msg.icon}</span>
          </div>
        </div>

        {/* Status text */}
        <div className="text-center">
          <p className="font-semibold text-lg mb-1" style={{ fontFamily: "'Poppins', sans-serif", color: '#1c1b1b' }}>
            {msg.text}{dots}
          </p>
          <p style={{ fontSize: '14px', color: '#5a403c' }}>AI agents are working on your assessment</p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-sm">
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e2e1' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, backgroundColor: '#8b0000' }} />
          </div>
          <div className="flex justify-between mt-2">
            <span style={{ fontSize: '12px', color: '#5a403c' }}>Analyzing data sources</span>
            <span style={{ fontSize: '12px', color: '#5a403c' }}>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Steps */}
        <div className="w-full max-w-sm space-y-3">
          {STATUS_MESSAGES.slice(0, 4).map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300"
              style={{ backgroundColor: i <= currentMsg ? '#ffdad4' : '#f0eded' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: i <= currentMsg ? '#8b0000' : '#e5e2e1' }}>
                {i < currentMsg ? (
                  <span className="material-symbols-outlined text-white text-sm">check</span>
                ) : i === currentMsg ? (
                  <span className="material-symbols-outlined text-white text-sm animate-spin">progress_activity</span>
                ) : (
                  <span className="text-xs font-bold" style={{ color: '#5a403c' }}>{i + 1}</span>
                )}
              </div>
              <span className="text-sm font-medium" style={{ color: i <= currentMsg ? '#410000' : '#5a403c' }}>
                {item.text.replace('...', '')}
              </span>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-6 px-5 flex justify-center items-center gap-2" style={{ color: '#5a403c' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock</span>
        <p style={{ fontSize: '12px', fontWeight: 500 }}>256-bit encrypted · RBI compliant</p>
      </footer>
    </div>
  )
}
