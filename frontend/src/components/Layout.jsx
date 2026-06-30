import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Layout.module.css'

const navItems = [
  { to: '/salon', label: 'Salón' },
  { to: '/menu', label: 'Menú' },
  { to: '/comandas', label: 'Pedidos' },
  { to: '/cocina', label: 'Cocina' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logoWrapper}>
            <img
              src="/src/assets/images/Logo.webp"
              alt="Pierre's Bistro logo"
              className={styles.logo}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>
          <div className={styles.brandText}>
            <h1 className={styles.brandName}>Pierre's Bistro</h1>
            <span className={styles.brandSub}>Restaurante</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.nombre?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user?.nombre || 'Usuario'}</span>
              <span className={styles.userEmail}>{user?.email}</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Cerrar sesión">
            Salir
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
