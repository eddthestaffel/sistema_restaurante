# API Restaurante - Express + Sequelize + JWT

Backend MVP para el proyecto **04-restaurante**, inspirado en Fudo. Mantiene la estructura del ZIP original: Express, Sequelize, migraciones, seeders, controladores, rutas, validadores y autenticacion JWT.

## Requisitos

- Node.js 18 o superior
- npm
- Base de datos MySQL/MariaDB creada con el nombre `restaurante_db`

## Instalacion

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

La API queda en `http://localhost:3000`.

> Si usas Windows y no tienes `cp`, copia manualmente `.env.example` como `.env`.

## Variables de entorno

El archivo `.env.example` ya viene apuntando a la base solicitada:

```env
DB_DIALECT=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=restaurante_db
DB_USER=root
DB_PASSWORD=
```

Cambia `DB_USER` y `DB_PASSWORD` si tu MySQL usa otra credencial.

## Usuario demo

Luego de ejecutar `npm run db:seed`:

| Campo | Valor |
| --- | --- |
| Email | `profesor@ejemplo.cl` |
| Password | `demo1234` |

## Flujo rapido en Postman

1. `POST /auth/login`
2. Copiar el `accessToken`
3. Usar `Authorization: Bearer TU_TOKEN`
4. Probar las rutas de restaurante

## Endpoints

### Salud

| Metodo | Ruta | Auth |
| --- | --- | --- |
| GET | `/` | No |
| GET | `/health` | No |

### Autenticacion

| Metodo | Ruta | Auth |
| --- | --- | --- |
| POST | `/auth/register` | No |
| POST | `/auth/login` | No |
| POST | `/auth/refresh` | No |
| POST | `/auth/logout` | Bearer |
| GET | `/auth/me` | Bearer |
| PATCH | `/auth/me` | Bearer |
| GET | `/auth/sesiones` | Bearer |
| DELETE | `/auth/sesiones/:id` | Bearer |
| DELETE | `/auth/sesiones` | Bearer |

### Mesas

| Metodo | Ruta | Auth | Historia |
| --- | --- | --- | --- |
| GET | `/mesas` | Bearer | HU-02 |
| GET | `/mesas/salon` | Bearer | HU-03 |
| GET | `/mesas/:id` | Bearer | HU-02 |
| POST | `/mesas` | Bearer | HU-01 |
| PATCH | `/mesas/:id` | Bearer | HU-02 / HU-08 |
| DELETE | `/mesas/:id` | Bearer | HU-02 |

### Menu

| Metodo | Ruta | Auth | Historia |
| --- | --- | --- | --- |
| GET | `/menu` | Bearer | HU-02 |
| GET | `/menu/:id` | Bearer | HU-02 |
| POST | `/menu` | Bearer | HU-02 |
| PATCH | `/menu/:id` | Bearer | HU-02 |
| DELETE | `/menu/:id` | Bearer | HU-02 |

### Comandas

| Metodo | Ruta | Auth | Historia |
| --- | --- | --- | --- |
| GET | `/comandas` | Bearer | HU-04/HU-07 |
| GET | `/comandas/:id` | Bearer | HU-04/HU-07 |
| POST | `/comandas` | Bearer | HU-04 |
| POST | `/comandas/:id/items` | Bearer | HU-05 |
| GET | `/comandas/:id/total` | Bearer | HU-07 |
| POST | `/comandas/:id/cerrar` | Bearer | HU-06 / HU-OPC-02 |

### Cocina bonus

| Metodo | Ruta | Auth | Historia |
| --- | --- | --- | --- |
| GET | `/cocina` | Bearer | HU-OPC-01 |
| PATCH | `/cocina/items/:itemId` | Bearer | HU-OPC-01 |

## Ejemplos JSON

Abrir comanda:

```json
{
  "mesaId": 1
}
```

Agregar item:

```json
{
  "menuItemId": 1,
  "cantidad": 2
}
```

Cerrar comanda con propina:

```json
{
  "propina": 1000
}
```

Cambiar estado cocina:

```json
{
  "estadoCocina": "preparando"
}
```

## Historias cubiertas

- MVP-GEN-01: Repositorio ejecutable
- MVP-GEN-02: Variables de entorno documentadas
- MVP-GEN-03: Base de datos y modelos
- MVP-GEN-04: Registro de usuario
- MVP-GEN-05: Login con JWT
- HU-01: Registrar mesas
- HU-02: Gestionar mesas y menu
- HU-03: Vista salon
- HU-04: Abrir comanda
- HU-05: Agregar items a comanda
- HU-06: Cerrar comanda y liberar mesa
- HU-07: Total de cuenta
- HU-08: No liberar mesa con comanda abierta
- HU-OPC-01: Vista cocina
- HU-OPC-02: Propina al cerrar

## Estructura

```text
src/
  config/
  controllers/
  middlewares/
  migrations/
  models/
  routes/
  seeders/
  services/
  validators/
```

