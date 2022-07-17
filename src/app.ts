import { APIServer } from "./server/APIServer";
import { Store } from "./store/Store";
import "./env";

const PORT = Number(process.env.PORT) || 8000;
const store = new Store();

const apiServer = new APIServer(PORT, store);

apiServer.init();

export const server = apiServer.server;
