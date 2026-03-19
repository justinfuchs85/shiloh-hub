import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/overview',   icon: '🏠', label: 'Overview' },
  { to: '/photos',     icon: '📷', label: 'Photos' },
  { to: '/timeline',   icon: '✅', label: 'Timeline' },
  { to: '/details',    icon: '📋', label: 'Details' },
  { to: '/expenses',   icon: '💰', label: 'Expenses' },
  { to: '/calculator', icon: '🔢', label: 'Calculator' },
  { to: '/notes',      icon: '📝', label: 'Notes' },
  { to: '/shopping',   icon: '🛒', label: 'Shopping' },
  { to: '/spaces',     icon: '🏡', label: 'Spaces' },
  { to: '/inventory',  icon: '📦', label: 'Inventory' },
  { to: '/utilities',  icon: '⚡', label: 'Utilities' },
  { to: '/projects',   icon: '🔨', label: 'Projects' },
  { to: '/contacts',   icon: '👥', label: 'Contacts' },
]

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="addr">4496 Shiloh Way Dr SE<br />Kentwood, MI 49546</div>
        <div className="badge">Offer Accepted</div>
      </div>

      <div className="nav-items">
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <a
          href="http://localhost:3000/admin"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}
        >
          ⚙ Admin Panel
        </a>
      </div>
    </nav>
  )
}
