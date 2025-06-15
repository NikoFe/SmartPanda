
describe("GET /", () => {
  it('should respond with "Hello World!"', async () => {
    const response = await request(app).get("/");
    expect(response.text).toBe("Hello World!");
    expect(response.statusCode).toBe(200);
  });
});

const request = require("supertest");
const app = require("../server"); // changed from server.js to app.js
const mysql = require("mysql2/promise");

jest.mock("mysql2/promise");

  beforeEach(() => {
    mockConnection = {
      execute: jest.fn(),
      end: jest.fn(),
    };
    mysql.createConnection.mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  describe("GET /meals", () => {
    it("should return all posts", async () => {
      const mockJedi = [
        {
          id: 1,
          ime: "jed1,",
          cena: 10,
          opis: "aaa",
          tip: "a",
        },
        {
          id: 2,
          ime: "jed2,",
          cena:20,
          opis: "bbb",
          tip: "b",
        },
        {
          id: 3,
          ime: "jed3,",
          cena: 30,
          opis: "ccc",
          tip: "c",
        },
      ];

      mockConnection.execute.mockResolvedValue([mockJedi]);

      const response = await request(app).get("/meals");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockJedi);
      expect(mockConnection.execute).toHaveBeenCalledWith("SELECT * FROM jed");
    });
  });


  describe("GET /meals?id", () => {
    it("should return the meal with the specified id", async () => {
      const mockJedi = [
        {
          id: 1,
          ime: "jed1,",
          cena: 10,
          opis: "aaa",
          tip: "a",
        },
      ];

      mockConnection.execute.mockResolvedValue([mockJedi]);

      const mealId = 1; // Name of the post to delete

      const response = await request(app).get(`/meals/${mealId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockJedi);
      
      expect(mockConnection.execute).toHaveBeenCalledWith(
        "SELECT * FROM jed WHERE id = ?",
        [mealId]
      );
    });
  });
    describe("GET /ingredients?id", () => {
    it("should return the ingredients with the specified id", async () => {
      const mockSestavine = [
        {
          ime: "sestavina1",
          kalorije: 10
        },
              {
          ime: "sestavina2",
          kalorije: 20
        },
              {
          ime: "sestavina3",
          kalorije: 30
        },
      ];

      mockConnection.execute.mockResolvedValue([mockSestavine]);

      const jed_id = 1; // Name of the post to delete

      const response = await request(app).get(`/ingredients/${jed_id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockSestavine);
      
      expect(mockConnection.execute).toHaveBeenCalledWith(
      "SELECT sestavina.ime,kalorije FROM sestavina JOIN jed_has_sestavina ON Sestavina_id = sestavina.id  JOIN jed ON jed.id=Jed_id WHERE Jed_id = ?",
        [jed_id]
      );
    });
  });