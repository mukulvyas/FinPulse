import { useNavigate, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { id: 'home', label: 'Home', icon: 'home', path: '/health-card' },
    { id: 'loans', label: 'Loans', icon: 'payments', path: '/loan-offers' },
    { id: 'profile', label: 'Profile', icon: 'person', path: '/profile' }
  ]

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t flex justify-around items-center h-16 z-50 bg-white" style={{ borderColor: '#e3beb8' }}>
      {tabs.map(tab => {
        const isActive = location.pathname === tab.path
        return (
          <button 
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors"
            style={{ color: isActive ? '#8b0000' : '#8e706b' }}
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
              {tab.icon}
            </span>
            <span style={{ fontSize: '11px', fontWeight: isActive ? 600 : 500, fontFamily: "'Noto Sans', sans-serif" }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
