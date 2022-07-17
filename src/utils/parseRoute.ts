import { ERRORS, ROUTE, USERS_API_ENDPOINT } from "../types/User";
import { validate as uuidValidate } from "uuid";

export const parseRoute = ({
  method,
  route,
}: {
  method: string;
  route: string;
}) => {
  if (!route.startsWith(USERS_API_ENDPOINT))
    throw new Error(ERRORS.INVALID_ENDPOINT);

  const paramsString = route.replace(USERS_API_ENDPOINT, "");
  const params = paramsString.replace(/(^\/)(?=.+)/, "");

  if (params === "/") throw new Error(ERRORS.INVALID_ROUTE);

  const userId = params.length ? params : "";
  const result = { name: "", userId: "" };
  const handleParamError = () => {
    if (!uuidValidate(userId)) throw new Error(ERRORS.INVALID_PARAMS);
  };

  switch (method) {
    case "GET":
      if (userId) {
        handleParamError();
        result.userId = userId;
        result.name = ROUTE.GET_USER_BY_ID;
      } else {
        result.name = ROUTE.GET_USERS;
      }
      break;
    case "POST":
      if (!userId) result.name = ROUTE.POST_USER;
      break;

    case "PUT":
      if (userId) {
        handleParamError();
        result.userId = userId;
        result.name = ROUTE.PUT_USER;
      }
      break;

    case "DELETE":
      if (userId) {
        handleParamError();
        result.userId = userId;
        result.name = ROUTE.DELETE_USER;
      }
      break;

    default:
      throw new Error(ERRORS.INVALID_METHOD);
  }

  if (!result.name) throw new Error(ERRORS.INVALID_ROUTE);

  return result;
};
