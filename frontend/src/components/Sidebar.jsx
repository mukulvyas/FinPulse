import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/officer/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/officer/applications', icon: 'description', label: 'Applications' },
  { path: '/officer/analytics', icon: 'analytics', label: 'Analytics' },
  { path: '/officer/compliance', icon: 'verified_user', label: 'Compliance' },
  { path: '/officer/settings', icon: 'settings', label: 'Settings' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const officer = JSON.parse(localStorage.getItem('finpulse_officer') || '{"name":"Officer","id":"IDBI-001"}')

  const handleLogout = () => {
    localStorage.removeItem('finpulse_token')
    localStorage.removeItem('finpulse_officer')
    navigate('/officer/login')
  }

  return (
    <nav className="hidden lg:flex flex-col h-full py-8 border-r shrink-0 overflow-y-auto" style={{ width: '240px', backgroundColor: '#ffffff', borderColor: '#e3beb8' }}>
      {/* Brand */}
      <div className="px-5 mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#8b0000' }}>
            <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
          </div>
          <div>
            <h2 className="font-bold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#8b0000' }}>IDBI FinPulse</h2>
            <p style={{ fontSize: '11px', color: '#5a403c' }}>Bank Officer Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ul className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/officer/dashboard' && location.pathname === '/officer')
          return (
            <li key={item.path}>
              <button
                id={`nav-${item.label.toLowerCase()}`}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-left"
                style={{
                  backgroundColor: isActive ? '#ffdad4' : 'transparent',
                  color: isActive ? '#8b0000' : '#5a403c',
                  borderRight: isActive ? '3px solid #8b0000' : '3px solid transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '14px',
                }}
              >
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>

      {/* Officer info + logout */}
      <div className="px-5 pt-4 border-t mt-4" style={{ borderColor: '#e3beb8' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0" style={{ backgroundColor: '#8b0000' }}>
            {officer.name?.charAt(0) || 'O'}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color: '#1c1b1b', fontFamily: "'Poppins', sans-serif" }}>{officer.name}</p>
            <p className="text-xs truncate" style={{ color: '#5a403c' }}>{officer.id}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-red-50 transition-colors" style={{ color: '#ba1a1a' }}>
          <span className="material-symbols-outlined text-base">logout</span>
          Logout
        </button>
      </div>
    </nav>
  )
}
