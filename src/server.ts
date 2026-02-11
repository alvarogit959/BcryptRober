import { env } from "./config/env";
import { app } from "./app";
import { prisma } from "./shared/prisma/client";

const server = app.listen(env.PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${env.PORT}`);
});

async function shutdown(): Promise<void> {
  console.log("Cerrando servidor...");
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

