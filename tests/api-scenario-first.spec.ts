import request from "supertest";
import { server } from "../src/app.js";
import { fakeUser } from "../src/fakeData.js";
import { ERRORS, User } from "../src/types/User.js";

const checkUser = { ...fakeUser } as User;

afterAll(() => {
  server.close();
});

describe("get all users and operations create, get, put, delete with one user", () => {
  it("GET api/users, response with empty array", async () => {
    const { body, headers, statusCode } = await request(server)
      .get("/api/users")
      .set("Content-Type", "application/json");

    expect(headers["content-type"]).toMatch(/json/);
    expect(statusCode).toEqual(200);
    expect(body).toEqual([]);
  });

  it("POST api/users request, response with containing newly created record", async () => {
    const { body, headers, statusCode } = await request(server)
      .post("/api/users")
      .send(checkUser)
      .set("Content-Type", "application/json");

    checkUser.id = body.id;

    expect(headers["content-type"]).toMatch(/json/);
    expect(statusCode).toBe(201);
    expect(body).toEqual<User>(checkUser);
  });

  it("GET api/user/{userId} request, response with created record", async () => {
    const { body, headers, statusCode } = await request(server)
      .get(`/api/users/${checkUser.id}`)
      .set("Content-Type", "application/json");

    expect(headers["content-type"]).toMatch(/json/);
    expect(statusCode).toBe(200);
    expect(body).toEqual<User>(checkUser);
  });

  it("PUT api/users/{userId} request, response with updated record", async () => {
    const updatedUser = {
      username: "Updated name",
      age: checkUser.age - 1,
      hobbies: [],
    };

    const { body, headers, statusCode } = await request(server)
      .put(`/api/users/${checkUser.id}`)
      .send(updatedUser)
      .set("Content-Type", "application/json");

    Object.assign(checkUser, body);

    expect(headers["content-type"]).toMatch(/json/);
    expect(statusCode).toBe(200);
    expect(body).toEqual<User>(checkUser);
  });

  it("DELETE api/users/{userId} request, response with confirmation of successful deletion", async () => {
    const { statusCode } = await request(server).delete(
      `/api/users/${checkUser.id}`
    );

    expect(statusCode).toBe(204);
  });

  it("GET api/user/{userId} request with deleted object id, expected answer is that there is no such object", async () => {
    const { body, statusCode } = await request(server).get(
      `/api/users/${checkUser.id}`
    );

    expect(statusCode).toBe(404);
    expect(body).toEqual({ message: ERRORS.USER_NOT_FOUND });
  });
});
