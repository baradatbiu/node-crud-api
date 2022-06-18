import "./env.js";
import { createServer } from "http";
import { Store } from "./store/Store.js";
import { parseRoute } from "./utils/parseRoute.js";
import { ERRORS, HTTP_STATUS_CODE, ROUTE } from "./types/User.js";

const server = createServer();
const store = new Store();

server.on("request", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  req.on("error", () => {
    res
      .writeHead(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .end({ message: ERRORS.INTERNAL_SERVER });
  });

  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  const body = Buffer.concat(buffers).toString();
  const { method = "", url = "" } = req;

  try {
    const { name, userId } = parseRoute({ method, route: url });

    switch (name) {
      case ROUTE.GET_USERS:
        res
          .writeHead(HTTP_STATUS_CODE.OK)
          .end(JSON.stringify(store.getUsers()));
        break;

      case ROUTE.GET_USER_BY_ID:
        const user = store.getUserById({ userId });

        if (!user) throw new Error(ERRORS.USER_NOT_FOUND);

        res.writeHead(HTTP_STATUS_CODE.OK).end(JSON.stringify(user));
        break;

      case ROUTE.POST_USER:
        if (!store.validateUserData(JSON.parse(body)))
          throw new Error(ERRORS.INVALID_USER);

        res
          .writeHead(HTTP_STATUS_CODE.OK_ADD)
          .end(JSON.stringify(store.setUser(JSON.parse(body))));
        break;

      case ROUTE.PUT_USER:
        if (!store.validateUserData(JSON.parse(body), false))
          throw new Error(ERRORS.INVALID_USER);

        const updatedUser = store.updateUser({
          userId,
          user: JSON.parse(body),
        });

        if (!updatedUser) throw new Error(ERRORS.USER_NOT_FOUND);

        res.writeHead(HTTP_STATUS_CODE.OK).end(JSON.stringify(updatedUser));
        break;

      case ROUTE.DELETE_USER:
        const deletedUserId = store.deleteUser({ userId });

        if (!deletedUserId) throw new Error(ERRORS.USER_NOT_FOUND);

        res.writeHead(HTTP_STATUS_CODE.OK_DELETE).end();
        break;
      default:
        throw new Error(ERRORS.INVALID_ROUTE);
    }
  } catch (error: any) {
    if ([ERRORS.INVALID_PARAMS, ERRORS.INVALID_USER].includes(error.message)) {
      res.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
    } else {
      res.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
    }

    res.end(JSON.stringify({ message: error.message }));
  }
});

server.listen(process.env.PORT);
