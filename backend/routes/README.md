# API Routes - Sistema de Autorización por Roles

## Roles del Sistema

1. **Administrador** - Acceso total a todas las rutas
2. **Evaluador** - Acceso a inscripciones
3. **Responsable Académico** - Acceso a inscripciones y olimpiadas

## Rutas Públicas

- `POST /api/login` - Autenticación de usuarios

## Rutas Protegidas (requieren token JWT)

### Autenticación
- `POST /api/logout` - Cerrar sesión
- `POST /api/refresh` - Refrescar token
- `GET /api/me` - Información del usuario autenticado

### Evaluadores (Solo Administrador)
- `GET /api/evaluators` - Listar evaluadores
- `POST /api/evaluators` - Crear evaluador
- `GET /api/evaluators/{id}` - Ver evaluador
- `PUT/PATCH /api/evaluators/{id}` - Actualizar evaluador
- `DELETE /api/evaluators/{id}` - Eliminar evaluador

### Académicos (Solo Administrador)
- `GET /api/academics` - Listar académicos
- `POST /api/academics` - Crear académico
- `GET /api/academics/{id}` - Ver académico
- `PUT/PATCH /api/academics/{id}` - Actualizar académico
- `DELETE /api/academics/{id}` - Eliminar académico

### Olimpiadas (Administrador y Responsable Académico)
- `GET /api/olympians` - Listar olimpiadas
- `POST /api/olympians/import` - Importar olimpiadas

### Áreas (Solo Administrador)
- `GET /api/areas` - Listar áreas
- `POST /api/areas` - Crear área
- `GET /api/areas/{id}` - Ver área
- `PUT/PATCH /api/areas/{id}` - Actualizar área
- `DELETE /api/areas/{id}` - Eliminar área

### Grados (Solo Administrador)
- `GET /api/grades` - Listar grados
- `POST /api/grades` - Crear grado
- `GET /api/grades/{id}` - Ver grado
- `PUT/PATCH /api/grades/{id}` - Actualizar grado
- `DELETE /api/grades/{id}` - Eliminar grado

### Inscripciones (Administrador, Evaluador y Responsable Académico)
- `GET /api/inscriptions` - Listar inscripciones
- `POST /api/inscriptions` - Crear inscripción
- `GET /api/inscriptions/{id}` - Ver inscripción
- `PUT/PATCH /api/inscriptions/{id}` - Actualizar inscripción
- `DELETE /api/inscriptions/{id}` - Eliminar inscripción

## Middleware de Autorización

El middleware `CheckRole` verifica que el usuario autenticado tenga el rol adecuado para acceder a cada ruta. Los administradores siempre tienen acceso completo.
