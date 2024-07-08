import { server } from "src/index.js";

function startServer() {
  server.listen({ port: process.env.PORT || 8080 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

startServer();
