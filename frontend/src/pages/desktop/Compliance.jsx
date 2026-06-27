import Sidebar from '../../components/Sidebar'

const ALERTS = [
  { id: 1, type: 'critical', icon: 'warning', title: 'GST Filing Deadline', description: 'GSTR-3B due in 3 days for 47 accounts. Ensure borrowers file on time to avoid score penalty.', date: 'Jun 30, 2024', color: '#ba1a1a', bg: '#ffdad6' },
  { id: 2, type: 'warning', icon: 'schedule', title: 'EPFO Compliance Review', description: 'Sharma Logistics Carriers has 2 consecutive months of delayed PF filing. Manual review recommended.', date: 'Jun 27, 2024', color: '#F57C00', bg: '#fff3e0' },
  { id: 3, type: 'info', icon: 'info', title: 'RBI Circular: MSME NPA Guidelines', description: 'Updated provisioning norms for MSME NPAs effective July 1, 2024. Review portfolio for impact.', date: 'Jun 25, 2024', color: '#7c5800', bg: '#ffdea7' },
  { id: 4, type: 'success', icon: 'check_circle', title: 'OCEN Integration Updated', description: 'Account Aggregator data pipeline successfully upgraded to AA Framework v2.1. All 5 active profiles migrated.', date: 'Jun 24, 2024', color: '#004e10', bg: '#a3f69c' },
  { id: 5, type: 'warning', icon: 'account_balance_wallet', title: 'Loan Disbursement Pending', description: 'Apex Manufacturing Works approval pending final disbursement. EMI schedule to be generated.', date: 'Jun 23, 2024', color: '#F57C00', bg: '#fff3e0' },
]

const COMPLIANCE_METRICS = [
  { name: 'GST Compliance Rate', value: '87%', status: 'good', trend: '+2%' },
  { name: 'EPFO Filing Rate', value: '91%', status: 'good', trend: '+1%' },
  { name: 'AA Data Freshness', value: '98%', status: 'good', trend: '0%' },
  { name: 'NPA Rate', value: '4.2%', status: 'warning', trend: '+0.3%' },
  { name: 'Overdue EMIs', value: '3', status: 'warning', trend: '+1' },
  { name: 'OCEN Payload Success', value: '100%', status: 'good', trend: '0%' },
]

export default function Compliance() {
  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: '#fcf9f8' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center px-6 shrink-0" style={{ backgroundColor: '#8b0000', minHeight: '48px' }}>
          <span className="text-white font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>Compliance Center</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-6">
              <h1 className="font-bold text-2xl" style={{ fontFamily: "'Poppins', sans-serif", color: '#1c1b1b' }}>Compliance Center</h1>
              <p style={{ color: '#5a403c', fontSize: '14px' }}>Regulatory alerts and compliance metrics for your MSME portfolio</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Alerts sidebar */}
              <div className="lg:col-span-1 space-y-3">
                <h2 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#1c1b1b' }}>Active Alerts</h2>
                {ALERTS.map((alert) => (
                  <div key={alert.id} className="rounded-xl p-4 card-shadow" style={{ backgroundColor: '#ffffff', border: `1px solid ${alert.bg}`, borderLeft: `4px solid ${alert.color}` }}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: alert.bg }}>
                        <span className="material-symbols-outlined text-sm" style={{ color: alert.color, fontVariationSettings: "'FILL' 1" }}>{alert.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif", color: '#1c1b1b' }}>{alert.title}</p>
                        <p className="text-xs mt-1" style={{ color: '#5a403c', lineHeight: '17px' }}>{alert.description}</p>
                        <p className="text-xs mt-1.5 font-medium" style={{ color: alert.color }}>{alert.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compliance metrics */}
              <div className="lg:col-span-2 space-y-5">
                <h2 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#1c1b1b' }}>Portfolio Health Metrics</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {COMPLIANCE_METRICS.map((metric) => (
                    <div key={metric.name} className="rounded-xl p-4 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1' }}>
                      <p className="text-xs font-medium mb-2" style={{ color: '#5a403c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{metric.name}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="font-bold text-2xl" style={{ fontFamily: "'Poppins', sans-serif", color: metric.status === 'good' ? '#004e10' : '#F57C00' }}>{metric.value}</p>
                        <span className="text-xs font-medium" style={{ color: metric.trend.startsWith('+') ? (metric.status === 'good' ? '#004e10' : '#F57C00') : '#5a403c' }}>{metric.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Regulatory Updates */}
                <div className="rounded-xl overflow-hidden card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1' }}>
                  <div className="px-5 py-4 border-b" style={{ borderColor: '#e5e2e1' }}>
                    <h3 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#1c1b1b' }}>Regulatory Updates</h3>
                  </div>
                  <div className="divide-y" style={{ divideColor: '#f0eded' }}>
                    {[
                      { title: 'OCEN 4.0 Full Compliance Required by Q3', date: 'Jul 1, 2024', status: 'Compliant' },
                      { title: 'RBI MSME Loan Restructuring Window Closes', date: 'Jun 30, 2024', status: 'Action Needed' },
                      { title: 'Account Aggregator Framework v2.1 Update', date: 'Jun 15, 2024', status: 'Completed' },
                      { title: 'GST Annual Return Filing for FY 2023-24', date: 'Dec 31, 2024', status: 'Upcoming' },
                    ].map((update) => (
                      <div key={update.title} className="px-5 py-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm" style={{ color: '#1c1b1b' }}>{update.title}</p>
                          <p className="text-xs" style={{ color: '#5a403c' }}>Due: {update.date}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold shrink-0" style={{
                          backgroundColor: update.status === 'Compliant' || update.status === 'Completed' ? '#a3f69c' : update.status === 'Action Needed' ? '#ffdad6' : '#fec65a',
                          color: update.status === 'Compliant' || update.status === 'Completed' ? '#002204' : update.status === 'Action Needed' ? '#93000a' : '#271900',
                        }}>
                          {update.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
