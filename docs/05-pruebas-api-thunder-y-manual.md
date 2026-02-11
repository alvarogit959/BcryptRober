# Pruebas de API con Thunder Client y metodos manuales

Este documento sirve para validar el backend sin frontend.

## 1) Preparacion minima
1. Instalar dependencias:
```bash
npm install
```
2. Generar cliente Prisma:
```bash
npm run prisma:generate
```
3. Inicializar o sincronizar base de datos:
- Si la BD esta vacia:
```bash
npm run prisma:deploy
```
- Si la BD ya tiene tablas (por ejemplo error `P3005`):
```bash
npm run prisma:push
```
4. Arrancar API:
```bash
npm run dev
```

## 2) Prueba automatica (recomendada)
Ejecuta:
```bash
npm run smoke:e2e
```
Si sale `Smoke e2e OK`, el flujo principal esta correcto.

## 3) Thunder Client (VS Code)
### 3.1 Importar coleccion
Archivo listo para importar:
- `docs/thunder-client/ejemplo-cifrado-thunder-collection.json`

En Thunder Client:
1. Abrir panel Thunder Client.
2. Ir a Collections.
3. Import.
4. Seleccionar ese archivo JSON.

Nota: la funcionalidad de import/export puede depender de la version/licencia de Thunder Client.

### 3.2 Variables recomendadas
Configura en Thunder Client (Environment o Global Env):
- `baseUrl`: `http://localhost:3000`
- `email`: `alumno+01@example.com`
- `password`: `Password123!`
- `name`: `Alumno Demo`
- `credentialLabel`: `integracion-clase`
- `accessToken`: (vacio al inicio)
- `apiKeyPlainOnce`: (vacio al inicio)

### 3.3 Orden de peticiones
1. `Health`
2. `Auth Register`
3. `Auth Login`
- Copiar `accessToken` de la respuesta a variable `accessToken`.
- Si aparece `token`, tambien puedes usarlo (alias de compatibilidad).
4. `Auth Me`
5. `Credentials Create`
- Copiar `apiKeyPlainOnce` de la respuesta a variable `apiKeyPlainOnce`.
6. `Credentials List`
7. `Credentials Verify`
8. `Auth Logout`

## 4) Prueba manual con PowerShell (Windows)
### 4.1 Registro
```powershell
$registerBody = '{"email":"alumno_ps@example.com","password":"Password123!","name":"Alumno PS"}'
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/auth/register" -ContentType "application/json" -Body $registerBody
```

### 4.2 Login y guardar token
```powershell
$loginBody = '{"email":"alumno_ps@example.com","password":"Password123!"}'
$login = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/auth/login" -ContentType "application/json" -Body $loginBody
$accessToken = if ($login.accessToken) { $login.accessToken } else { $login.token }
```

### 4.3 Perfil autenticado
```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/auth/me" -Headers @{ Authorization = "Bearer $accessToken" }
```

### 4.4 Crear API key
```powershell
$createBody = '{"label":"integracion-powershell"}'
$created = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/credentials" -Headers @{ Authorization = "Bearer $accessToken" } -ContentType "application/json" -Body $createBody
$apiKeyPlainOnce = $created.apiKeyPlainOnce
```

### 4.5 Listar API keys
```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/credentials" -Headers @{ Authorization = "Bearer $accessToken" }
```

### 4.6 Verificar API key
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/credentials/verify" -ContentType "application/json" -Body "{""apiKey"":""$apiKeyPlainOnce""}"
```

### 4.7 Logout
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/auth/logout" -Headers @{ Authorization = "Bearer $accessToken" }
```

## 5) Prueba manual con curl (bash)
### 5.1 Registro
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alumno_curl@example.com","password":"Password123!","name":"Alumno Curl"}'
```

### 5.2 Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alumno_curl@example.com","password":"Password123!"}'
```
Guarda `accessToken` (o `token`) para usarlo en las siguientes llamadas.

### 5.3 Perfil
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer <accessToken>"
```

### 5.4 Crear API key
```bash
curl -X POST http://localhost:3000/credentials \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{"label":"integracion-curl"}'
```
Guarda `apiKeyPlainOnce` para la verificacion.

### 5.5 Verificar API key
```bash
curl -X POST http://localhost:3000/credentials/verify \
  -H "Content-Type: application/json" \
  -d '{"apiKey":"<apiKeyPlainOnce>"}'
```
