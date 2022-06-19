import { cpus } from "os";
import cluster from "cluster";
import { APIServer } from "./server/APIServer";
import { Store } from "./store/Store";
import "./env";

const PORT = Number(process.env.PORT) || 8000;
const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();

    worker.on("message", (message) => {
      console.log(message);

      for (const id in cluster.workers) {
        cluster.workers[id]?.send(message);
      }
    });
  }

  cluster.on("exit", (worker) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const store = new Store(true);
  const apiServer = new APIServer(PORT, store);

  apiServer.init();

  console.log(`Worker ${process.pid} started`);
}
