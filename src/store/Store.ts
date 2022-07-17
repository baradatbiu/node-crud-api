import { User, Users } from "../types/User";
import { v4 as uuidv4 } from "uuid";

export class Store {
  _users = [] as Users;
  _isMulti = false;

  constructor(multi = false) {
    this._isMulti = multi;

    if (multi) {
      process.on("message", (message: string) => {
        this._users = JSON.parse(message);
      });
    }
  }

  getUsers() {
    return this._users;
  }

  getUserById({ userId }: { userId: User["id"] }) {
    return this._users.find(({ id }) => id === userId);
  }

  setUser(user: User) {
    const newUser = { ...user, id: uuidv4() };

    this._users.push(newUser);

    if (this._isMulti) process?.send?.(JSON.stringify(this._users));

    return newUser;
  }

  updateUser({ user, userId }: { user: User; userId: User["id"] }) {
    const userToUpdate = this._users.find(({ id }) => id === userId);

    if (userToUpdate) {
      Object.assign(userToUpdate, user);

      if (this._isMulti) process?.send?.(JSON.stringify(this._users));
    }

    return userToUpdate;
  }

  deleteUser({ userId }: { userId: User["id"] }) {
    const indexOfUserToDelete = this._users.findIndex(
      ({ id }) => id === userId
    );

    this._users = this._users.filter(({ id }) => id !== userId);

    if (this._isMulti && indexOfUserToDelete !== -1) {
      process?.send?.(JSON.stringify(this._users));
    }

    return indexOfUserToDelete !== -1;
  }

  validateUserData(body: User, fullValidation = true) {
    const isObjet = typeof body === "object" && !Array.isArray(body);

    if (!isObjet) return false;

    const checkFields = ["username", "age", "hobbies"];

    if (fullValidation) {
      const keysExist = checkFields.every((key) =>
        Object.keys(body).includes(key)
      );

      if (!keysExist) return false;
    }

    return Object.keys(body).every((key) => {
      const hasKey = checkFields.includes(key);

      if (!hasKey) return false;

      switch (key) {
        case "username":
          return typeof body.username === "string";

        case "age":
          return typeof body.age === "number";

        case "hobbies":
          return (
            Array.isArray(body.hobbies) &&
            (body.hobbies.length === 0 ||
              body.hobbies.every((hobby) => typeof hobby === "string"))
          );

        default:
          return false;
      }
    });
  }
}
