# Teoria base: hashing con bcrypt

## 1. Que es un dato sensible

Dato sensible es cualquier informacion que no debe exponerse en claro:

- Contrasenas.
- Tokens de sesion.
- API keys.
- Datos personales o financieros.

## 2. Hash vs cifrado vs encoding

- `Hash`: transformacion unidireccional. No se puede "deshacer". Ejemplo: `bcrypt`.
- `Cifrado`: reversible con clave (no se usa en este proyecto para mantener foco en bcrypt).
- `Encoding`: representacion de datos, no seguridad (Base64, URL encoding).

Nota:

- Si necesitas comprobar "si coincide", usa hash.
- Si necesitas recuperar el valor original, hash no sirve.

## 3. Por que bcrypt para contrasenas

- Disenado para ser lento frente a ataques por fuerza bruta.
- Incluye `salt` automaticamente.
- Permite ajustar coste (`salt rounds`) segun potencia de hardware.

## 4. Salt y cost factor

- `Salt`: valor aleatorio por hash que evita tablas precalculadas.
- `Cost factor` (`rounds`): cuanto tarda cada hash.
- En este proyecto: `BCRYPT_SALT_ROUNDS=12` por defecto.

## 5. Limites de bcrypt

- Solo compara, no descifra.
- A mayor coste, mas seguridad y mas latencia.
- Passwords muy largas tienen limites practicos (se recomienda maximo 72 para bcrypt).

## 6. Errores frecuentes en clase y en empresa

- Guardar contrasenas en texto plano.
- Guardar API keys en texto plano.
- Creer que Base64 es cifrado.
- Reutilizar un hash como si fuese un token.
- Bajar demasiado los rounds por rendimiento sin medir riesgo.
