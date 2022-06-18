import request from "supertest";
import { server } from "../src/app.js";
import { fakeUser } from "../src/fakeData.js";
import {
  ERRORS,
  HTTP_STATUS_CODE,
  User,
  USERS_API_ENDPOINT,
} from "../src/types/User.js";

const checkUser = { ...fakeUser } as User;

afterAll(() => {
  server.close();
});

describe("Get all users, create, get, update, delete operations work correctly with the same user", () => {
  it("GET api/users responds with an empty array", async () => {
    const { body, headers, statusCode } = await request(server)
      .get(USERS_API_ENDPOINT)
      .set("Content-Type", "application/json");

    expect(headers["content-type"]).toMatch(/json/);
    expect(statusCode).toEqual(HTTP_STATUS_CODE.OK);
    expect(body).toEqual([]);
  });

  it("POST api/users responds with containing newly created record", async () => {
    const { body, headers, statusCode } = await request(server)
      .post(USERS_API_ENDPOINT)
      .send(checkUser)
      .set("Content-Type", "application/json");

    checkUser.id = body.id;

    expect(headers["content-type"]).toMatch(/json/);
    expect(statusCode).toBe(HTTP_STATUS_CODE.OK_ADD);
    expect(body).toEqual<User>(checkUser);
  });

  it("GET api/user/{userId} responds with created record", async () => {
    const { body, headers, statusCode } = await request(server)
      .get(`/api/users/${checkUser.id}`)
      .set("Content-Type", "application/json");

    expect(headers["content-type"]).toMatch(/json/);
    expect(statusCode).toBe(HTTP_STATUS_CODE.OK);
    expect(body).toEqual<User>(checkUser);
  });

  it("PUT api/users/{userId} responds with updated record", async () => {
    const updatedUser = {
      username: "Updated name",
      age: checkUser.age - 1,
      hobbies: [],
    };

    const { body, headers, statusCode } = await request(server)
      .put(`${USERS_API_ENDPOINT}/${checkUser.id}`)
      .send(updatedUser)
      .set("Content-Type", "application/json");

    Object.assign(checkUser, body);

    expect(headers["content-type"]).toMatch(/json/);
    expect(statusCode).toBe(HTTP_STATUS_CODE.OK);
    expect(body).toEqual<User>(checkUser);
  });

  it("DELETE api/users/{userId} responds with confirmation of successful deletion", async () => {
    const { statusCode } = await request(server).delete(
      `${USERS_API_ENDPOINT}/${checkUser.id}`
    );

    expect(statusCode).toBe(HTTP_STATUS_CODE.OK_DELETE);
  });

  it("GET api/user/{userId} with deleted object id, expected answer is that there is no such object", async () => {
    const { body, statusCode } = await request(server).get(
      `${USERS_API_ENDPOINT}/${checkUser.id}`
    );

    expect(statusCode).toBe(HTTP_STATUS_CODE.NOT_FOUND);
    expect(body).toEqual({ message: ERRORS.USER_NOT_FOUND });
  });
});
