import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'

export default function Profile() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('health_card')
    if (stored) {
      try { setData(JSON.parse(stored)) } catch {}
    }
  }, [])

  const businessName = data?.business_name || 'Raju Textiles Pvt Ltd'
  const gstin = data?.gstin || '27AABCU9603R1ZX'
  const city = data?.city || 'Surat'

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fcf9f8' }}>
      <header className="flex items-center justify-between px-5 shrink-0" style={{ backgroundColor: '#8b0000', minHeight: '48px' }}>
        <button onClick={() => navigate(-1)} className="text-white p-1 rounded-full hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '18px' }}>My Profile</h1>
        <div className="w-8" />
      </header>

      <main className="flex-1 overflow-y-auto p-5 pb-24 space-y-6">
        {/* Header section */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3 card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e3beb8' }}>
            <span className="material-symbols-outlined text-4xl" style={{ color: '#8b0000' }}>storefront</span>
          </div>
          <h2 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '20px', color: '#1c1b1b' }}>{businessName}</h2>
          <p style={{ color: '#5a403c', fontSize: '13px' }}>GSTIN: {gstin} • {city}</p>
        </div>

        {/* Linked Accounts */}
        <div>
          <h3 className="font-semibold mb-3 px-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#1c1b1b' }}>Data Sources Connected</h3>
          <div className="rounded-2xl overflow-hidden card-shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #e3beb8' }}>
            
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#f0eded' }}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined" style={{ color: '#5a403c' }}>receipt_long</span>
                <span style={{ fontSize: '14px', color: '#1c1b1b', fontWeight: 500 }}>GST Network</span>
              </div>
              <span className="material-symbols-outlined" style={{ color: '#004e10', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>

            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#f0eded' }}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined" style={{ color: '#5a403c' }}>payments</span>
                <span style={{ fontSize: '14px', color: '#1c1b1b', fontWeight: 500 }}>Bank & UPI (Account Aggregator)</span>
              </div>
              <span className="material-symbols-outlined" style={{ color: '#004e10', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined" style={{ color: '#5a403c' }}>group</span>
                <span style={{ fontSize: '14px', color: '#1c1b1b', fontWeight: 500 }}>EPFO</span>
              </div>
              <span className="material-symbols-outlined" style={{ color: '#004e10', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>

          </div>
        </div>

        {/* Business Owner */}
        <div>
          <h3 className="font-semibold mb-3 px-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#1c1b1b' }}>Owner Details</h3>
          <div className="rounded-2xl p-4 card-shadow space-y-3" style={{ backgroundColor: '#ffffff', border: '1px solid #e3beb8' }}>
            <div className="flex justify-between">
              <span style={{ fontSize: '13px', color: '#5a403c' }}>Name</span>
              <span style={{ fontSize: '13px', color: '#1c1b1b', fontWeight: 500 }}>Rajesh Kumar</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: '13px', color: '#5a403c' }}>Mobile</span>
              <span style={{ fontSize: '13px', color: '#1c1b1b', fontWeight: 500 }}>+91 98765 43210</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: '13px', color: '#5a403c' }}>Verification</span>
              <span style={{ fontSize: '13px', color: '#004e10', fontWeight: 500 }}>KYC Verified (DigiLocker)</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white border" style={{ borderColor: '#e3beb8' }}>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ color: '#5a403c' }}>help</span>
              <span style={{ fontSize: '14px', color: '#1c1b1b', fontWeight: 500 }}>Help & Support</span>
            </div>
            <span className="material-symbols-outlined" style={{ color: '#8e706b' }}>chevron_right</span>
          </button>
          
          <button 
            onClick={() => {
              sessionStorage.removeItem('health_card')
              navigate('/')
            }}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl" 
            style={{ backgroundColor: '#ffdad6', color: '#93000a' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
            <span style={{ fontSize: '14px', fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>Log Out</span>
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
