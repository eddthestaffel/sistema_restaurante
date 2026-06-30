import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(email, password)
      navigate('/salon')
    } catch (err) {
      setError('Credenciales incorrectas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page page-login">
      <div className="login-container">
        <section className="login-panel login-panel--brand">
          <img
            src="/src/assets/images/Logo.webp"
            alt="Pierre's Bistro logo"
            className="login-logo"
          />
          <div>
            <span className="login-eyebrow">Pierre's Bistro</span>
            <h1 className="login-title">Bienvenido a Pierre's Bistro</h1>
            <p className="login-text">
              Accede al panel de administración para gestionar mesas, comandas y menú con agilidad.
            </p>
          </div>
        </section>

        <section className="login-panel login-panel--form card">
          <div className="login-header">
            <div>
              <span className="login-eyebrow login-eyebrow--alt">Acceso seguro</span>
              <h2 className="login-form-title">Iniciar sesión</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@restaurante.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <div className="alert alert-error" role="alert">{error}</div>}

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Ingresando...' : 'Entrar'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}