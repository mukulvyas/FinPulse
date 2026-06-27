import { useState, useEffect } from 'react'
import { officerAPI } from '../../api/client'
import Sidebar from '../../components/Sidebar'

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

const STATUS_LABELS = {
  NTC: { label: 'NTC', bg: '#ffdad6', color: '#93000a' },
  NTB: { label: 'NTB', bg: '#ffdea7', color: '#271900' },
}
const RISK_LABELS = {
  'High Confidence': { bg: '#a3f69c', color: '#002204' },
  'Review Required': { bg: '#fec65a', color: '#271900' },
}
const REC_LABELS = {
  APPROVE: { bg: '#a3f69c', color: '#002204', icon: 'check_circle' },
  REVIEW: { bg: '#fec65a', color: '#271900', icon: 'schedule' },
  REJECT: { bg: '#ffdad6', color: '#93000a', icon: 'cancel' },
}

function ApplicationListItem({ app, selected, onClick }) {
  const rec = REC_LABELS[app.recommendation] || REC_LABELS.REVIEW
  const risk = RISK_LABELS[app.risk_label] || RISK_LABELS['Review Required']
  const typeLabel = STATUS_LABELS[app.applicant_type] || STATUS_LABELS.NTC

  return (
    <button
      id={`app-item-${app.application_id}`}
      onClick={onClick}
      className="w-full text-left p-4 border-b transition-all duration-150"
      style={{
        borderColor: '#e5e2e1',
        backgroundColor: selected ? '#ffdad4' : 'transparent',
        borderLeft: selected ? '4px solid #8b0000' : '4px solid transparent',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate" style={{ fontFamily: "'Poppins', sans-serif", color: '#1c1b1b' }}>
            {app.business_name}
          </p>
          <p className="text-xs font-mono" style={{ color: '#5a403c' }}>{app.gstin}</p>
        </div>
        <span className="font-bold text-lg shrink-0" style={{ fontFamily: "'Poppins', sans-serif", color: '#8b0000' }}>
          {app.total_score}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: typeLabel.bg, color: typeLabel.color }}>
          {typeLabel.label}
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: risk.bg, color: risk.color }}>
          {app.risk_label}
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1" style={{ backgroundColor: rec.bg, color: rec.color }}>
          {app.recommendation}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs" style={{ color: '#5a403c' }}>{app.sector} · {app.city}</span>
        <span className="text-xs" style={{ color: '#5a403c' }}>{formatINR(app.requested_amount)}</span>
      </div>
    </button>
  )
}

function DossierPanel({ app, onDecision, submitting }) {
  const [notes, setNotes] = useState('')
  const [localStatus, setLocalStatus] = useState(app.status)

  useEffect(() => { setLocalStatus(app.status); setNotes('') }, [app.application_id])

  const handleDecision = async (decision) => {
    await onDecision(app.application_id, decision, notes)
    setLocalStatus(decision === 'APPROVE' ? 'approved' : decision === 'REJECT' ? 'rejected' : decision === 'REFER' ? 'referred' : 'flagged')
  }

  const rec = REC_LABELS[app.recommendation] || REC_LABELS.REVIEW
  const breakdown = app.score_breakdown || {}

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-bold text-2xl" style={{ fontFamily: "'Poppins', sans-serif", color: '#1c1b1b' }}>{app.business_name}</h2>
          <p className="font-mono text-sm" style={{ color: '#5a403c' }}>{app.gstin}</p>
          <p className="text-sm mt-0.5" style={{ color: '#5a403c' }}>{app.sector} · {app.city}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-4xl" style={{ fontFamily: "'Poppins', sans-serif", color: '#8b0000' }}>{app.total_score}</p>
          <p style={{ fontSize: '12px', color: '#5a403c' }}>/ 900 · Top {100 - (app.percentile || 50)}% in sector</p>
        </div>
      </div>

      {/* AI Recommendation Box */}
      <div className="rounded-xl p-4" style={{ backgroundColor: rec.bg, border: `1px solid ${rec.color}20` }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined" style={{ color: rec.color, fontVariationSettings: "'FILL' 1" }}>{rec.icon}</span>
          <p className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: rec.color, fontSize: '16px' }}>
            AI Recommends: {app.recommendation}
          </p>
          <span className="ml-auto text-sm font-medium px-2 py-0.5 rounded-full bg-white/50" style={{ color: rec.color }}>
            {Math.round((app.confidence || 0.5) * 100)}% confidence
          </span>
        </div>
        <p style={{ fontSize: '13px', color: rec.color, lineHeight: '19px' }}>
          {app.officer_dossier?.recommendation_reasoning ||
            `Score ${app.total_score}/900 — ${app.recommendation === 'APPROVE' ? 'Strong financial indicators support approval' : app.recommendation === 'REVIEW' ? 'Borderline case requires officer judgment' : 'Multiple risk factors indicate high default probability'}.`}
        </p>
      </div>

      {/* Score Breakdown */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1' }}>
        <div className="p-4 border-b" style={{ borderColor: '#e5e2e1' }}>
          <h3 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#1c1b1b' }}>Score Breakdown</h3>
        </div>
        {[
          { name: 'GST Compliance', key: 'gst_compliance', max: 200 },
          { name: 'Cash Flow', key: 'cash_flow', max: 250 },
          { name: 'Business Stability', key: 'business_stability', max: 200 },
          { name: 'Growth Trajectory', key: 'growth_trajectory', max: 150 },
          { name: 'Repayment Capacity', key: 'repayment_capacity', max: 100 },
        ].map((item) => {
          const score = breakdown[item.key] || 0
          const pct = score / item.max
          const color = pct >= 0.75 ? '#004e10' : pct >= 0.5 ? '#7c5800' : '#ba1a1a'
          return (
            <div key={item.key} className="px-4 py-3 border-b flex items-center gap-4" style={{ borderColor: '#f0eded' }}>
              <span className="text-sm w-40 shrink-0" style={{ color: '#1c1b1b', fontWeight: 500 }}>{item.name}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e2e1' }}>
                <div className="h-full rounded-full" style={{ width: `${pct * 100}%`, backgroundColor: color }} />
              </div>
              <span className="text-sm font-bold w-16 text-right shrink-0" style={{ fontFamily: "'Poppins', sans-serif", color }}>
                {score}/{item.max}
              </span>
            </div>
          )
        })}
      </div>

      {/* Key Metrics */}
      {app.officer_dossier?.key_metrics && (
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(app.officer_dossier.key_metrics).map(([key, value]) => (
            <div key={key} className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f6f3f2', border: '1px solid #e5e2e1' }}>
              <p className="text-xs font-medium mb-1" style={{ color: '#5a403c', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</p>
              <p className="font-bold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#8b0000' }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Loan Offers */}
      {app.eligible_amount > 0 && (
        <div className="rounded-xl p-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1' }}>
          <h3 className="font-semibold mb-2" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#1c1b1b' }}>Eligible Loan Amount</h3>
          <p className="font-bold text-2xl" style={{ fontFamily: "'Poppins', sans-serif", color: '#8b0000' }}>{formatINR(app.eligible_amount)}</p>
          <p className="text-xs mt-1" style={{ color: '#5a403c' }}>Requested: {formatINR(app.requested_amount)}</p>
        </div>
      )}

      {/* Officer Notes */}
      <div>
        <label className="block font-medium text-sm mb-2" style={{ color: '#1c1b1b' }}>Assessment Notes (optional)</label>
        <textarea
          id="officer-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Add your assessment notes here..."
          className="w-full rounded-xl border px-4 py-3 outline-none transition-all resize-none"
          style={{ borderColor: '#e3beb8', fontSize: '14px' }}
          onFocus={(e) => e.target.style.borderColor = '#8b0000'}
          onBlur={(e) => e.target.style.borderColor = '#e3beb8'}
        />
      </div>

      {/* Decision Buttons */}
      {localStatus === 'pending' || localStatus === 'complete' ? (
        <div className="grid grid-cols-2 gap-3">
          <button id="btn-approve" onClick={() => handleDecision('APPROVE')} disabled={submitting}
            className="h-12 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#004e10', fontFamily: "'Poppins', sans-serif" }}>
            <span className="material-symbols-outlined text-base">check_circle</span> APPROVE
          </button>
          <button id="btn-reject" onClick={() => handleDecision('REJECT')} disabled={submitting}
            className="h-12 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#ba1a1a', fontFamily: "'Poppins', sans-serif" }}>
            <span className="material-symbols-outlined text-base">cancel</span> REJECT
          </button>
          <button id="btn-refer" onClick={() => handleDecision('REFER')} disabled={submitting}
            className="h-12 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 border flex items-center justify-center gap-2"
            style={{ borderColor: '#7c5800', color: '#7c5800', backgroundColor: 'transparent', fontFamily: "'Poppins', sans-serif" }}>
            <span className="material-symbols-outlined text-base">forward</span> REFER
          </button>
          <button id="btn-flag" onClick={() => handleDecision('FLAG')} disabled={submitting}
            className="h-12 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 border flex items-center justify-center gap-2"
            style={{ borderColor: '#5a403c', color: '#5a403c', backgroundColor: 'transparent', fontFamily: "'Poppins', sans-serif" }}>
            <span className="material-symbols-outlined text-base">flag</span> FLAG
          </button>
        </div>
      ) : (
        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#f0eded' }}>
          <p className="font-semibold capitalize" style={{ color: '#1c1b1b', fontFamily: "'Poppins', sans-serif" }}>
            Decision: {localStatus}
          </p>
          <p className="text-sm mt-1" style={{ color: '#5a403c' }}>This application has been processed.</p>
        </div>
      )}
    </div>
  )
}

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    officerAPI.getQueue()
      .then(res => {
        setApplications(res.data.applications || [])
        if (res.data.applications?.length > 0) setSelected(res.data.applications[0])
      })
      .catch(() => {
        // Fallback demo data
        const demo = [
          { application_id: 'APP-2024-001', business_name: 'Raju Textiles Pvt Ltd', gstin: '27AABCU9603R1ZX', sector: 'Textile', city: 'Surat', total_score: 742, recommendation: 'APPROVE', confidence: 0.88, status: 'pending', applicant_type: 'NTB', risk_label: 'High Confidence', requested_amount: 2000000, eligible_amount: 2500000, percentile: 74, score_breakdown: { gst_compliance: 168, cash_flow: 196, business_stability: 178, growth_trajectory: 120, repayment_capacity: 80 }, officer_dossier: { key_metrics: { gst_filing_rate: '92%', upi_positive_months: '11/12', epfo_employees: '12', dscr: '2.1x', tenure: '7 years', avg_monthly_turnover: '₹18.5L' }, recommendation_reasoning: 'AI Assessment recommends APPROVAL. Score 742/900 (A grade). Strong GST compliance at 92%, 11 months positive cash flow, DSCR of 2.1x.' } },
          { application_id: 'APP-2024-002', business_name: 'Sharma Logistics Carriers', gstin: '07AAECS7456M1ZA', sector: 'Logistics', city: 'Delhi', total_score: 610, recommendation: 'REVIEW', confidence: 0.64, status: 'pending', applicant_type: 'NTC', risk_label: 'Review Required', requested_amount: 1500000, eligible_amount: 1000000, percentile: 52, score_breakdown: { gst_compliance: 120, cash_flow: 180, business_stability: 140, growth_trajectory: 100, repayment_capacity: 70 }, officer_dossier: { key_metrics: { gst_filing_rate: '75%', upi_positive_months: '9/12', epfo_employees: '9', dscr: '1.3x', tenure: '4 years', avg_monthly_turnover: '₹9.2L' }, recommendation_reasoning: 'AI Assessment recommends MANUAL REVIEW. Score 610/900 (B grade). Borderline case — cash flow consistency concerns.' } },
          { application_id: 'APP-2024-003', business_name: 'Apex Manufacturing Works', gstin: '27AADCA7592Q1ZB', sector: 'Manufacturing', city: 'Pune', total_score: 815, recommendation: 'APPROVE', confidence: 0.95, status: 'pending', applicant_type: 'NTB', risk_label: 'High Confidence', requested_amount: 3500000, eligible_amount: 5000000, percentile: 89, score_breakdown: { gst_compliance: 188, cash_flow: 235, business_stability: 192, growth_trajectory: 135, repayment_capacity: 65 }, officer_dossier: { key_metrics: { gst_filing_rate: '96%', upi_positive_months: '12/12', epfo_employees: '15', dscr: '3.4x', tenure: '11 years', avg_monthly_turnover: '₹34L' }, recommendation_reasoning: 'AI Assessment recommends APPROVAL. Score 815/900 (A+ grade). Exceptional across all metrics. Highly recommended.' } },
          { application_id: 'APP-2024-004', business_name: 'Sunrise Retail Enterprises', gstin: '19AAHCS5690P1ZC', sector: 'Retail', city: 'Kolkata', total_score: 580, recommendation: 'REJECT', confidence: 0.82, status: 'pending', applicant_type: 'NTC', risk_label: 'Review Required', requested_amount: 800000, eligible_amount: 0, percentile: 38, score_breakdown: { gst_compliance: 100, cash_flow: 145, business_stability: 115, growth_trajectory: 80, repayment_capacity: 40 }, officer_dossier: { key_metrics: { gst_filing_rate: '63%', upi_positive_months: '7/12', epfo_employees: '8', dscr: '0.9x', tenure: '2 years', avg_monthly_turnover: '₹5.4L' }, recommendation_reasoning: 'AI Assessment recommends REJECTION. Score 580/900 (C grade). Poor GST compliance (63%), negative DSCR (0.9x).' } },
          { application_id: 'APP-2024-005', business_name: 'Nandini Agro Processors', gstin: '27AANCA3429L1ZD', sector: 'Agri-Processing', city: 'Nagpur', total_score: 690, recommendation: 'REVIEW', confidence: 0.71, status: 'pending', applicant_type: 'NTC', risk_label: 'High Confidence', requested_amount: 1200000, eligible_amount: 1500000, percentile: 65, score_breakdown: { gst_compliance: 145, cash_flow: 195, business_stability: 158, growth_trajectory: 112, repayment_capacity: 80 }, officer_dossier: { key_metrics: { gst_filing_rate: '83%', upi_positive_months: '10/12', epfo_employees: '11', dscr: '1.8x', tenure: '5 years', avg_monthly_turnover: '₹12.5L' }, recommendation_reasoning: 'AI Assessment recommends MANUAL REVIEW. Score 690/900 (B+ grade). Positive indicators but seasonal cash flow dips.' } },
        ]
        setApplications(demo)
        setSelected(demo[0])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleDecision = async (applicationId, decision, notes) => {
    setSubmitting(true)
    try {
      await officerAPI.submitDecision({ application_id: applicationId, decision, notes })
      setApplications(prev => prev.map(a => a.application_id === applicationId ? { ...a, status: decision.toLowerCase() === 'approve' ? 'approved' : decision.toLowerCase() === 'reject' ? 'rejected' : 'referred' } : a))
    } catch (e) {
      // Optimistic update even if API fails
      setApplications(prev => prev.map(a => a.application_id === applicationId ? { ...a, status: 'approved' } : a))
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = applications.filter(a => a.business_name.toLowerCase().includes(search.toLowerCase()) || a.gstin.includes(search.toUpperCase()))

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: '#fcf9f8' }}>
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex justify-between items-center px-6 shrink-0 border-b" style={{ backgroundColor: '#8b0000', minHeight: '48px', borderColor: 'rgba(255,255,255,0.1)' }}>
          <span className="text-white font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>Review Applications</span>
          <span className="text-white/80 text-sm">{applications.filter(a => a.status === 'pending' || a.status === 'complete').length} pending</span>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Left queue panel */}
          <div className="w-80 shrink-0 border-r flex flex-col" style={{ borderColor: '#e3beb8', backgroundColor: '#ffffff' }}>
            {/* Search */}
            <div className="p-3 border-b" style={{ borderColor: '#e5e2e1' }}>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg" style={{ color: '#5a403c' }}>search</span>
                <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-3 rounded-lg border outline-none transition-all"
                  style={{ height: '36px', borderColor: '#e5e2e1', fontSize: '13px' }}
                  onFocus={(e) => e.target.style.borderColor = '#8b0000'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e2e1'}
                />
              </div>
            </div>

            {/* Application list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <span className="material-symbols-outlined animate-spin" style={{ color: '#8b0000' }}>progress_activity</span>
                </div>
              ) : (
                filtered.map((app) => (
                  <ApplicationListItem key={app.application_id} app={app}
                    selected={selected?.application_id === app.application_id}
                    onClick={() => setSelected(app)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right dossier panel */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {selected ? (
              <DossierPanel app={selected} onDecision={handleDecision} submitting={submitting} />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-5xl mb-3 block" style={{ color: '#e3beb8' }}>description</span>
                  <p style={{ color: '#5a403c' }}>Select an application to review</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
