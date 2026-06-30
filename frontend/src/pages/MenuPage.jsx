import { useEffect, useState } from 'react'
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../api/menu'

export default function MenuPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '', categoria: '', precio: '' })
  const [editId, setEditId] = useState(null)

  const loadMenu = async () => {
    try {
      setError(null)
      setLoading(true)
      const res = await getMenuItems()
      setItems(res.data.data || [])
    } catch (err) {
      setError('No se pudieron cargar los ítems del menú.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMenu()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setError(null)
      setMessage(null)
      setSaving(true)
      if (editId) {
        await updateMenuItem(editId, {
          nombre: form.nombre,
          descripcion: form.descripcion,
          categoria: form.categoria,
          precio: Number(form.precio) || 0,
        })
        setMessage('Artículo actualizado correctamente.')
        setEditId(null)
      } else {
        await createMenuItem({
          nombre: form.nombre,
          descripcion: form.descripcion,
          categoria: form.categoria,
          precio: Number(form.precio) || 0,
          activo: true,
        })
        setMessage('Artículo agregado correctamente.')
      }
      setForm({ nombre: '', descripcion: '', categoria: '', precio: '' })
      await loadMenu()
    } catch (err) {
      setError(editId ? 'No se pudo actualizar el artículo.' : 'No se pudo crear el artículo del menú. Revisa los datos e intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActivo = async (item) => {
    try {
      setError(null)
      setSaving(true)
      await updateMenuItem(item.id, { activo: !item.activo })
      await loadMenu()
    } catch (err) {
      setError('No se pudo actualizar el estado del artículo.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Deseas eliminar el ítem ${item.nombre}?`)) {
      return
    }
    try {
      setError(null)
      setSaving(true)
      await deleteMenuItem(item.id)
      await loadMenu()
    } catch (err) {
      setError('No se pudo eliminar el artículo.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item) => {
    setEditId(item.id)
    setForm({
      nombre: item.nombre || '',
      descripcion: item.descripcion || '',
      categoria: item.categoria || '',
      precio: item.precio?.toString() || '',
    })
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setForm({ nombre: '', descripcion: '', categoria: '', precio: '' })
  }

  return (
    <div className="page page-menu">
      <div className="page-header">
        <div>
          <h1 className="page-title">Menú</h1>
          <p className="page-subtitle">Gestiona los platos, actualiza precios y elimina artículos del menú.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="page-card">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="categoria">Categoría</label>
            <input id="categoria" name="categoria" className="form-control" value={form.categoria} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="precio">Precio</label>
            <input id="precio" name="precio" type="number" step="0.01" className="form-control" value={form.precio} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea id="descripcion" name="descripcion" className="form-control" value={form.descripcion} onChange={handleChange} rows="3" />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? 'Guardando...' : editId ? 'Actualizar artículo' : 'Agregar artículo'}
          </button>
          {editId && (
            <button type="button" className="btn btn-ghost btn-sm" style={{ marginLeft: 12 }} onClick={handleCancelEdit} disabled={saving}>
              Cancelar edición
            </button>
          )}
        </form>
      </div>

      <div className="page-card">
        <div className="page-actions">
          <span>{items.length} artículos en el menú</span>
          <button className="btn btn-accent btn-sm" type="button" onClick={loadMenu} disabled={loading}>
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td>{item.categoria}</td>
                  <td>{item.precio?.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${item.activo ? 'badge-success' : 'badge-danger'}`}>
                      {item.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                              <button className="btn btn-ghost btn-sm" type="button" onClick={() => handleToggleActivo(item)} disabled={saving}>
                      {item.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    <button className="btn btn-primary btn-sm" type="button" onClick={() => handleEdit(item)} disabled={saving}>
                      Editar
                    </button>
                    <button className="btn btn-danger btn-sm" type="button" onClick={() => handleDelete(item)} disabled={saving}>
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
