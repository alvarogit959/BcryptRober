const { randomUUID } = require("crypto");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function run() {
  const { app } = require("../dist/app");
  const server = app.listen(0);

  try {
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("No se pudo obtener el puerto del servidor");
    }

    const baseUrl = `http://127.0.0.1:${address.port}`;
    const email = `smoke_${Date.now()}_${randomUUID().slice(0, 8)}@example.com`;
    const password = "Password123!";

    async function api(path, options = {}) {
      const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
          ...(options.body ? { "content-type": "application/json" } : {}),
          ...(options.headers || {}),
        },
      });

      const raw = await response.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        data = null;
      }

      return {
        status: response.status,
        data,
      };
    }

    const register = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name: "Smoke Test" }),
    });
    assert(register.status === 201, "Registro no devolvio 201");

    const login = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    assert(login.status === 200, "Login no devolvio 200");

    const accessToken = login.data?.accessToken ?? login.data?.token;
    assert(Boolean(accessToken), "Login no devolvio accessToken/token");

    const me = await api("/auth/me", {
      headers: { authorization: `Bearer ${accessToken}` },
    });
    assert(me.status === 200, "GET /auth/me no devolvio 200");
    assert(me.data?.email === email.toLowerCase(), "El perfil no coincide con el usuario autenticado");

    // Crea sin label para validar default backend.
    const createCredential = await api("/credentials", {
      method: "POST",
      headers: { authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({}),
    });
    assert(createCredential.status === 201, "POST /credentials no devolvio 201");
    assert(Boolean(createCredential.data?.apiKeyPlainOnce), "No se devolvio apiKeyPlainOnce");
    assert(Boolean(createCredential.data?.label), "No se asigno label por defecto");

    const verifyValid = await api("/credentials/verify", {
      method: "POST",
      body: JSON.stringify({ apiKey: createCredential.data.apiKeyPlainOnce }),
    });
    assert(verifyValid.status === 200, "Verificacion de key valida no devolvio 200");
    assert(verifyValid.data?.valid === true, "La key valida no fue aceptada");

    const verifyInvalid = await api("/credentials/verify", {
      method: "POST",
      body: JSON.stringify({ apiKey: "api_bad_key_1234567890" }),
    });
    assert(verifyInvalid.status === 200, "Verificacion de key invalida no devolvio 200");
    assert(verifyInvalid.data?.valid === false, "La key invalida no fue rechazada");

    console.log("Smoke e2e OK");
  } finally {
    server.close();
  }
}

run().catch((error) => {
  console.error("Smoke e2e FAIL:", error.message);
  process.exit(1);
});
