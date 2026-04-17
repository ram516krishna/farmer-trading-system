import React from 'react'
import { Outlet } from 'react-router-dom'
import FarmerSidebar from './FarmerSidebar'

const FarmerLayout = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Mobile menu button */}
      <label htmlFor="my-drawer" className="drawer-overlay lg:hidden">
        <div className="fixed top-4 left-4 z-40">
          <label htmlFor="my-drawer" className="btn btn-primary btn-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
        </div>
      </label>

      {/* Main content */}
      <div className="drawer-content flex-1">
        <main className="min-h-screen bg-base-200">
          <div className="p-4 lg:p-6 lg:ml-64">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sidebar */}
      <FarmerSidebar />
    </div>
  )
}

export default FarmerLayout
