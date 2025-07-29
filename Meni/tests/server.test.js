
// Mock the mysql2/promise module
//jest.mock('mysql2/promise');
jest.mock('mysql2/promise', () => {
  return {
    createConnection: jest.fn(), // <== key change
  };
});

const request = require('supertest');
const mysql = require('mysql2/promise');

process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'Jebed1ah15car10t';
process.env.DB_NAME = 'smartpanda';

const app = require('../server'); // adjust path if needed
//const mysql = require('mysql2/promise');



describe('Server Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return Hello World', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Hello World!');
    });
  });

  describe('GET /meals', () => {
    it('should fetch meals from database and return them', async () => {
      const mockRows = [
        { id: 1, ime: 'Pizza', opis: 'Tasty', zaloga: 10, tip: 'Fast food', cena: 9 },
        { id: 2, ime: 'Pasta', opis: 'Delicious', zaloga: 5, tip: 'Main', cena: 7 }
      ];

      const mockConnection = {
        execute: jest.fn().mockResolvedValue([mockRows]),
      };

      mysql.createConnection.mockResolvedValue(mockConnection);

      const res = await request(app).get('/meals');

      //expect(mysql.createConnection).toHaveBeenCalled();
      expect(mysql.createConnection).toHaveBeenCalledTimes(1);
      expect(mockConnection.execute).toHaveBeenCalledWith('SELECT * FROM jed');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockRows);
    });

  });
});
