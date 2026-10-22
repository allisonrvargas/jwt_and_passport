# API Gremio de Cazadores (JWT & Passport)

Una API RESTful profesional, modular y segura construida con **Node.js**, **Express**, **Passport.js** y **JWT** (JSON Web Tokens) estructurada bajo una arquitectura limpia por capas.

---

## Instalación y Ejecución

1. **Clonar e instalar dependencias:**
   ```bash
   git clone https://github.com/allisonrvargas/jwt_and_passport.git
   cd jwt_and_passport/api
   npm install
   ```

2. **Ejecutar el servidor:**
   ```bash
   node src/server.js
   ```
   *El servidor iniciará en `http://localhost:3000`*

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