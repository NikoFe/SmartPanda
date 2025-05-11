const request = require("supertest");
const app = require("../server"); // changed from server.js to app.js

describe("GET /", () => {
  it('should respond with "Hello World!"', async () => {
    const response = await request(app).get("/");
    expect(response.text).toBe("Hello World!");
    expect(response.statusCode).toBe(200);
  });
});