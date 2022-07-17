import { createServer, Server } from "http";
import { Store } from "../store/Store";
import { parseRoute } from "../utils/parseRoute";
import { ERRORS, HTTP_STATUS_CODE, ROUTE } from "../types/User";

export class APIServer {
  _port;
  _server = {} as Server;
  _store = {} as Store;

  constructor(port: number, store: Store) {
    this._port = port;
    this._server = createServer();
    this._store = store;
  }

  get server() {
    return this._server;
  }

  init() {
    this._server.on("request", async (req, res) => {
      try {
        res.setHeader("Content-Type", "application/json");

        const buffers = [];

        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const body = Buffer.concat(buffers).toString();
        const { method = "", url = "" } = req;

        const { name, userId } = parseRoute({ method, route: url });

        switch (name) {
          case ROUTE.GET_USERS:
            res
              .writeHead(HTTP_STATUS_CODE.OK)
              .end(JSON.stringify(this._store.getUsers()));
            break;

          case ROUTE.GET_USER_BY_ID:
            const user = this._store.getUserById({ userId });

            if (!user) throw new Error(ERRORS.USER_NOT_FOUND);

            res.writeHead(HTTP_STATUS_CODE.OK).end(JSON.stringify(user));
            break;

          case ROUTE.POST_USER:
            if (!this._store.validateUserData(JSON.parse(body)))
              throw new Error(ERRORS.INVALID_USER);

            res
              .writeHead(HTTP_STATUS_CODE.OK_ADD)
              .end(JSON.stringify(this._store.setUser(JSON.parse(body))));
            break;

          case ROUTE.PUT_USER:
            if (!this._store.validateUserData(JSON.parse(body), false))
              throw new Error(ERRORS.INVALID_USER);

            const updatedUser = this._store.updateUser({
              userId,
              user: JSON.parse(body),
            });

            if (!updatedUser) throw new Error(ERRORS.USER_NOT_FOUND);

            res.writeHead(HTTP_STATUS_CODE.OK).end(JSON.stringify(updatedUser));
            break;

          case ROUTE.DELETE_USER:
            const deletedUserId = this._store.deleteUser({ userId });

            if (!deletedUserId) throw new Error(ERRORS.USER_NOT_FOUND);

            res.writeHead(HTTP_STATUS_CODE.OK_DELETE).end();
            break;
          default:
            throw new Error(ERRORS.INVALID_ROUTE);
        }
      } catch (error: any) {
        let errorMessage = error.message;

        switch (error.message) {
          case ERRORS.INVALID_PARAMS:
          case ERRORS.INVALID_USER:
            res.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
            break;
          case ERRORS.INVALID_METHOD:
          case ERRORS.INVALID_ROUTE:
          case ERRORS.INVALID_ENDPOINT:
          case ERRORS.USER_NOT_FOUND:
            res.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
            break;

          default:
            res.statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER;
            errorMessage = ERRORS.INTERNAL_SERVER;
            break;
        }

        res.end(JSON.stringify({ message: errorMessage }));
      }
    });

    this._server.listen(this._port, () => {
      console.log(`Server listening on PORT: ${this._port}`);
    });
  }
}
