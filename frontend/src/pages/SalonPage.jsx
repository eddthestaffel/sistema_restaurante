import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSalon, createMesa } from '../api/mesas'
import { abrirComanda } from '../api/comandas'

const estadoBadge = {
  libre: 'badge-libre',
  ocupada: 'badge-ocupada',
}

export default function SalonPage() {
  const [mesas, setMesas] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingMesa, setSavingMesa] = useState(null)
  const [creatingMesa, setCreatingMesa] = useState(false)
  const [newMesa, setNewMesa] = useState({ numero: '', capacidad: '', ubicacion: '' })
  const [error, setError] = useState(null)

  const loadMesas = async () => {
    try {
      setError(null)
      setLoading(true)
      const res = await getSalon()
      setMesas(res.data.data || [])
    } catch (err) {
      setError('No se pudo cargar las mesas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMesas()
  }, [])

  const handleMesaChange = (event) => {
    const { name, value } = event.target
    setNewMesa((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateMesa = async (event) => {
    event.preventDefault()
    try {
      setError(null)
      setCreatingMesa(true)
      await createMesa({
        numero: Number(newMesa.numero) || undefined,
        capacidad: Number(newMesa.capacidad) || undefined,
        ubicacion: newMesa.ubicacion,
      })
      setNewMesa({ numero: '', capacidad: '', ubicacion: '' })
      await loadMesas()
    } catch (err) {
      setError('No se pudo crear la mesa. Revisa los datos e intenta de nuevo.')
    } finally {
      setCreatingMesa(false)
    }
  }

  const handleAbrir = async (mesaId) => {
    try {
      setError(null)
      setSavingMesa(mesaId)
      await abrirComanda(mesaId)
      await loadMesas()
    } catch (err) {
      setError('No se pudo abrir la comanda. Revisa la mesa e intenta nuevamente.')
    } finally {
      setSavingMesa(null)
    }
  }

  return (
    <div className="page page-salon">
      <div className="page-header">
        <div>
          <h1 className="page-title">Salón</h1>
          <p className="page-subtitle">Gestiona las mesas y abre comandas rápidamente desde una vista centralizada.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="page-card">
        <h2 style={{ marginBottom: 16 }}>Agregar mesa</h2>
        <form className="login-form" onSubmit={handleCreateMesa}>
          <div className="form-group">
            <label htmlFor="numero">Número de mesa</label>
            <input id="numero" name="numero" type="number" className="form-control" value={newMesa.numero} onChange={handleMesaChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="capacidad">Capacidad</label>
            <input id="capacidad" name="capacidad" type="number" className="form-control" value={newMesa.capacidad} onChange={handleMesaChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="ubicacion">Ubicación</label>
            <input id="ubicacion" name="ubicacion" className="form-control" value={newMesa.ubicacion} onChange={handleMesaChange} required />
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={creatingMesa}>
            {creatingMesa ? 'Guardando...' : 'Crear mesa'}
          </button>
        </form>
      </div>

      <div className="page-card">
        <div className="page-actions">
          <span>{mesas.length} mesas cargadas</span>
          <button className="btn btn-accent btn-sm" onClick={loadMesas} disabled={loading}>
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Mesa</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Comanda abierta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mesas.map((mesa) => {
                const abierta = mesa.comandas?.[0]
                return (
                  <tr key={mesa.id}>
                    <td>{mesa.numero}</td>
                    <td>{mesa.ubicacion}</td>
                    <td className="status-cell">
                      <span className={`badge ${estadoBadge[mesa.estado] || ''}`}>
                        {mesa.estado}
                      </span>
                    </td>
                    <td>
                      {abierta ? (
                        <Link to={`/comandas/${abierta.id}`} className="btn btn-ghost btn-sm">
                          Ver comanda
                        </Link>
                      ) : (
                        <span className="badge badge-libre">Sin comanda</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        type="button"
                        disabled={mesa.estado !== 'libre' || savingMesa === mesa.id}
                        onClick={() => handleAbrir(mesa.id)}
                      >
                        {savingMesa === mesa.id ? 'Abriendo...' : 'Abrir comanda'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
