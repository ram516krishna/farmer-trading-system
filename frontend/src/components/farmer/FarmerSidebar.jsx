
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Package, LogOut, User } from 'lucide-react'


const NAV_ITEMS = [
  {
    section: 'Main',
    links: [
      { to: '/farmer-dashboard', label: 'Dashboard', icon: Home },
      { to: '/farmer-dashboard/products', label: 'My Products', icon: Package },
    ],
  },
]

const FarmerSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const farmer = localStorage.getItem("farmer")

  const handleLogout = async () => {
    localStorage.removeItem("farmer")
    navigate('/login')

  }

  return (
    <div className="drawer-side border-r border-base-200">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <aside className="w-64 min-h-full bg-base-100">
        {/* Header */}
        <div className="p-6 border-b border-base-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <User size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-base-content">
                {farmer?.name || 'Farmer'}
              </h2>
              <p className="text-xs text-base-content/60">
                {farmer?.mobile}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {NAV_ITEMS.map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-6">
              <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-3 px-3">
                {section.section}
              </h3>
              <ul className="space-y-1">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to={link.to}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        location.pathname === link.to
                          ? 'bg-primary text-primary-content'
                          : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
                      }`}
                    >
                      <link.icon size={16} className="shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-base-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-error/80 hover:bg-error/10 hover:text-error transition-all"
          >
            <LogOut size={16} className="shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </div>
  )
}

export default FarmerSidebar
