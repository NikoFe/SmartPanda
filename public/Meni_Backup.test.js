

//const request = require("supertest");
const request = require('supertest');
require('dotenv').config({ path: './.env.test' }); // ⬅️ must come first

// Mock before requiring server
jest.mock('mysql2/promise', () => ({
  createConnection: jest.fn(),
}));

const mysql = require("mysql2/promise");


process.env.DB_HOST = 'localhost'; // Or whatever placeholder is needed for the mock
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'Jebed1ah15car10t';
process.env.DB_NAME = 'smartpanda';

require('dotenv').config({ path: './.env.test' }); // Still useful for other test-specific env vars

let mockConnection;
let app;


  beforeEach(() => {
    mockConnection = {
      //execute: jest.fn(),
      execute: jest.fn().mockResolvedValue([[]]),
      end: jest.fn(),
    };
    mysql.createConnection.mockResolvedValue(mockConnection);
    // Now require the server after env vars are set and mock is in place
    app = require("../Meni/server"); 
  });

  afterEach(() => {
    jest.clearAllMocks();
  });



  describe("GET /", () => {
    it('should respond with "Hello World!"', async () => {
      const response = await request(app).get("/");
      expect(response.text).toBe("Hello World!");
      expect(response.statusCode).toBe(200);
    });
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