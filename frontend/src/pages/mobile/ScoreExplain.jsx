import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'

const DEMO_HEALTH_CARD = {
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
    gst_compliance: 'Excellent GST compliance — 92% returns filed with 88% on-time submissions. This signals strong financial discipline and regulatory adherence.',
    cash_flow: 'Strong cash flow — 11 out of 12 months showed positive net cash flow, with average monthly UPI inflow of ₹19.5L. Business demonstrates healthy liquidity.',
    business_stability: 'Highly stable business — 7 years of operation with 95% PF compliance. Consistent workforce of ~12 employees demonstrates operational maturity.',
    growth_trajectory: 'Strong growth trajectory — invoice turnover grew 18% YoY with 15% UPI transaction growth. Business is expanding rapidly and demonstrates strong market demand.',
    repayment_capacity: 'Strong repayment capacity — DSCR of 2.1x comfortably exceeds the minimum threshold of 1.25x. Bank balance of ₹8.2L provides adequate repayment buffer.',
  },
  recommendation: 'APPROVE',
}

const CATEGORIES = [
  { key: 'gst_compliance', name: 'GST Filings', icon: 'receipt_long', max: 200, description: 'Filing punctuality & consistency' },
  { key: 'cash_flow', name: 'Cash Flow', icon: 'payments', max: 250, description: 'UPI inflow & net cashflow' },
  { key: 'business_stability', name: 'Business Stability', icon: 'business', max: 200, description: 'Employee trend & tenure' },
  { key: 'growth_trajectory', name: 'Growth Trajectory', icon: 'trending_up', max: 150, description: 'YoY invoice & UPI growth' },
  { key: 'repayment_capacity', name: 'Repayment Capacity', icon: 'account_balance', max: 100, description: 'DSCR from bank statements' },
]

function ExplainCard({ category, score, max, explanation }) {
  const pct = score / max
  const config = pct >= 0.75
    ? { color: '#002204', bg: '#a3f69c', border: '#004e10', label: 'Strong' }
    : pct >= 0.5
    ? { color: '#271900', bg: '#fec65a', border: '#7c5800', label: 'Moderate' }
    : { color: '#93000a', bg: '#ffdad6', border: '#ba1a1a', label: 'Needs Work' }

  return (
    <div className="rounded-2xl overflow-hidden card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e3beb8' }}>
      <div className="h-1.5" style={{ backgroundColor: config.border }} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: config.bg }}>
              <span className="material-symbols-outlined text-sm" style={{ color: config.border, fontVariationSettings: "'FILL' 1" }}>{category.icon}</span>
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif", color: '#1c1b1b' }}>{category.name}</p>
              <p style={{ fontSize: '11px', color: '#5a403c' }}>{category.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '20px', color: config.border }}>{score}</p>
            <p style={{ fontSize: '11px', color: '#5a403c' }}>/ {max}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full overflow-hidden mb-3" style={{ backgroundColor: '#e5e2e1' }}>
          <div className="h-full rounded-full" style={{ width: `${pct * 100}%`, backgroundColor: config.border }} />
        </div>

        {/* Status label */}
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full mb-2" style={{ backgroundColor: config.bg }}>
          <span className="font-medium text-xs" style={{ color: config.color }}>{config.label}</span>
        </div>

        {/* Explanation */}
        <p style={{ fontSize: '13px', color: '#5a403c', lineHeight: '20px' }}>{explanation}</p>
      </div>
    </div>
  )
}

export default function ScoreExplain() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('health_card')
    if (stored) {
      try { setData(JSON.parse(stored)) } catch { setData(DEMO_HEALTH_CARD) }
    } else {
      setData(DEMO_HEALTH_CARD)
    }
  }, [])

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fcf9f8' }}>
      <span className="material-symbols-outlined animate-spin" style={{ color: '#8b0000', fontSize: '40px' }}>progress_activity</span>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fcf9f8' }}>
      <header className="flex items-center justify-between px-5 shrink-0" style={{ backgroundColor: '#8b0000', minHeight: '48px' }}>
        <button onClick={() => navigate(-1)} className="text-white p-1 rounded-full hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '18px' }}>Score Explained</h1>
        <div className="w-8" />
      </header>

      <main className="flex-1 overflow-y-auto p-5 pb-24">
        {/* Summary */}
        <div className="rounded-2xl p-4 mb-5 flex items-center gap-4 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e3beb8' }}>
          <div className="text-center">
            <p className="font-bold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '32px', color: '#8b0000' }}>{data.total_score}</p>
            <p style={{ fontSize: '11px', color: '#5a403c' }}>/ 900</p>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm mb-1" style={{ fontFamily: "'Poppins', sans-serif", color: '#1c1b1b' }}>Your FinPulse Score</p>
            <p style={{ fontSize: '13px', color: '#5a403c' }}>Better than {data.percentile}% of businesses in your sector. Here's what drives each dimension:</p>
          </div>
        </div>

        {/* Category cards */}
        <div className="space-y-4">
          {CATEGORIES.map((cat) => (
            <ExplainCard
              key={cat.key}
              category={cat}
              score={data.score_breakdown?.[cat.key] || 0}
              max={cat.max}
              explanation={data.score_explanations?.[cat.key] || 'Analysis data not available.'}
            />
          ))}
        </div>

        {/* How scoring works */}
        <div className="mt-5 rounded-2xl p-4 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e3beb8' }}>
          <h3 className="font-semibold mb-3" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#1c1b1b' }}>How FinPulse Scoring Works</h3>
          <div className="space-y-2">
            {[
              { name: 'GST Compliance', max: 200, pct: 22 },
              { name: 'Cash Flow', max: 250, pct: 28 },
              { name: 'Business Stability', max: 200, pct: 22 },
              { name: 'Growth Trajectory', max: 150, pct: 17 },
              { name: 'Repayment Capacity', max: 100, pct: 11 },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="text-xs w-36 shrink-0" style={{ color: '#5a403c' }}>{item.name}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e2e1' }}>
                  <div className="h-full rounded-full" style={{ width: `${item.pct * 4}%`, backgroundColor: '#8b0000' }} />
                </div>
                <span className="text-xs w-8 text-right shrink-0 font-medium" style={{ color: '#610000' }}>{item.max}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
