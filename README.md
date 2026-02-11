# Ejemplo de Cifrado con bcrypt (2o DAM)

Backend didactico con Express + TypeScript + Prisma + PostgreSQL para explicar hashing en aplicaciones reales.

## Objetivos de aprendizaje
- Diferenciar hash, cifrado y encoding.
- Aplicar `bcrypt` para:
  - Contrasenas.
  - API keys.
- Entender JWT con estrategia simple de access token.

## Stack
- Node 22 LTS
- Express
- Prisma + PostgreSQL
- bcrypt
- jsonwebtoken
- zod

## Estructura principal
- `src/modules/auth`: registro, login, logout, perfil.
- `src/modules/credentials`: creacion/listado/verificacion de API keys hasheadas.
- `src/shared/utils`: hash, password, jwt, crypto.
- `docs/`: material docente para sesion intensiva.

## Configuracion
1. Instala dependencias:
```bash
npm install
```

2. Crea variables de entorno:
```bash
copy .env.example .env
```

3. Edita `.env` y coloca tu `DATABASE_URL` real de PostgreSQL.

4. Genera cliente Prisma:
```bash
npm run prisma:generate
```

5. Si la BD esta vacia, aplica la migracion inicial incluida en el repo:
```bash
npm run prisma:deploy
```

Si tu BD ya tiene tablas (error `P3005`), sincroniza schema sin migraciones historicas:
```bash
npm run prisma:push
```

Si modificas el schema en clase, usa `npm run prisma:migrate -- --name <cambio>`.

6. Arranca en desarrollo:
```bash
npm run dev
```

7. Smoke test end-to-end de API:
```bash
npm run smoke:e2e
```

## Endpoints
### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Credentials
- `POST /credentials`
- `GET /credentials`
- `POST /credentials/verify`

## Contrato rapido de respuestas
- `POST /auth/register` y `POST /auth/login` devuelven `accessToken` (y alias `token` por compatibilidad).
- `POST /credentials` acepta body opcional:
  - `{ "label": "mi-integracion" }`
  - o `{}` y el backend asigna un label por defecto.
- `POST /credentials/verify` recibe `{ "apiKey": "<clave_en_claro>" }`.

## Ejemplos rapidos
### Registro
```bash
curl -X POST http://localhost:3000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"profe@dam.com\",\"password\":\"Password123!\",\"name\":\"Profe\"}"
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"profe@dam.com\",\"password\":\"Password123!\"}"
```

### Crear API key
```bash
curl -X POST http://localhost:3000/credentials ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer <accessToken>" ^
  -d "{\"label\":\"integracion-clase\"}"
```

### Verificar API key
```bash
curl -X POST http://localhost:3000/credentials/verify ^
  -H "Content-Type: application/json" ^
  -d "{\"apiKey\":\"<apiKeyPlainOnce>\"}"
```

## Escenarios de validacion manual
- Registro valido y rechazo por email duplicado.
- Login correcto e incorrecto.
- Confirmar en DB que no hay passwords ni API keys en claro.
- Crear API key y comprobar que solo se muestra una vez.
- Verificar API key valida e invalida.

## Material docente
- `docs/01-teoria-hashing-bcrypt.md`
- `docs/02-aplicacion-en-este-proyecto.md`
- `docs/03-guia-practica-1-sesion.md`
- `docs/04-consumo-desde-clientes.md`
- `docs/05-pruebas-api-thunder-y-manual.md`
- `docs/thunder-client/ejemplo-cifrado-thunder-collection.json`
