import { useEffect, useState } from 'react'
import { getCocinaItems, cambiarEstadoCocina } from '../api/cocina'

const estadoBadge = {
  pendiente: 'badge-pendiente',
  preparando: 'badge-en_preparacion',
  listo: 'badge-listo',
}

const estadoTexto = {
  pendiente: 'Pendiente de comenzar',
  preparando: 'En preparación',
  listo: 'Listo para servir',
}

export default function CocinaPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState(null)

  const loadItems = async () => {
    try {
      setError(null)
      setLoading(true)
      const params = filter === 'all' ? undefined : { estadoCocina: filter }
      const res = await getCocinaItems(params)
      setItems(res.data.data || [])
    } catch (err) {
      setError('No se pudieron cargar los pedidos de cocina.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [filter])

  const handleChangeState = async (itemId, targetEstado) => {
    try {
      setError(null)
      setSavingId(itemId)
      await cambiarEstadoCocina(itemId, targetEstado)
      await loadItems()
    } catch (err) {
      setError('No se pudo actualizar el estado del plato.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="page page-cocina">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cocina</h1>
          <p className="page-subtitle">Controla el avance de los platos y lleva un seguimiento claro de cada orden.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="page-card">
        <div className="page-actions" style={{ gap: 12, flexWrap: 'wrap' }}>
          <span>{items.length} ítems en cocina</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['all', 'pendiente', 'preparando', 'listo'].map((value) => (
              <button
                key={value}
                className={`btn btn-sm ${filter === value ? 'btn-primary' : 'btn-ghost'}`}
                type="button"
                onClick={() => setFilter(value)}
                disabled={loading}
              >
                {value === 'all' ? 'Todos' : value === 'pendiente' ? 'Pendientes' : value === 'preparando' ? 'Preparando' : 'Listos'}
              </button>
            ))}
          </div>
          <button className="btn btn-accent btn-sm" type="button" onClick={loadItems} disabled={loading}>
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Plato</th>
                <th>Mesa</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.menuItem?.nombre || 'Sin nombre'}</td>
                  <td>{item.comanda?.mesa?.numero || item.comanda?.mesaId}</td>
                  <td>
                    <div style={{ display: 'grid', gap: 6 }}>
                      <span className={`badge ${estadoBadge[item.estadoCocina] || ''}`}>
                        {item.estadoCocina}
                      </span>
                      <small style={{ color: '#5a5a5a' }}>{estadoTexto[item.estadoCocina] || 'Sin seguimiento'}</small>
                    </div>
                  </td>
                  <td>
                    {item.estadoCocina === 'pendiente' && (
                      <button
                        className="btn btn-primary btn-sm"
                        type="button"
                        disabled={savingId === item.id}
                        onClick={() => handleChangeState(item.id, 'preparando')}
                      >
                        {savingId === item.id ? 'Actualizando...' : 'Iniciar'}
                      </button>
                    )}
                    {item.estadoCocina === 'preparando' && (
                      <button
                        className="btn btn-success btn-sm"
                        type="button"
                        disabled={savingId === item.id}
                        onClick={() => handleChangeState(item.id, 'listo')}
                      >
                        {savingId === item.id ? 'Actualizando...' : 'Marcar listo'}
                      </button>
                    )}
                    {item.estadoCocina === 'listo' && <span className="badge badge-listo">Listo</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
