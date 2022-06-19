# 3 week Node.js CRUD API

## Install dependencies

    npm install

## Run app in development mode(nodemom/ts-node)

    npm run start:dev

    http://localhost:{PORT}/api/users

    PORT=8000 or it can be changed in .env

## Build app in production mode(webpack/ts-loader) and run app

    npm run start:prod

## Run the tests(jest/supertest)

    npm run test

## Open

    http://localhost:{PORT}/api/users

    PORT=8000 in .env

# REST API

The REST API to the example app is described below.

## Get all users

### Request

`GET /api/users`

### Response

    status code 200 and all users records

## Create a new user

### Request

`POST /api/users`

    body:
      username — user's name (string, required)
      age — user's age (number, required)
      hobbies — user's hobbies (array of strings or empty array, required)

    {"username":"Name","age":77, hobbies: []}

### Response

    status code 201 and newly created record

      {"id":"f8ccd33f-f817-4f09-89e1-99fdfde62157","username":"Name","age":77, hobbies: []}

    status code 400 and corresponding message if request body does not contain required fields or fields are invalid

      { message: "User not valid" }

## Get a specific user by id

### Request

`GET /api/users/${userId}`

    userId - valid uuid identifier

### Response

    status code 201 and newly created record

      {"id":"f8ccd33f-f817-4f09-89e1-99fdfde62157","username":"Name","age":77, hobbies: []}

    status code 400 and corresponding message if userId is invalid (not uuid)

      { message: "Invalid params" }

    status code 404 and corresponding message if record with id === userId doesn't exist

      { message: "User not found" }

## Update a specific user by id(can update all or some fields)

### Request

`PUT /api/users/${userId}`

    userId - valid uuid identifier

### Response

    status code 200 and updated record

      {"id":"f8ccd33f-f817-4f09-89e1-99fdfde62157","username":"ChangedName","age":88, hobbies: ["dance"]}

    status code 400 and corresponding message if userId is invalid (not uuid)

      { message: "Invalid params" }

    status code 400 and corresponding message if request body does not contain required fields or fields are invalid

      { message: "User not valid" }

    status code 404 and corresponding message if record with id === userId doesn't exist

      { message: "User not found" }

## Delete a specific user by id

### Request

`DELETE /api/users/${userId}`

    userId - valid uuid identifier

### Response

    status code 204 if the record is found and deleted

    status code 400 and corresponding message if userId is invalid (not uuid)

      { message: "Invalid params" }

    status code 404 and corresponding message if record with id === userId doesn't exist

      { message: "User not found" }

## Other errors

status code 400

    { message: "Invalid method" }
    { message: "Invalid route" }
    { message: "Invalid api endpoint" }

status code 500

    { message: "Internal server error" }
