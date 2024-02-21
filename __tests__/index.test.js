const app = require("../app");
const request = require("supertest");

describe("app", () => {
  describe("get all bikes", () => {
    test("returns 200", async () => {
      const response = await request(app).get("/bicycles").send();
      expect(response.status).toBe(200);
    });
  });
});
