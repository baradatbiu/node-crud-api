import request from "supertest";
import { validate } from "uuid";
import { server } from "../src/app.js";
import {
  ERRORS,
  HTTP_STATUS_CODE,
  USERS_API_ENDPOINT,
} from "../src/types/User.js";

const invalidUserId = "invalid-id";

beforeAll(() => {
  expect(validate(invalidUserId)).toBe(false);
});

afterAll(() => {
  server.close();
});

describe("All user APIs with a userId parameter validate it", () => {
  it("GET request api/user/{userId} with invalid user id, responds with status code 400 and error message", async () => {
    const { body, statusCode } = await request(server).get(
      `${USERS_API_ENDPOINT}/${invalidUserId}`
    );

    expect(statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
    expect(body).toEqual({ message: ERRORS.INVALID_PARAMS });
  });

  it("PUT request api/user/{userId} with invalid user id, responds with status code 400 and error message", async () => {
    const { body, statusCode } = await request(server)
      .put(`${USERS_API_ENDPOINT}/${invalidUserId}`)
      .send({});

    expect(statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
    expect(body).toEqual({ message: ERRORS.INVALID_PARAMS });
  });

  it("DELETE request api/user/{userId} with invalid user id, responds with status code 400 and error message", async () => {
    const { statusCode, body } = await request(server).delete(
      `${USERS_API_ENDPOINT}/${invalidUserId}`
    );

    expect(statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
    expect(body).toEqual({ message: ERRORS.INVALID_PARAMS });
  });
});
