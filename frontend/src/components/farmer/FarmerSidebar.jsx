import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Package, LogOut, User, IndianRupee } from 'lucide-react'

const NAV_ITEMS = [
  {
    section: 'Main',
    links: [
      { to: '/farmer-dashboard', label: 'Dashboard', icon: Home },
      { to: '/farmer-dashboard/products', label: 'My Products', icon: Package },
      { to: '/farmer-dashboard/payments', label: 'My Payments', icon: IndianRupee },
    ],
  },
]

const FarmerSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const farmerRaw = localStorage.getItem('farmer')
  const farmer = farmerRaw ? JSON.parse(farmerRaw) : null

  const initials = farmer?.name
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? 'FA'

  const closeMobileDrawer = () => {
    // Close mobile drawer by unchecking checkbox
    const drawerCheckbox = document.getElementById('my-drawer-3')
    if (drawerCheckbox) {
      drawerCheckbox.checked = false
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('farmer')
    navigate('/login')
  }

  return (
    <div className="flex flex-col min-h-full w-64 bg-base-100 border-r border-base-300">

      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-base-300">
        <div className="w-9 h-9 rounded-lg bg-success/15 border border-success/25 flex items-center justify-center shrink-0">
          <Home size={17} className="text-success" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Farmer Trading</p>
          <span className="text-xs text-base-content/50">Farmer Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
        {NAV_ITEMS.map(({ section, links }) => (
          <div key={section}>
            <p className="text-[10px] font-semibold tracking-widest text-base-content/40 uppercase px-2 mb-1">
              {section}
            </p>
            <ul className="space-y-0.5">
              {links.map(({ to, label, icon: Icon }) => {
                const isActive = location.pathname === to
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      onClick={closeMobileDrawer}
                      className={`
                        flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors
                        ${isActive
                          ? 'bg-success/15 text-success font-medium'
                          : 'text-base-content/60 hover:bg-base-200 hover:text-base-content'
                        }
                      `}
                    >
                      <Icon size={15} />
                      {label}
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-success" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Farmer footer */}
      <div className="px-3 py-3 border-t border-base-300 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-info/15 border border-info/25 flex items-center justify-center text-xs font-semibold text-info shrink-0">
            {initials}
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-xs font-medium truncate">
              {farmer?.name ?? 'Farmer'}
            </p>
            <span className="text-[11px] text-base-content/50 truncate block">
              {farmer?.mobile ?? ''}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium text-error border border-error/30 bg-error/8 hover:bg-error/15 transition-colors"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>

    </div>
  )
}

export default FarmerSidebar