import { useNavigate } from 'react-router-dom'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fcf9f8', fontFamily: "'Noto Sans', sans-serif" }}>
      {/* Header — exact Stitch design */}
      <header className="flex justify-between items-center px-5 w-full" style={{ backgroundColor: '#8b0000', minHeight: '48px' }}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
          <h1 className="text-white font-semibold text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>FinPulse</h1>
        </div>
        <button className="text-white/80 p-2 rounded-full hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center p-5">
        <div className="w-full max-w-md bg-white rounded-xl overflow-hidden flex flex-col border card-shadow" style={{ borderColor: '#e3beb8' }}>
          {/* Hero illustration area */}
          <div className="w-full h-64 relative overflow-hidden" style={{ backgroundColor: '#f6f3f2' }}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFX4UPNm05I6bPDqZS5YGC-MN9K-Whk1azu5pjOHu5QpqSLybP6ha6gYr_dPELJaqYofX_e8VmEzQZQKFgKyhdO0KsWd4ahyrjKeTR6vNUn1UxguzzpX_wIieXOr3Ic_4RJyAIbr4qVuiRvEZvn56ET7LxtP0LWiGM2OtGrEtSiDw7gEihS3p0PU12T1YVkVjxlxuwwHu2ouGJjZsoQxFydOdK2JE_Ag9dXdtzGxBIaVa4BK858-TZnwpmAE-bHHZtwCoKCYIUvE4"
              alt="MSME owner illustration"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentElement.innerHTML = `
                  <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:linear-gradient(135deg,#ffdad4 0%,#fcf9f8 100%)">
                    <span class="material-symbols-outlined" style="font-size:64px;color:#8b0000;font-variation-settings:'FILL' 1">storefront</span>
                    <p style="font-family:Poppins,sans-serif;font-size:14px;color:#5a403c;font-weight:500">Your Trusted Banking Partner</p>
                  </div>`
              }}
            />
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col gap-6 text-center">
            <div className="flex flex-col gap-2">
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '26px', fontWeight: 600, lineHeight: '32px', color: '#1c1b1b' }}>
                Check if you can get a business loan
              </h2>
              <p style={{ fontSize: '16px', lineHeight: '24px', color: '#5a403c' }}>
                We use your GST and UPI data. No documents needed.
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <button
                id="get-started-btn"
                onClick={() => navigate('/connect-gst')}
                className="w-full font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ height: '48px', backgroundColor: '#8b0000', fontFamily: "'Poppins', sans-serif", fontSize: '16px' }}
              >
                Get Started — it's free
              </button>
              <button
                id="login-btn"
                onClick={() => navigate('/login')}
                className="w-full font-semibold rounded-lg transition-all duration-200 hover:bg-red-50 active:scale-95 border"
                style={{ height: '48px', color: '#610000', borderColor: '#610000', fontFamily: "'Poppins', sans-serif", fontSize: '16px', backgroundColor: 'transparent' }}
              >
                I already have an account — Login
              </button>
            </div>
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
