import { useState } from 'react'
import Sidebar from '../../components/Sidebar'

export default function Settings() {
  const officer = JSON.parse(localStorage.getItem('finpulse_officer') || '{"name":"Rajesh Kumar","id":"IDBI-OFF-001"}')
  const [form, setForm] = useState({ name: officer.name, email: 'officer@idbi.in', phone: '+91 98765 43210', branch: 'Mumbai Main', department: 'MSME Lending' })
  const [notifications, setNotifications] = useState({ email_alerts: true, sms_alerts: false, high_score: true, review_queue: true, compliance: true })
  const [apiConfig, setApiConfig] = useState({ ocen_endpoint: 'https://uli.org.in/api/v4/', aa_gateway: 'https://finvu.in/v2/', environment: 'production' })
  const [saved, setSaved] = useState(false)

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: '#fcf9f8' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center px-6 shrink-0" style={{ backgroundColor: '#8b0000', minHeight: '48px' }}>
          <span className="text-white font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>Settings</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="font-bold text-2xl" style={{ fontFamily: "'Poppins', sans-serif", color: '#1c1b1b' }}>Settings</h1>

            {/* Profile */}
            <div className="rounded-xl overflow-hidden card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: '#e5e2e1' }}>
                <h2 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#1c1b1b' }}>Officer Profile</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl text-white" style={{ backgroundColor: '#8b0000' }}>
                    {form.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: '#1c1b1b' }}>{form.name}</p>
                    <p className="text-sm" style={{ color: '#5a403c' }}>{officer.id} · {form.branch}</p>
                  </div>
                </div>

                {[
                  { label: 'Full Name', key: 'name', type: 'text' },
                  { label: 'Email', key: 'email', type: 'email' },
                  { label: 'Phone', key: 'phone', type: 'tel' },
                  { label: 'Branch', key: 'branch', type: 'text' },
                ].map((field) => (
                  <div key={field.key} className="flex flex-col gap-1">
                    <label className="text-sm font-medium" style={{ color: '#1c1b1b' }}>{field.label}</label>
                    <input type={field.type} value={form[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="rounded-xl border px-4 outline-none transition-all"
                      style={{ height: '44px', borderColor: '#e3beb8', fontSize: '14px' }}
                      onFocus={(e) => e.target.style.borderColor = '#8b0000'}
                      onBlur={(e) => e.target.style.borderColor = '#e3beb8'}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="rounded-xl overflow-hidden card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: '#e5e2e1' }}>
                <h2 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#1c1b1b' }}>Notification Preferences</h2>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { key: 'email_alerts', label: 'Email Alerts', desc: 'Get daily summaries via email' },
                  { key: 'sms_alerts', label: 'SMS Alerts', desc: 'Critical alerts via SMS' },
                  { key: 'high_score', label: 'High Score Notifications', desc: 'Alert when score ≥ 800' },
                  { key: 'review_queue', label: 'Review Queue Updates', desc: 'New applications added to queue' },
                  { key: 'compliance', label: 'Compliance Alerts', desc: 'Regulatory deadline reminders' },
                ].map((pref) => (
                  <div key={pref.key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-sm" style={{ color: '#1c1b1b' }}>{pref.label}</p>
                      <p className="text-xs" style={{ color: '#5a403c' }}>{pref.desc}</p>
                    </div>
                    <button onClick={() => setNotifications({ ...notifications, [pref.key]: !notifications[pref.key] })}
                      className="relative w-11 h-6 rounded-full transition-all duration-200"
                      style={{ backgroundColor: notifications[pref.key] ? '#8b0000' : '#e5e2e1' }}>
                      <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                        style={{ left: notifications[pref.key] ? '24px' : '4px' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* API Config */}
            <div className="rounded-xl overflow-hidden card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e2e1' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: '#e5e2e1' }}>
                <h2 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#1c1b1b' }}>API Configuration</h2>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: 'OCEN 4.0 Gateway', key: 'ocen_endpoint' },
                  { label: 'AA Framework Endpoint', key: 'aa_gateway' },
                ].map((field) => (
                  <div key={field.key} className="flex flex-col gap-1">
                    <label className="text-sm font-medium" style={{ color: '#1c1b1b' }}>{field.label}</label>
                    <input type="text" value={apiConfig[field.key]}
                      onChange={(e) => setApiConfig({ ...apiConfig, [field.key]: e.target.value })}
                      className="rounded-xl border px-4 outline-none transition-all font-mono"
                      style={{ height: '44px', borderColor: '#e3beb8', fontSize: '13px' }}
                      onFocus={(e) => e.target.style.borderColor = '#8b0000'}
                      onBlur={(e) => e.target.style.borderColor = '#e3beb8'}
                    />
                  </div>
                ))}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#a3f69c' }}>
                  <span className="material-symbols-outlined text-sm" style={{ color: '#004e10' }}>check_circle</span>
                  <p className="text-sm font-medium" style={{ color: '#004e10' }}>All systems operational · Environment: {apiConfig.environment}</p>
                </div>
              </div>
            </div>

            <button onClick={handleSave}
              className="w-full h-12 font-semibold text-white rounded-xl transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ backgroundColor: saved ? '#004e10' : '#8b0000', fontFamily: "'Poppins', sans-serif", fontSize: '15px' }}>
              {saved ? <><span className="material-symbols-outlined">check</span> Saved!</> : 'Save Changes'}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
