import request from "supertest";
import { server } from "../src/app.js";
import { fakeUser } from "../src/fakeData.js";
import {
  ERRORS,
  HTTP_STATUS_CODE,
  User,
  USERS_API_ENDPOINT,
} from "../src/types/User.js";
import { v4 as uuidv4 } from "uuid";

const checkUser = { ...fakeUser } as User;
const nonExistanceUserId = uuidv4();

beforeAll(async () => {
  const { body, statusCode } = await request(server)
    .post(USERS_API_ENDPOINT)
    .send(checkUser)
    .set("Content-Type", "application/json");

  checkUser.id = body.id;

  expect(statusCode).toBe(HTTP_STATUS_CODE.OK_ADD);
  expect(body).toEqual<User>(checkUser);
});

afterAll(async () => {
  await server.close();
});

describe("Operations with non-existent user or invalid fields produce expected errors", () => {
  it("POST api/users with incorrect fields responds with status code 400 and error message", async () => {
    const wrongUser = { username: "username", age: 77 } as {
      username: User["username"];
      age: User["age"];
    };

    const { body, statusCode } = await request(server)
      .post(USERS_API_ENDPOINT)
      .send(wrongUser)
      .set("Content-Type", "application/json");

    expect(statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
    expect(body).toEqual({ message: ERRORS.INVALID_USER });
  });

  it("POST api/users with invalid type of fields responds with status code 400 and error message", async () => {
    const wrongUser = { username: "username", age: "77", hobbies: [] } as {
      username: User["username"];
      age: string;
      hobbies: User["hobbies"];
    };

    const { body, statusCode } = await request(server)
      .post(USERS_API_ENDPOINT)
      .send(wrongUser)
      .set("Content-Type", "application/json");

    expect(statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
    expect(body).toEqual({ message: ERRORS.INVALID_USER });
  });

  it("GET api/user/{userId} with non-existent user responds with status code 404 and error message", async () => {
    const { body, statusCode } = await request(server)
      .get(`/api/users/${nonExistanceUserId}`)
      .set("Content-Type", "application/json");

    expect(statusCode).toBe(HTTP_STATUS_CODE.NOT_FOUND);
    expect(body).toEqual({ message: ERRORS.USER_NOT_FOUND });
  });

  it("PUT api/users/{userId} with non-existent user responds with status code 404 and error message", async () => {
    const updatedUser = { ...fakeUser };

    const { body, statusCode } = await request(server)
      .put(`${USERS_API_ENDPOINT}/${nonExistanceUserId}`)
      .send(updatedUser)
      .set("Content-Type", "application/json");

    expect(statusCode).toBe(HTTP_STATUS_CODE.NOT_FOUND);
    expect(body).toEqual({ message: ERRORS.USER_NOT_FOUND });
  });

  it("DELETE api/users/{userId} with non-existent user responds with status code 404 and error message", async () => {
    const { statusCode, body } = await request(server).delete(
      `${USERS_API_ENDPOINT}/${nonExistanceUserId}`
    );

    expect(statusCode).toBe(HTTP_STATUS_CODE.NOT_FOUND);
    expect(body).toEqual({ message: ERRORS.USER_NOT_FOUND });
  });
});
