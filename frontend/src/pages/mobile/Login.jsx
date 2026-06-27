import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function MSMELogin() {
  const navigate = useNavigate()
  const [mobile, setMobile] = useState('9876543210')
  const [pin, setPin] = useState('1234')

  const handleLogin = (e) => {
    e.preventDefault()
    // For demo, we just navigate straight to health card
    navigate('/health-card')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fcf9f8', fontFamily: "'Noto Sans', sans-serif" }}>
      <header className="flex items-center px-5 w-full shrink-0" style={{ backgroundColor: '#8b0000', minHeight: '48px' }}>
        <button onClick={() => navigate(-1)} className="text-white p-1 rounded-full hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-white font-semibold ml-2" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '18px' }}>Login</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-5">
        <div className="w-full max-w-md bg-white rounded-xl overflow-hidden flex flex-col border card-shadow" style={{ borderColor: '#e3beb8' }}>
          
          <div className="p-6 flex flex-col gap-6 text-center">
            <div className="flex flex-col gap-2">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#ffdad4' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#8b0000', fontVariationSettings: "'FILL' 1" }}>lock_open</span>
              </div>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '24px', fontWeight: 600, color: '#1c1b1b' }}>
                Welcome Back
              </h2>
              <p style={{ fontSize: '15px', color: '#5a403c' }}>
                Login to access your FinPulse dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-2">
              <div className="text-left">
                <label className="block text-sm font-medium mb-1" style={{ color: '#5a403c' }}>Mobile Number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 focus:ring-red-900 transition-shadow"
                  style={{ borderColor: '#e3beb8', color: '#1c1b1b', backgroundColor: '#ffffff' }}
                  required
                />
              </div>

              <div className="text-left">
                <label className="block text-sm font-medium mb-1" style={{ color: '#5a403c' }}>4-Digit PIN</label>
                <input
                  type="password"
                  value={pin}
                  maxLength={4}
                  onChange={e => setPin(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 focus:ring-red-900 transition-shadow"
                  style={{ borderColor: '#e3beb8', color: '#1c1b1b', backgroundColor: '#ffffff', letterSpacing: '0.2em' }}
                  required
                />
              </div>
              
              <div className="text-right">
                <button type="button" className="text-sm font-semibold" style={{ color: '#8b0000' }}>Forgot PIN?</button>
              </div>

              <button
                type="submit"
                id="msme-login-submit-btn"
                className="w-full font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90 active:scale-95 mt-2"
                style={{ height: '48px', backgroundColor: '#8b0000', fontFamily: "'Poppins', sans-serif", fontSize: '16px' }}
              >
                Secure Login
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-5 flex justify-center items-center gap-2" style={{ color: '#5a403c' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock</span>
        <p style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.05em' }}>Secured by IDBI Bank · RBI Regulated</p>
      </footer>
    </div>
  )
}
