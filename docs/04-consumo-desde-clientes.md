# Consumo desde clientes (React Native, Electron, Flutter)

## Flujo HTTP recomendado (comun)
1. Login en `POST /auth/login`.
2. Guardar `accessToken` en memoria de app.
3. En cada request protegido, enviar:
   - `Authorization: Bearer <accessToken>`
4. Si el access expira:
   - volver a autenticar con `POST /auth/login`.

Nota:
- La API responde `accessToken` y tambien `token` como alias de compatibilidad.

## Recomendaciones por plataforma
- React Native:
  - Preferir almacenamiento seguro si decides persistir access token.
  - Para este ejemplo docente, puede vivir solo en memoria.
- Electron:
  - Evitar guardar tokens en `localStorage` sin proteccion.
  - Usar almacenamiento cifrado del sistema operativo.
- Flutter:
  - `flutter_secure_storage` si decides persistir tokens.
  - Access token en memoria cuando sea posible.

## Ejemplo generico con fetch
```ts
const response = await fetch("http://localhost:3000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "alumno@dam.com",
    password: "Password123!",
  }),
});

const data = await response.json();
const accessToken = data.accessToken ?? data.token;
```

## Error handling basico en cliente
- `400`: datos enviados incorrectos.
- `401`: token o credenciales invalidas.
- `409`: conflicto (por ejemplo email ya registrado).
- `429`: demasiadas peticiones.
