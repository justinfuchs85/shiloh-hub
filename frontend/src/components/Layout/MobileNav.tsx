import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/overview',   icon: '🏠', label: 'Overview' },
  { to: '/photos',     icon: '📷', label: 'Photos' },
  { to: '/timeline',   icon: '✅', label: 'Timeline' },
  { to: '/details',    icon: '📋', label: 'Details' },
  { to: '/expenses',   icon: '💰', label: 'Expenses' },
  { to: '/calculator', icon: '🔢', label: 'Calc' },
  { to: '/notes',      icon: '📝', label: 'Notes' },
  { to: '/shopping',   icon: '🛒', label: 'Shopping' },
  { to: '/spaces',     icon: '🏡', label: 'Spaces' },
  { to: '/inventory',  icon: '📦', label: 'Inventory' },
  { to: '/utilities',  icon: '⚡', label: 'Utilities' },
  { to: '/projects',   icon: '🔨', label: 'Projects' },
  { to: '/contacts',   icon: '👥', label: 'Contacts' },
]

export default function MobileNav() {
  return (
    <div className="mobile-nav">
      {NAV.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}
        >
          {icon} {label}
        </NavLink>
      ))}
    </div>
  )
}
