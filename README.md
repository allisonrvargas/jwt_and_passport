# API Gremio de Cazadores (JWT & Passport)

Una API RESTful profesional, modular y segura construida con **Node.js**, **Express**, **Passport.js** y **JWT** (JSON Web Tokens) estructurada bajo una arquitectura limpia por capas.

---

## Instalación y Ejecución

Requiere **Node.js 22.9 o superior**.

1. **Clonar e instalar dependencias:**
   ```bash
   git clone https://github.com/allisonrvargas/jwt_and_passport.git
   cd jwt_and_passport
   npm install
   ```

2. **Definir el secreto de los tokens (obligatorio):**
   ```bash
   cp .env.example .env
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Pega el valor generado en `JWT_SECRET` dentro de `.env`. Sin `JWT_SECRET` (mínimo 16 caracteres) la API **no arranca**: así nadie puede fabricar tokens con un secreto por defecto.

3. **Ejecutar el servidor:**
   ```bash
   npm start      # producción
   npm run dev    # recarga al guardar
   ```
   *El servidor iniciará en `http://localhost:3000`*

4. **Pruebas:**
   ```bash
   npm test
   ```

---
## Endpoints Disponibles

| Método | Ruta | Descripción | Autenticación |
| :--- | :--- | :--- | :--- |
| **GET** | `/health` | Estado del servidor | Pública |
| **POST** | `/api/v1/users/authenticate` | Iniciar sesión y obtener token JWT | Pública (`username`, `password`) |
| **GET** | `/api/v1/user/list` | Listar perfiles de cazadores | Bearer Token |
| **POST** | `/api/v1/boveda/recompensa` | Registrar recompensa en la bóveda | Bearer Token (Solo Admins) |

---

## Credenciales de Prueba

* **Administrador:** 
  * **Usuario:** `jinwoo`
  * **Contraseña:** `Password123!`
* **Usuario Regular:** 
  * **Usuario:** `cha`
  * **Contraseña:** `Password123!`

---

## Arquitectura del Proyecto

```text
api/
├── package.json
└── src/
    ├── app.js                 # Inicialización de Express y Middlewares
    ├── server.js              # Arranque del servidor HTTP
    ├── config/
    │   └── passport.js        # Estrategias Local y JWT
    ├── controllers/
    │   └── auth.controller.js # Controladores de la API
    ├── dtos/
    │   └── cazador.dto.js     # Data Transfer Objects
    ├── middlewares/
    │   ├── auth.middleware.js # Validación JWT y roles (Admin)
    │   └── error.middleware.js# Manejo global de errores
    ├── models/
    │   └── cazador.model.js   # Datos en memoria (Semilla)
    ├── routes/
    │   └── auth.routes.js     # Definición de rutas v1
    ├── services/
    │   └── cazador.service.js # Lógica de negocio y firma JWT
    └── validators/
        └── auth.validator.js  # Validaciones con express-validator
```
---

## Ejemplos de uso (curl)

Con el servidor en `http://localhost:3000`:

**1. Iniciar sesión como administrador y obtener el token**

```bash
curl -X POST http://localhost:3000/api/v1/users/authenticate \
  -H "Content-Type: application/json" \
  -d '{"username":"jinwoo","password":"Password123!"}'
```

Respuesta (`200`):

```json
{ "token": "<JWT>", "tipo": "Bearer", "expiraEn": "2h", "cazador": { } }
```

**2. Listar cazadores (requiere token)**

```bash
curl http://localhost:3000/api/v1/user/list \
  -H "Authorization: Bearer <JWT>"
```

**3. Registrar una recompensa en la bóveda (solo administradores)**

```bash
curl -X POST http://localhost:3000/api/v1/boveda/recompensa \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"mision":"Mazmorra de nivel S","cristales":500}'
```

Respuesta: `201` con la recompensa creada.

**Errores comunes**

| Caso | Respuesta |
| :--- | :--- |
| Body inválido (username corto, cristales fuera de rango) | `400` con la lista de errores |
| Sin token o token inválido | `401` |
| Usuario regular (`cha`) en `/boveda/recompensa` | `403` |

---

## Seguridad

- **Contraseñas con bcrypt:** las cuentas de demostración se guardan solo como hash (bcrypt, 10 rondas). Al iniciar sesión se compara siempre contra un hash, real o falso, para que el tiempo de respuesta no delate si el usuario existe.
- **Secreto JWT obligatorio:** no hay valor por defecto. Los tokens usan HS256 y duran 2 horas.
- **Tokens manipulados:** una firma o un cuerpo alterado se rechaza con `401` (hay una prueba que lo verifica).
- **Datos en memoria:** es un proyecto de práctica; los usuarios viven en memoria y las contraseñas de demostración están documentadas arriba.