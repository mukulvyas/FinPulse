import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

function calcEMI(principal, annualRate, months) {
  const r = annualRate / 12 / 100
  if (r === 0) return Math.round(principal / months)
  return Math.round(principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1))
}

const DEMO_LOANS = [
  {
    product_name: 'IDBI MSME Growth Loan',
    max_amount: 2500000,
    interest_rate: 9.5,
    tenure_months: 60,
    processing_fee: 1.0,
    description: 'Our flagship MSME product for high-performing businesses. Low rate, long tenure.',
    highlight: true,
  },
  {
    product_name: 'IDBI Working Capital Plus',
    max_amount: 1250000,
    interest_rate: 10.5,
    tenure_months: 36,
    processing_fee: 0.75,
    description: 'Flexible working capital for inventory and operational needs.',
    highlight: false,
  },
  {
    product_name: 'IDBI GST-Linked Credit',
    max_amount: 833000,
    interest_rate: 11.0,
    tenure_months: 24,
    processing_fee: 0.5,
    description: 'Short-term credit linked to your GST turnover for seasonal needs.',
    highlight: false,
  },
]

function LoanCard({ loan, index }) {
  const emi = calcEMI(loan.max_amount, loan.interest_rate, loan.tenure_months)
  const processingFee = Math.round(loan.max_amount * loan.processing_fee / 100)
  const [selected, setSelected] = useState(false)

  return (
    <div
      className="rounded-2xl overflow-hidden card-shadow transition-all duration-200"
      style={{
        backgroundColor: '#ffffff',
        border: loan.highlight ? '2px solid #8b0000' : '1px solid #e3beb8',
      }}
    >
      {loan.highlight && (
        <div className="px-4 py-1.5 flex items-center gap-1" style={{ backgroundColor: '#8b0000' }}>
          <span className="material-symbols-outlined text-sm text-white" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="text-white font-medium text-xs" style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '0.05em' }}>RECOMMENDED FOR YOU</span>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#1c1b1b' }}>{loan.product_name}</h3>
        <p className="text-xs mb-4" style={{ color: '#5a403c', lineHeight: '18px' }}>{loan.description}</p>

        {/* Key metrics grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f6f3f2' }}>
            <p style={{ fontSize: '10px', color: '#5a403c', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Max Amount</p>
            <p className="font-bold mt-0.5" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#8b0000' }}>{formatINR(loan.max_amount)}</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f6f3f2' }}>
            <p style={{ fontSize: '10px', color: '#5a403c', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Monthly EMI</p>
            <p className="font-bold mt-0.5" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#004e10' }}>{formatINR(emi)}</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f6f3f2' }}>
            <p style={{ fontSize: '10px', color: '#5a403c', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Interest Rate</p>
            <p className="font-bold mt-0.5" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#1c1b1b' }}>{loan.interest_rate}% p.a.</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f6f3f2' }}>
            <p style={{ fontSize: '10px', color: '#5a403c', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Tenure</p>
            <p className="font-bold mt-0.5" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#1c1b1b' }}>{loan.tenure_months} months</p>
          </div>
        </div>

        {/* Processing fee */}
        <div className="flex justify-between items-center text-xs mb-4" style={{ color: '#5a403c' }}>
          <span>Processing Fee ({loan.processing_fee}%)</span>
          <span className="font-medium">{formatINR(processingFee)} (one-time)</span>
        </div>

        {/* EMI breakdown */}
        <div className="rounded-xl p-3 mb-4" style={{ backgroundColor: '#ffdad4', border: '1px solid #e3beb8' }}>
          <p style={{ fontSize: '11px', color: '#5a403c', marginBottom: '4px' }}>EMI Calculation</p>
          <p style={{ fontSize: '12px', color: '#410000', lineHeight: '18px' }}>
            {formatINR(loan.max_amount)} × {loan.interest_rate}%/12 / (1 − (1+{loan.interest_rate}%/12)^−{loan.tenure_months}) = <strong>{formatINR(emi)}/month</strong>
          </p>
        </div>

        <button
          id={`apply-btn-${index}`}
          onClick={() => setSelected(true)}
          className="w-full font-semibold rounded-lg transition-all duration-200"
          style={{
            height: '48px',
            backgroundColor: selected ? '#004e10' : loan.highlight ? '#8b0000' : 'transparent',
            color: selected ? '#ffffff' : loan.highlight ? '#ffffff' : '#8b0000',
            border: loan.highlight ? 'none' : '1px solid #8b0000',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '15px',
          }}
        >
          {selected ? '✓ Application Submitted' : loan.highlight ? 'Apply Now' : 'Select This Plan'}
        </button>
      </div>
    </div>
  )
}

export default function LoanOffers() {
  const navigate = useNavigate()
  const [healthCard, setHealthCard] = useState(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('health_card')
    if (stored) {
      try { setHealthCard(JSON.parse(stored)) } catch {}
    }
  }, [])

  const loans = healthCard?.loan_offers?.length > 0 ? healthCard.loan_offers : DEMO_LOANS

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fcf9f8' }}>
      <header className="flex items-center justify-between px-5 shrink-0" style={{ backgroundColor: '#8b0000', minHeight: '48px' }}>
        <button onClick={() => navigate(-1)} className="text-white p-1 rounded-full hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '18px' }}>Loan Offers</h1>
        <div className="w-8" />
      </header>

      {/* Score reminder banner */}
      <div className="px-5 py-3 flex items-center gap-3" style={{ backgroundColor: '#ffdad4' }}>
        <span className="material-symbols-outlined" style={{ color: '#8b0000', fontVariationSettings: "'FILL' 1" }}>verified</span>
        <div>
          <p className="font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif", color: '#410000' }}>
            Score {healthCard?.total_score || 742} — Pre-Approved
          </p>
          <p style={{ fontSize: '12px', color: '#8b0000' }}>3 exclusive offers based on your financial health</p>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-5 pb-24 space-y-4">
        {loans.map((loan, i) => <LoanCard key={i} loan={loan} index={i} />)}

        {/* Disclaimer */}
        <div className="rounded-xl p-4" style={{ backgroundColor: '#f0eded', border: '1px solid #e3beb8' }}>
          <p style={{ fontSize: '11px', color: '#5a403c', lineHeight: '17px' }}>
            *Loan offers are subject to IDBI Bank's credit policy and final officer approval. EMI calculations are indicative. 
            Interest rates as of June 2024. Processing fees are non-refundable. T&C apply.
          </p>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
