export interface User {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
}

export type Users = User[];

export const USERS_API_ENDPOINT = "/api/users";

export enum ROUTE {
  GET_USER_BY_ID = "GET_USER_BY_ID",
  GET_USERS = "GET_USERS",
  POST_USER = "POST_USER",
  PUT_USER = "PUT_USER",
  DELETE_USER = "DELETE_USER",
}

export enum ERRORS {
  INVALID_METHOD = "Invalid method",
  INVALID_ROUTE = "Invalid route",
  INVALID_PARAMS = "Invalid params",
  INVALID_ENDPOINT = "Invalid api endpoint",
  INVALID_USER = "User not valid",
  USER_NOT_FOUND = "User not found",
  INTERNAL_SERVER = "Internal server error",
}

export enum HTTP_STATUS_CODE {
  OK = 200,
  OK_ADD = 201,
  OK_DELETE = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
}
