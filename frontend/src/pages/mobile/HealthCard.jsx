import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'

// Demo data for when API is unavailable
const DEMO_HEALTH_CARD = {
  application_id: 'APP-2024-001',
  status: 'complete',
  business_name: 'Raju Textiles Pvt Ltd',
  gstin: '27AABCU9603R1ZX',
  sector: 'Textile',
  city: 'Surat',
  total_score: 742,
  max_score: 900,
  percentile: 74,
  score_breakdown: {
    gst_compliance: 168,
    cash_flow: 196,
    business_stability: 178,
    growth_trajectory: 120,
    repayment_capacity: 80,
  },
  score_explanations: {
    gst_compliance: 'Excellent GST compliance — 92% returns filed with 88% on-time submissions.',
    cash_flow: 'Strong cash flow — 11 out of 12 months showed positive net cash flow.',
    business_stability: 'Highly stable business — 7 years of operation with 95% PF compliance.',
    growth_trajectory: 'Strong growth trajectory — invoice turnover grew 18% YoY.',
    repayment_capacity: 'Strong repayment capacity — DSCR of 2.1x comfortably exceeds threshold.',
  },
  recommendation: 'APPROVE',
  confidence: 0.88,
  eligible_loan_amount: 2500000,
  risk_grade: 'A',
  loan_offers: [],
}

function ScoreRing({ score, maxScore = 900, size = 160 }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const startAngle = -220
  const arcAngle = 260
  const targetProgress = score / maxScore

  useEffect(() => {
    let start = null
    const duration = 1500
    const animate = (timestamp) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setAnimatedScore(Math.round(score * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }
    const raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [score])

  const progress = animatedScore / maxScore
  const arcLength = circumference * (arcAngle / 360)
  const dashOffset = arcLength * (1 - progress)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: `rotate(${startAngle}deg)` }}>
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="#e5e2e1" strokeWidth={14}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Arc */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="#8b0000" strokeWidth={14}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-bold leading-none" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '36px', color: '#8b0000' }}>
          {animatedScore}
        </span>
        <span style={{ fontSize: '12px', color: '#5a403c', letterSpacing: '0.05em', fontWeight: 500 }}>/ {maxScore}</span>
      </div>
    </div>
  )
}

const CATEGORY_CONFIG = [
  { key: 'gst_compliance', name: 'GST Filings', icon: 'receipt_long', max: 200 },
  { key: 'cash_flow', name: 'Cash Flow', icon: 'payments', max: 250 },
  { key: 'business_stability', name: 'Business Stability', icon: 'business', max: 200 },
  { key: 'growth_trajectory', name: 'Growth Trajectory', icon: 'trending_up', max: 150 },
]

function CategoryRow({ name, icon, score, max }) {
  const pct = score / max
  const color = pct >= 0.75 ? '#004e10' : pct >= 0.5 ? '#7c5800' : '#ba1a1a'
  const bgColor = pct >= 0.75 ? '#a3f69c' : pct >= 0.5 ? '#fec65a' : '#ffdad6'

  return (
    <div className="flex items-center gap-3 py-3 border-b" style={{ borderColor: '#f0eded' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bgColor }}>
        <span className="material-symbols-outlined text-sm" style={{ color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium truncate" style={{ color: '#1c1b1b' }}>{name}</span>
          <span className="text-sm font-bold shrink-0 ml-2" style={{ color, fontFamily: "'Poppins', sans-serif" }}>{score}/{max}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e2e1' }}>
          <div className="h-full rounded-full" style={{ width: `${pct * 100}%`, backgroundColor: color, transition: 'width 1s ease-out' }} />
        </div>
      </div>
    </div>
  )
}

export default function HealthCard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const scrollRef = useRef(null)
  const [showChevron, setShowChevron] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('health_card')
    if (stored) {
      try { setData(JSON.parse(stored)) } catch { setData(DEMO_HEALTH_CARD) }
    } else {
      setData(DEMO_HEALTH_CARD)
    }
  }, [])

  const handleCategoryScroll = (e) => {
    const el = e.target
    setShowChevron(el.scrollTop < el.scrollHeight - el.clientHeight - 5)
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fcf9f8' }}>
        <span className="material-symbols-outlined animate-spin" style={{ color: '#8b0000', fontSize: '40px' }}>progress_activity</span>
      </div>
    )
  }

  const getRec = (rec) => {
    if (rec === 'APPROVE') return { label: 'Pre-Approved', bg: '#a3f69c', color: '#002204', icon: 'check_circle' }
    if (rec === 'REVIEW') return { label: 'Under Review', bg: '#fec65a', color: '#271900', icon: 'schedule' }
    return { label: 'Not Eligible', bg: '#ffdad6', color: '#93000a', icon: 'cancel' }
  }
  const rec = getRec(data.recommendation)

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fcf9f8' }}>
      <header className="flex items-center justify-between px-5 shrink-0" style={{ backgroundColor: '#8b0000', minHeight: '48px' }}>
        <button onClick={() => navigate('/')} className="text-white/80 p-1 hover:bg-white/10 rounded-full">
          <span className="material-symbols-outlined">home</span>
        </button>
        <h1 className="text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '18px' }}>Health Card</h1>
        <button className="text-white/80 p-1 hover:bg-white/10 rounded-full">
          <span className="material-symbols-outlined">share</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-28">
        {/* Score Hero */}
        <div className="flex flex-col items-center gap-4 p-5 pb-2">
          <div className="w-full rounded-2xl p-5 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e3beb8' }}>
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <p className="font-medium text-sm mb-0.5" style={{ color: '#5a403c' }}>{data.business_name}</p>
                <p className="font-mono text-xs" style={{ color: '#8e706b' }}>{data.gstin}</p>
              </div>

              <ScoreRing score={data.total_score} maxScore={data.max_score} size={160} />

              <div className="flex flex-col items-center gap-2">
                <div className="px-4 py-1.5 rounded-full flex items-center gap-1.5" style={{ backgroundColor: rec.bg }}>
                  <span className="material-symbols-outlined text-base" style={{ color: rec.color, fontVariationSettings: "'FILL' 1" }}>{rec.icon}</span>
                  <span className="font-semibold text-sm" style={{ color: rec.color, fontFamily: "'Poppins', sans-serif" }}>{rec.label}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#5a403c' }}>Top {100 - data.percentile}% in {data.sector} sector</p>
              </div>

              {/* Eligible amount */}
              {data.eligible_loan_amount > 0 && (
                <div className="w-full rounded-xl p-4 text-center" style={{ backgroundColor: '#f6f3f2' }}>
                  <p style={{ fontSize: '12px', color: '#5a403c', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Eligible Loan Amount</p>
                  <p className="font-bold mt-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '24px', color: '#8b0000' }}>
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(data.eligible_loan_amount)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Score Breakdown — UI Fix: all 4 rows visible with scroll indicator */}
        <div className="px-5 pb-3">
          <div className="rounded-2xl p-4 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e3beb8' }}>
            <h3 className="font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#1c1b1b' }}>Score Breakdown</h3>
            <p className="text-xs mb-3" style={{ color: '#5a403c' }}>Tap "Why this score?" for detailed explanations</p>

            {/* Scrollable rows container — max height shows ~3 items, scroll for 4th */}
            <div className="relative">
              <div
                ref={scrollRef}
                onScroll={handleCategoryScroll}
                style={{ maxHeight: '224px', overflowY: 'auto' }}
                className="pr-1"
              >
                {CATEGORY_CONFIG.map((cat) => (
                  <CategoryRow key={cat.key} name={cat.name} icon={cat.icon}
                    score={data.score_breakdown[cat.key] || 0} max={cat.max} />
                ))}
              </div>
              {/* Scroll chevron indicator */}
              {showChevron && (
                <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.9))' }}>
                  <div className="flex flex-col items-center animate-bounce">
                    <span className="material-symbols-outlined text-sm" style={{ color: '#8e706b' }}>expand_more</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confidence */}
        <div className="px-5 pb-3">
          <div className="rounded-xl p-4 flex items-center gap-3 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e3beb8' }}>
            <span className="material-symbols-outlined text-2xl" style={{ color: '#8b0000', fontVariationSettings: "'FILL' 1" }}>psychology</span>
            <div>
              <p className="font-medium text-sm" style={{ color: '#1c1b1b' }}>AI Confidence</p>
              <p style={{ fontSize: '13px', color: '#5a403c' }}>{Math.round((data.confidence || 0) * 100)}% — Based on {data.recommendation === 'APPROVE' ? '4' : '4'} data sources</p>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="px-5 pb-6 flex flex-col gap-3">
          <button
            id="why-score-btn"
            onClick={() => { sessionStorage.setItem('health_card', JSON.stringify(data)); navigate('/score-explain') }}
            className="w-full font-semibold rounded-lg border transition-all duration-200 hover:bg-red-50"
            style={{ height: '48px', color: '#610000', borderColor: '#610000', fontFamily: "'Poppins', sans-serif", fontSize: '15px', backgroundColor: 'transparent' }}
          >
            Why this score?
          </button>
          {data.eligible_loan_amount > 0 && (
            <button
              id="apply-loan-btn"
              onClick={() => { sessionStorage.setItem('health_card', JSON.stringify(data)); navigate('/loan-offers') }}
              className="w-full font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90 card-shadow"
              style={{ height: '48px', backgroundColor: '#8b0000', fontFamily: "'Poppins', sans-serif", fontSize: '15px' }}
            >
              Apply for a Loan
            </button>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
