import { useState, useEffect } from 'react'
import { analyticsAPI } from '../../api/client'
import Sidebar from '../../components/Sidebar'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'

const DEMO = {
  kpis: { total_applications: 247, approval_rate: 0.68, avg_score: 687, ntc_approved: 89, portfolio_at_risk: 4.2 },
  score_distribution: [
    { range: '<600', count: 31 }, { range: '600-649', count: 48 },
    { range: '650-699', count: 62 }, { range: '700-749', count: 72 },
    { range: '750-800', count: 24 }, { range: '>800', count: 10 },
  ],
  sector_breakdown: [
    { sector: 'Manufacturing', volume: 78, approval_rate: 0.72 },
    { sector: 'Retail', volume: 54, approval_rate: 0.58 },
    { sector: 'Logistics', volume: 42, approval_rate: 0.61 },
    { sector: 'Textile', volume: 38, approval_rate: 0.74 },
    { sector: 'IT Services', volume: 21, approval_rate: 0.81 },
    { sector: 'Agri', volume: 14, approval_rate: 0.64 },
  ],
  monthly_trends: [
    { month: 'Jan', applications: 18, approvals: 12, avg_score: 671 },
    { month: 'Feb', applications: 15, approvals: 10, avg_score: 683 },
    { month: 'Mar', applications: 22, approvals: 15, avg_score: 692 },
    { month: 'Apr', applications: 19, approvals: 13, avg_score: 678 },
    { month: 'May', applications: 25, approvals: 17, avg_score: 701 },
    { month: 'Jun', applications: 28, approvals: 19, avg_score: 688 },
    { month: 'Jul', applications: 24, approvals: 16, avg_score: 695 },
    { month: 'Aug', applications: 31, approvals: 21, avg_score: 712 },
    { month: 'Sep', applications: 27, approvals: 18, avg_score: 704 },
    { month: 'Oct', applications: 21, approvals: 14, avg_score: 698 },
    { month: 'Nov', applications: 18, approvals: 12, avg_score: 685 },
    { month: 'Dec', applications: 14, approvals: 10, avg_score: 671 },
  ],
}

const COLORS = ['#8b0000', '#fec65a', '#004e10', '#e3beb8', '#ba1a1a', '#7c5800']

export default function Analytics() {
  const [data, setData] = useState(DEMO)

  useEffect(() => {
    analyticsAPI.getPortfolio().then(res => setData(res.data)).catch(() => setData(DEMO))
  }, [])

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: '#fcf9f8' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center px-6 shrink-0" style={{ backgroundColor: '#8b0000', minHeight: '48px' }}>
          <span className="text-white font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>Analytics Dashboard</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-screen-xl mx-auto space-y-6">
            <div>
              <h1 className="font-bold text-2xl" style={{ fontFamily: "'Poppins', sans-serif", color: '#1c1b1b' }}>Portfolio Analytics</h1>
              <p style={{ color: '#5a403c', fontSize: '14px' }}>Performance metrics across all 5 active MSME profiles</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Applications', value: data.kpis.total_applications, color: '#8b0000' },
                { label: 'Approval Rate', value: `${Math.round(data.kpis.approval_rate * 100)}%`, color: '#004e10' },
                { label: 'Average Score', value: data.kpis.avg_score, color: '#8b0000' },
                { label: 'NTC Approved', value: data.kpis.ntc_approved, color: '#7c5800' },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-xl p-4 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1' }}>
                  <p className="text-xs font-medium mb-1" style={{ color: '#5a403c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</p>
                  <p className="font-bold text-3xl" style={{ fontFamily: "'Poppins', sans-serif", color: kpi.color }}>{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Charts row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Monthly Trend Line */}
              <div className="rounded-xl p-5 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1', height: '300px', display: 'flex', flexDirection: 'column' }}>
                <h3 className="font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#1c1b1b' }}>Monthly Application Trends</h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.monthly_trends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0eded" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#5a403c' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#5a403c' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e3beb8', borderRadius: '8px', fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Line type="monotone" dataKey="applications" stroke="#8b0000" strokeWidth={2} dot={false} name="Applications" />
                      <Line type="monotone" dataKey="approvals" stroke="#004e10" strokeWidth={2} dot={false} name="Approvals" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Score Distribution Bar */}
              <div className="rounded-xl p-5 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1', height: '300px', display: 'flex', flexDirection: 'column' }}>
                <h3 className="font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#1c1b1b' }}>Score Distribution</h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.score_distribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0eded" />
                      <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#5a403c' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#5a403c' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e3beb8', borderRadius: '8px', fontSize: '12px' }} cursor={{ fill: '#ffdad4' }} />
                      <Bar dataKey="count" fill="#8b0000" radius={[4, 4, 0, 0]} name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Charts row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Sector Donut */}
              <div className="rounded-xl p-5 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1', height: '300px', display: 'flex', flexDirection: 'column' }}>
                <h3 className="font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#1c1b1b' }}>Sector Mix</h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.sector_breakdown} dataKey="volume" nameKey="sector" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                        {data.sector_breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e3beb8', borderRadius: '8px', fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Approval Rate by Sector Bar */}
              <div className="rounded-xl p-5 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1', height: '300px', display: 'flex', flexDirection: 'column' }}>
                <h3 className="font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#1c1b1b' }}>Approval Rate by Sector</h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.sector_breakdown} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0eded" horizontal={false} />
                      <XAxis type="number" domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} tick={{ fontSize: 10, fill: '#5a403c' }} />
                      <YAxis type="category" dataKey="sector" tick={{ fontSize: 10, fill: '#5a403c' }} width={80} />
                      <Tooltip formatter={(v) => `${Math.round(v * 100)}%`} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e3beb8', borderRadius: '8px', fontSize: '12px' }} />
                      <Bar dataKey="approval_rate" fill="#004e10" radius={[0, 4, 4, 0]} name="Approval Rate" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Average Score Trend */}
            <div className="rounded-xl p-5 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1', height: '280px', display: 'flex', flexDirection: 'column' }}>
              <h3 className="font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#1c1b1b' }}>Average Score Trend (Monthly)</h3>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.monthly_trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0eded" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#5a403c' }} />
                    <YAxis domain={[650, 730]} tick={{ fontSize: 10, fill: '#5a403c' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e3beb8', borderRadius: '8px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="avg_score" stroke="#fec65a" strokeWidth={3} dot={{ fill: '#8b0000', r: 4 }} name="Avg Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
