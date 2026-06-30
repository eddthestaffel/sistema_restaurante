import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getComandas, deleteComanda } from '../api/comandas'

export default function ComandasPage() {
  const [comandas, setComandas] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  const loadComandas = async () => {
    try {
      setError(null)
      setLoading(true)
      const res = await getComandas()
      setComandas(res.data.data || [])
    } catch (err) {
      setError('No se pudieron cargar los pedidos.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Deseas eliminar este pedido?')) {
      return
    }

    try {
      setError(null)
      setDeleting(true)
      await deleteComanda(id)
      await loadComandas()
    } catch (err) {
      setError('No se pudo eliminar el pedido.')
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    loadComandas()
  }, [])

  return (
    <div className="page page-comandas">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pedidos</h1>
          <p className="page-subtitle">Revisa todos los pedidos abiertos y accede al detalle para cerrarlos.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="page-card">
        <div className="page-actions">
          <span>{comandas.length} pedidos registrados</span>
          <button className="btn btn-accent btn-sm" type="button" onClick={loadComandas} disabled={loading}>
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mesa</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {comandas.map((comanda) => (
                <tr key={comanda.id}>
                  <td>{comanda.id}</td>
                  <td>{comanda.mesa?.numero || comanda.mesaId}</td>
                  <td>{comanda.estado}</td>
                  <td>{comanda.total?.toFixed(2) ?? '0.00'}</td>
                  <td>
                    <Link className="btn btn-primary btn-sm" to={`/comandas/${comanda.id}`}>
                      Ver detalle
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      type="button"
                      onClick={() => handleDelete(comanda.id)}
                      disabled={deleting}
                      style={{ marginLeft: 8 }}
                    >
                      Eliminar
                    </button>
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
