import { Outlet } from 'react-router-dom'

export default function MobileLayout() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e5e2e1' }}>
      <div className="max-w-md mx-auto min-h-screen relative shadow-2xl flex flex-col bg-white overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  )
}
