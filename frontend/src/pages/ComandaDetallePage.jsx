import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getComanda, agregarItem, cerrarComanda } from '../api/comandas'
import { getMenuItems } from '../api/menu'

export default function ComandaDetallePage() {
  const { id } = useParams()
  const [comanda, setComanda] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [cantidad, setCantidad] = useState(1)
  const [menuItemId, setMenuItemId] = useState('')
  const [propina, setPropina] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const loadComanda = async () => {
    try {
      setError(null)
      const res = await getComanda(id)
      setComanda(res.data.data)
      setPropina(res.data.data?.propina || 0)
    } catch (err) {
      setError('No se pudo cargar la comanda.')
    }
  }

  const loadMenu = async () => {
    try {
      const res = await getMenuItems({ activo: true })
      setMenuItems(res.data.data || [])
      if (!menuItemId && res.data.data?.length) {
        setMenuItemId(res.data.data[0].id)
      }
    } catch (err) {
      setError('No se pudieron cargar los ítems del menú.')
    }
  }

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true)
      await Promise.all([loadComanda(), loadMenu()])
      setLoading(false)
    }
    loadAll()
  }, [id])

  const handleAddItem = async (event) => {
    event.preventDefault()
    try {
      setError(null)
      setMessage(null)
      setSaving(true)
      await agregarItem(id, menuItemId, Number(cantidad) || 1)
      await loadComanda()
      setCantidad(1)
      setMessage('Artículo agregado correctamente.')
    } catch (err) {
      setError('No se pudo agregar el artículo.')
    } finally {
      setSaving(false)
    }
  }

  const handleCloseComanda = async () => {
    try {
      setError(null)
      setMessage(null)
      setSaving(true)
      await cerrarComanda(id, Number(propina) || 0)
      await loadComanda()
      setMessage('Comanda cerrada exitosamente.')
    } catch (err) {
      setError('No se pudo cerrar la comanda.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page page-comanda-detalle">
      <div className="page-header">
        <div>
          <h1 className="page-title">Detalle del pedido</h1>
          <p className="page-subtitle">Visualizando el pedido con ID: {id}</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="page-card">
        {loading ? (
          <p>Cargando información del pedido...</p>
        ) : comanda ? (
          <>
            <div className="page-actions">
              <div>
                <strong>Mesa:</strong> {comanda.mesa?.numero || comanda.mesaId}
                <span style={{ marginLeft: 16 }}><strong>Estado:</strong> {comanda.estado}</span>
              </div>
              <button
                className="btn btn-danger btn-sm"
                type="button"
                onClick={handleCloseComanda}
                disabled={saving || comanda.estado === 'cerrada'}
              >
                {comanda.estado === 'cerrada' ? 'Comanda cerrada' : saving ? 'Cerrando...' : 'Cerrar comanda'}
              </button>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Plato</th>
                    <th>Cantidad</th>
                    <th>Precio unitario</th>
                    <th>Subtotal</th>
                    <th>Estado cocina</th>
                  </tr>
                </thead>
                <tbody>
                  {comanda.items?.length ? (
                    comanda.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.menuItem?.nombre || 'N/D'}</td>
                        <td>{item.cantidad}</td>
                        <td>{item.precioUnitario?.toFixed(2)}</td>
                        <td>{item.subtotal?.toFixed(2)}</td>
                        <td>{item.estadoCocina}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No hay artículos en esta comanda.</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" />
                    <td><strong>Subtotal</strong></td>
                    <td>{comanda.subtotal?.toFixed(2) ?? '0.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" />
                    <td><strong>Propina</strong></td>
                    <td>{Number(comanda.propina || propina).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" />
                    <td><strong>Total</strong></td>
                    <td>{comanda.total?.toFixed(2) ?? '0.00'}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {comanda.estado === 'abierta' && (
              <>
                <form className="login-form" onSubmit={handleAddItem}>
                  <div className="form-group">
                    <label htmlFor="menuItem">Agregar plato</label>
                    <select id="menuItem" name="menuItem" className="form-control" value={menuItemId} onChange={(e) => setMenuItemId(e.target.value)}>
                      {menuItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nombre} — {item.categoria}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="cantidad">Cantidad</label>
                    <input
                      id="cantidad"
                      name="cantidad"
                      type="number"
                      min="1"
                      className="form-control"
                      value={cantidad}
                      onChange={(e) => setCantidad(Number(e.target.value) || 1)}
                    />
                  </div>
                  <button className="btn btn-primary btn-lg" type="submit" disabled={saving}>
                    {saving ? 'Agregando...' : 'Agregar plato'}
                  </button>
                </form>

                <form className="login-form" style={{ marginTop: 24 }} onSubmit={(e) => { e.preventDefault(); handleCloseComanda(); }}>
                  <div className="form-group">
                    <label htmlFor="propina">Propina opcional</label>
                    <input
                      id="propina"
                      name="propina"
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      value={propina}
                      onChange={(e) => setPropina(Number(e.target.value) || 0)}
                    />
                  </div>
                  <button className="btn btn-danger btn-lg" type="submit" disabled={saving}>
                    {saving ? 'Cerrando...' : 'Cerrar comanda y liberar mesa'}
                  </button>
                </form>
              </>
            )}
          </>
        ) : (
          <p>La comanda no está disponible.</p>
        )}
      </div>
    </div>
  )
}
