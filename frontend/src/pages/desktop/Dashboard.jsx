import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyticsAPI } from '../../api/client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Sidebar from '../../components/Sidebar'

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

const DEMO_DATA = {
  kpis: { total_applications: 247, approval_rate: 0.68, avg_score: 687, ntc_approved: 89, portfolio_at_risk: 4.2 },
  score_distribution: [
    { range: '<600', count: 31 }, { range: '600-649', count: 48 }, { range: '650-699', count: 62 },
    { range: '700-749', count: 72 }, { range: '750-800', count: 24 }, { range: '>800', count: 10 },
  ],
  sector_breakdown: [
    { sector: 'Manufacturing', volume: 78, approval_rate: 0.72 },
    { sector: 'Retail Trading', volume: 54, approval_rate: 0.58 },
    { sector: 'Logistics', volume: 42, approval_rate: 0.61 },
    { sector: 'Textile', volume: 38, approval_rate: 0.74 },
    { sector: 'IT Services', volume: 21, approval_rate: 0.81 },
    { sector: 'Agri-Processing', volume: 14, approval_rate: 0.64 },
  ],
  recent_decisions: [
    { business: 'Apex Machining Works', app_id: 'APP-2023-892', score: 785, amount: '₹25,00,000', decision: 'Approved' },
    { business: 'Sunrise Retail Pvt Ltd', app_id: 'APP-2023-891', score: 640, amount: '₹10,00,000', decision: 'Pending Review' },
    { business: 'Global Logistics Co.', app_id: 'APP-2023-889', score: 580, amount: '₹50,00,000', decision: 'Declined' },
    { business: 'Nandini Agro Processors', app_id: 'APP-2023-888', score: 710, amount: '₹15,50,000', decision: 'Approved' },
  ],
}

function DecisionBadge({ decision }) {
  const config = {
    'Approved': { bg: '#a3f69c', color: '#002204' },
    'Pending Review': { bg: '#fec65a', color: '#271900' },
    'Declined': { bg: '#ffdad6', color: '#93000a' },
  }[decision] || { bg: '#e5e2e1', color: '#1c1b1b' }
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: config.bg, color: config.color }}>
      {decision}
    </span>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(DEMO_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsAPI.getPortfolio()
      .then(res => setData(res.data))
      .catch(() => setData(DEMO_DATA))
      .finally(() => setLoading(false))
  }, [])

  const kpis = data?.kpis || DEMO_DATA.kpis

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: '#fcf9f8' }}>
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex justify-between items-center px-6 shrink-0 border-b" style={{ backgroundColor: '#8b0000', minHeight: '48px', borderColor: 'rgba(255,255,255,0.1)' }}>
          <span className="text-white font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>FinPulse</span>
          <div className="flex items-center gap-3">
            <button className="text-white/80 hover:bg-white/10 p-2 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button onClick={() => navigate('/officer/applications')} className="text-white text-sm font-medium px-4 py-1.5 rounded-full border border-white/30 hover:bg-white/10 transition-colors">
              Review Queue (5)
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: '#fcf9f8' }}>
          <div className="max-w-screen-xl mx-auto space-y-6">
            {/* Page header */}
            <div className="flex justify-between items-end">
              <div>
                <h1 className="font-bold text-3xl" style={{ fontFamily: "'Poppins', sans-serif", color: '#1c1b1b' }}>Portfolio Overview</h1>
                <p style={{ color: '#5a403c', fontSize: '15px' }}>Real-time snapshot of MSME lending health.</p>
              </div>
              <button className="px-5 h-10 border rounded-full text-sm font-medium hover:bg-surface-container transition-colors" style={{ borderColor: '#8b0000', color: '#8b0000' }}>
                Export Report
              </button>
            </div>

            {/* KPI Strip — 5 cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Applications */}
              <div className="rounded-xl p-4 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1' }}>
                <p className="text-xs font-medium mb-2" style={{ color: '#5a403c', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Applications</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', color: '#8b0000' }}>{kpis.total_applications}</span>
                  <span className="material-symbols-outlined text-sm" style={{ color: '#004e10' }}>trending_up</span>
                </div>
              </div>

              {/* Approved */}
              <div className="rounded-xl p-4 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1' }}>
                <p className="text-xs font-medium mb-2" style={{ color: '#5a403c', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Approved</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', color: '#8b0000' }}>{Math.round(kpis.approval_rate * 100)}%</span>
                  <span className="material-symbols-outlined text-sm" style={{ color: '#004e10' }}>trending_up</span>
                </div>
              </div>

              {/* Avg Score */}
              <div className="rounded-xl p-4 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1' }}>
                <p className="text-xs font-medium mb-2" style={{ color: '#5a403c', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Avg Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', color: '#8b0000' }}>{kpis.avg_score}</span>
                </div>
              </div>

              {/* NTC Approved */}
              <div className="rounded-xl p-4 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1' }}>
                <p className="text-xs font-medium mb-2" style={{ color: '#5a403c', letterSpacing: '0.05em', textTransform: 'uppercase' }}>NTC Approved</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', color: '#8b0000' }}>{kpis.ntc_approved}</span>
                </div>
              </div>

              {/* Portfolio at Risk — UI Fix: amber color + warning triangle */}
              <div className="rounded-xl p-4 card-shadow col-span-2 lg:col-span-1" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1' }}>
                <p className="text-xs font-medium mb-2" style={{ color: '#5a403c', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Portfolio at Risk</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '28px', color: '#F57C00' }}>
                    {kpis.portfolio_at_risk}%
                  </span>
                  <span className="material-symbols-outlined text-sm" style={{ color: '#F57C00', fontVariationSettings: "'FILL' 1" }}>warning</span>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Bar Chart */}
              <div className="rounded-xl p-5 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1', height: '320px', display: 'flex', flexDirection: 'column' }}>
                <h3 className="font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#1c1b1b' }}>Score Range of Approved Loans</h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.score_distribution || DEMO_DATA.score_distribution} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0eded" />
                      <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#5a403c' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#5a403c' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e3beb8', borderRadius: '8px', fontSize: '12px' }}
                        cursor={{ fill: '#ffdad4' }}
                      />
                      <Bar dataKey="count" fill="#8b0000" radius={[4, 4, 0, 0]} name="Applications" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sector Table */}
              <div className="rounded-xl p-5 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1', height: '320px', display: 'flex', flexDirection: 'column' }}>
                <h3 className="font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#1c1b1b' }}>Approval Rates by Industry</h3>
                <div className="overflow-y-auto flex-1">
                  <table className="w-full text-left">
                    <thead className="sticky top-0" style={{ backgroundColor: '#ffffff' }}>
                      <tr style={{ borderBottom: '1px solid #e5e2e1' }}>
                        <th className="pb-2 text-xs font-semibold" style={{ color: '#5a403c' }}>Sector</th>
                        <th className="pb-2 text-xs font-semibold text-right" style={{ color: '#5a403c' }}>Volume</th>
                        <th className="pb-2 text-xs font-semibold text-right" style={{ color: '#5a403c' }}>Approval Rate</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: '14px' }}>
                      {(data?.sector_breakdown || DEMO_DATA.sector_breakdown).map((row) => (
                        <tr key={row.sector} style={{ borderBottom: '1px solid #f0eded' }}>
                          <td className="py-2.5" style={{ color: '#1c1b1b' }}>{row.sector}</td>
                          <td className="py-2.5 text-right" style={{ color: '#5a403c' }}>{row.volume}</td>
                          <td className="py-2.5 text-right font-medium" style={{ color: row.approval_rate >= 0.70 ? '#004e10' : row.approval_rate >= 0.60 ? '#7c5800' : '#5a403c' }}>
                            {Math.round(row.approval_rate * 100)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent Decisions */}
            <div className="rounded-xl card-shadow overflow-hidden" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1' }}>
              <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: '#e5e2e1' }}>
                <h3 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#1c1b1b' }}>Recent Decisions</h3>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg" style={{ color: '#5a403c' }}>search</span>
                  <input placeholder="Search businesses..."
                    className="pl-10 pr-4 rounded-lg border outline-none transition-all"
                    style={{ height: '40px', borderColor: '#e5e2e1', fontSize: '13px', width: '220px' }}
                    onFocus={(e) => e.target.style.borderColor = '#8b0000'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e2e1'}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead style={{ backgroundColor: '#f6f3f2' }}>
                    <tr style={{ borderBottom: '1px solid #e5e2e1' }}>
                      {['Business Name', 'Application ID', 'Score', 'Requested Amt', 'Decision'].map((h) => (
                        <th key={h} className="p-4 text-xs font-semibold" style={{ color: '#5a403c' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '14px' }}>
                    {(data?.recent_decisions || DEMO_DATA.recent_decisions).map((row) => (
                      <tr key={row.app_id} className="transition-colors hover:bg-red-50/30" style={{ borderBottom: '1px solid #f0eded' }}>
                        <td className="p-4 font-medium" style={{ color: '#1c1b1b' }}>{row.business}</td>
                        <td className="p-4 font-mono text-xs" style={{ color: '#5a403c' }}>{row.app_id}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{
                            backgroundColor: row.score >= 700 ? '#a3f69c' : row.score >= 600 ? '#fec65a' : '#ffdad6',
                            color: row.score >= 700 ? '#002204' : row.score >= 600 ? '#271900' : '#93000a',
                          }}>{row.score}</span>
                        </td>
                        <td className="p-4" style={{ color: '#1c1b1b' }}>{row.amount}</td>
                        <td className="p-4"><DecisionBadge decision={row.decision} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
