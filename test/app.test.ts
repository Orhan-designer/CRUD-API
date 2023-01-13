import { workerServer } from './../src/app/app';
import supertest from "supertest";
import {
    ERR_USER_ID_INVALID,
    validationErrors,
    ERR_RESOURCE_NOT_FOUND,
    ERR_UNSUPPORTED_OPERATION,
    ERR_USER_NOT_FOUND,
    ERR_INVALID_DATA,
} from "../src/app/constants";
import { validate } from "uuid";

const apiUrl = "/api/users";

describe("Scenario 1: api execution", () => {
    let id = "";

    describe("Test case 1: should return users", () => {
        it("Test 1.1: should return empty users", async () => {
            const expected = [];
            const response = await supertest(workerServer).get(apiUrl);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expected);
        });
    });
    describe("Test case 2: should create and get created user", () => {
        const user = {
            username: "Test",
            age: 20,
            hobbies: ["coding"],
        };

        it("Test 2.1: should create user", async () => {
            const response = await supertest(workerServer).post(apiUrl).send(JSON.stringify(user));

            expect(response.statusCode).toBe(201);
            id = response.body.id;
        });

        it("Test 2.2: should get user by id", async () => {
            const expected = {
                username: "Test",
                age: 20,
                hobbies: ["coding"],
                id: id,
            };
            const response = await supertest(workerServer).get(`${apiUrl}/${id}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expected);
        });
    });
    describe("Test case 3: should update user", () => {
        it("Test 3.1: should update user by id", async () => {
            const user = {
                username: "Jest",
                age: 25,
                hobbies: ["testing"],
            };
            const response = await supertest(workerServer).put(`${apiUrl}/${id}`).send(JSON.stringify(user));

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(Object.assign(user, { id: id }));
        });
    });
    describe("Test case 4: should delete and not find deleted user", () => {
        it("Test 4.1: should delete user by id", async () => {
            const response = await supertest(workerServer).delete(`${apiUrl}/${id}`);

            expect(response.statusCode).toBe(204);
            expect(response.body).toEqual("");
        });

        it("Test 4.2: should not find deleted user", async () => {
            const response = await supertest(workerServer).get(`${apiUrl}/${id}`);

            expect(response.statusCode).toBe(404);
        });
    });
});

describe("Scenario 2: validation", () => {
    describe("Test case 1: create user validation", () => {
        it("Test 1.1: username should not be empty", async () => {
            const user = {
                age: 25,
                hobbies: ["testing"],
            };
            const expected = { code: 400, message: validationErrors.USERNAME_NOT_EXIST };
            const response = await supertest(workerServer).post(apiUrl).send(JSON.stringify(user));

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expected);
        });

        it("Test 1.2: age should not be empty", async () => {
            const user = {
                username: "Jest",
                hobbies: ["testing"],
            };
            const expected = { code: 400, message: validationErrors.AGE_NOT_EXIST };
            const response = await supertest(workerServer).post(apiUrl).send(JSON.stringify(user));

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expected);
        });

        it("Test 1.3: hobbies should not be empty", async () => {
            const user = {
                username: "Jest",
                age: 25,
            };
            const expected = { code: 400, message: validationErrors.HOBBIES_NOT_EXIST };
            const response = await supertest(workerServer).post(apiUrl).send(JSON.stringify(user));

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expected);
        });

        it("Test 1.4: username should be a string type", async () => {
            const user = {
                username: 123,
                age: 25,
                hobbies: ["testing"],
            };
            const expected = { code: 400, message: validationErrors.USERNAME_IS_INVALID };
            const response = await supertest(workerServer).post(apiUrl).send(JSON.stringify(user));

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expected);
        });

        it("Test 1.5: age should be a number type", async () => {
            const user = {
                username: "Jest",
                age: "Jest",
                hobbies: ["testing"],
            };
            const expected = { code: 400, message: validationErrors.AGE_IS_INVALID };
            const response = await supertest(workerServer).post(apiUrl).send(JSON.stringify(user));

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expected);
        });

        it("Test 1.6: hobbies should be an array type", async () => {
            const user = {
                username: "Jest",
                age: 25,
                hobbies: "Jest",
            };
            const expected = { code: 400, message: validationErrors.HOBBIES_IS_INVALID };
            const response = await supertest(workerServer).post(apiUrl).send(JSON.stringify(user));

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expected);
        });

        it("Test 1.7: hobbies items should be of string type", async () => {
            const user = {
                username: "Jest",
                age: 25,
                hobbies: [123],
            };
            const expected = { code: 400, message: validationErrors.HOBBIES_IS_INVALID };
            const response = await supertest(workerServer).post(apiUrl).send(JSON.stringify(user));

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expected);
        });
    });
    describe("Test case 2: update user validation", () => {
        const testId = "e574b0ed-dff4-45c8-987f-aedb16d64e68";

        it("Test 2.1: username should not be empty", async () => {
            const user = {
                age: 25,
                hobbies: ["testing"],
            };
            const expected = { code: 400, message: validationErrors.USERNAME_NOT_EXIST };
            const response = await supertest(workerServer).put(`${apiUrl}/${testId}`).send(JSON.stringify(user));

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expected);
        });

        it("Test 2.2: age should not be empty", async () => {
            const user = {
                username: "Jest",
                hobbies: ["testing"],
            };
            const expected = { code: 400, message: validationErrors.AGE_NOT_EXIST };
            const response = await supertest(workerServer).put(`${apiUrl}/${testId}`).send(JSON.stringify(user));

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expected);
        });

        it("Test 2.3: hobbies should not be empty", async () => {
            const user = {
                username: "Jest",
                age: 25,
            };
            const expected = { code: 400, message: validationErrors.HOBBIES_NOT_EXIST };
            const response = await supertest(workerServer).put(`${apiUrl}/${testId}`).send(JSON.stringify(user));

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expected);
        });

        it("Test 2.4: username should be a string type", async () => {
            const user = {
                username: 123,
                age: 25,
                hobbies: ["testing"],
            };
            const expected = { code: 400, message: validationErrors.USERNAME_IS_INVALID };
            const response = await supertest(workerServer).put(`${apiUrl}/${testId}`).send(JSON.stringify(user));

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expected);
        });

        it("Test 2.5: age should be a number type", async () => {
            const user = {
                username: "Jest",
                age: "Jest",
                hobbies: ["testing"],
            };
            const expected = { code: 400, message: validationErrors.AGE_IS_INVALID };
            const response = await supertest(workerServer).put(`${apiUrl}/${testId}`).send(JSON.stringify(user));

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expected);
        });

        it("Test 2.6: hobbies should be an array type", async () => {
            const user = {
                username: "Jest",
                age: 25,
                hobbies: "Jest",
            };
            const expected = { code: 400, message: validationErrors.HOBBIES_IS_INVALID };
            const response = await supertest(workerServer).put(`${apiUrl}/${testId}`).send(JSON.stringify(user));

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expected);
        });

        it("Test 2.7: hobbies items should be of string type", async () => {
            const user = {
                username: "Jest",
                age: 25,
                hobbies: [123],
            };
            const expected = { code: 400, message: validationErrors.HOBBIES_IS_INVALID };
            const response = await supertest(workerServer).put(`${apiUrl}/${testId}`).send(JSON.stringify(user));

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expected);
        });
    });
    describe("Test case 3: user id validation", () => {
        const testId = "test-id";

        it("Test 3.1: should create user with uuid id", async () => {
            const user = {
                username: "Jest",
                age: 25,
                hobbies: ["testing"],
            };
            const response = await supertest(workerServer).post(apiUrl).send(JSON.stringify(user));

            expect(response.statusCode).toBe(201);
            expect(validate(response.body.id)).toEqual(true);
        });

        it("Test 3.2: should validate id (get)", async () => {
            const response = await supertest(workerServer).get(`${apiUrl}/${testId}`);
            const expected = { code: 400, message: ERR_USER_ID_INVALID };

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expected);
        });

        it("Test 3.2: should validate id (delete)", async () => {
            const response = await supertest(workerServer).delete(`${apiUrl}/${testId}`);
            const expected = { code: 400, message: ERR_USER_ID_INVALID };

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expected);
        });

        it("Test 3.2: should validate id (put)", async () => {
            const response = await supertest(workerServer).put(`${apiUrl}/${testId}`).send(JSON.stringify({}));
            const expected = { code: 400, message: ERR_USER_ID_INVALID };

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expected);
        });
    });
});

describe("Scenario 3: errors", () => {
    const testId = "e574b0ed-dff4-45c8-987f-aedb16d64e68";
    const user = {
        username: "Jest",
        age: 25,
        hobbies: ["testing"],
    };

    it("Test 1: requested resource not found", async () => {
        const invalidUrl = "/invalid/url";
        const response = await supertest(workerServer).get(invalidUrl);
        const expected = { code: 404, message: ERR_RESOURCE_NOT_FOUND };

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(expected);
    });

    it("Test 2: method not allowed", async () => {
        const response = await supertest(workerServer).patch(apiUrl);
        const expected = { code: 405, message: ERR_UNSUPPORTED_OPERATION };

        expect(response.statusCode).toBe(405);
        expect(response.body).toEqual(expected);
    });

    it("Test 3: unexpected error", async () => {
        const response = await supertest(workerServer)
            .put(`${apiUrl}/${testId}`)
            .send(JSON.stringify(user) + "error");
        const expected = { code: 500, message: ERR_INVALID_DATA };

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual(expected);
    });

    it("Test 4: user not found (get)", async () => {
        const response = await supertest(workerServer).get(`${apiUrl}/${testId}`);
        const expected = { code: 404, message: ERR_USER_NOT_FOUND };

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(expected);
    });

    it("Test 5: user not found (put)", async () => {
        const response = await supertest(workerServer).put(`${apiUrl}/${testId}`).send(JSON.stringify(user));
        const expected = { code: 404, message: ERR_USER_NOT_FOUND };

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(expected);
    });

    it("Test 6: user not found (delete)", async () => {
        const response = await supertest(workerServer).delete(`${apiUrl}/${testId}`);
        const expected = { code: 404, message: ERR_USER_NOT_FOUND };

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(expected);
    });
});