# Como se aplica bcrypt en este backend

## Objetivo tecnico del proyecto
Demostrar hashing real en backend con dos casos:
1. Hash de contrasena de usuario.
2. Hash de API key de integracion.

## Flujo 1: registro de usuario
Archivo clave: `src/modules/auth/auth.service.ts`
1. Entra email + password.
2. Se valida formato y politica de contrasena.
3. Se genera `passwordHash` con bcrypt.
4. Se guarda en PostgreSQL, nunca la password original.

## Flujo 2: login
Archivo clave: `src/modules/auth/auth.service.ts`
1. Se busca usuario por email.
2. Se compara password con `bcrypt.compare`.
3. Si coincide, se genera `accessToken`.
4. El cliente usa `Authorization: Bearer <accessToken>` en rutas protegidas.

## Flujo 3: API keys
Archivo clave: `src/modules/credentials/credentials.service.ts`
1. Se genera API key aleatoria.
2. Se devuelve en claro solo una vez al crear.
3. Se guarda solo `keyHash` + `keyPrefix`.
4. Para verificar: buscar por prefijo y comparar con bcrypt.

## Donde ver cada pieza
- Hash generico: `src/shared/utils/hash.util.ts`
- Password policy: `src/shared/utils/password.util.ts`
- JWT: `src/shared/utils/jwt.util.ts`
- API keys random/prefix: `src/shared/utils/crypto.util.ts`
- Prisma client: `src/shared/prisma/client.ts`
