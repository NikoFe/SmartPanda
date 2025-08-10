
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

const app = require('./Meni'); // adjust path if needed

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

  describe("GET /meals?id", () => {
    it("should return the meal with the specified id", async () => {

     const mockSingleJed=[
        { id: 1, ime: 'Pizza', opis: 'Tasty', zaloga: 10, tip: 'Fast food', cena: 9 },
     ]
      const mockJedi = [
        { id: 1, ime: 'Pizza', opis: 'Tasty', zaloga: 10, tip: 'Fast food', cena: 9 }, 
        { id: 2, ime: 'Pasta', opis: 'Delicious', zaloga: 5, tip: 'Main', cena: 7 },
        { id: 3, ime: 'Cheese', opis: 'Delicious', zaloga: 4, tip: 'Main', cena: 10}
      ];

      const mockConnection = {
        execute: jest.fn().mockResolvedValue([mockSingleJed]),
      };

      mysql.createConnection.mockResolvedValue(mockConnection);

      const mealId = 1; // Name of the post to delete
      const res = await request(app).get(`/meals/${mealId}`);

      //expect(mysql.createConnection).toHaveBeenCalled();
      expect(mysql.createConnection).toHaveBeenCalledTimes(1);
      expect(mockConnection.execute).toHaveBeenCalledWith( "SELECT * FROM jed WHERE id = ?",
        [mealId]);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockSingleJed);

    });
   });
  
    describe("GET /ingredients?id", () => {
    it("should return the ingredients with the specified id", async () => {
      const mockSestavina = [
        {
          id:1,
          ime: "sestavina1",
          kalorije: 10
        },
      ];

      //mockConnection.execute.mockResolvedValue([mockSestavine]);

      const mockConnection = {
        execute: jest.fn().mockResolvedValue([mockSestavina]),
      };

      mysql.createConnection.mockResolvedValue(mockConnection);


      const jed_id = 1; // Name of the post to delete
      const response = await request(app).get(`/ingredients/${jed_id}`);

      expect(mysql.createConnection).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockSestavina);
      expect(mockConnection.execute).toHaveBeenCalledWith(
      "SELECT sestavina.ime,kalorije FROM sestavina JOIN jed_has_sestavina ON Sestavina_id = sestavina.id  JOIN jed ON jed.id=Jed_id WHERE Jed_id = ?",
        [jed_id]
      );
    });
   });
    
///////////////////////////////////////

    describe("GET /users", () => {
    it("should return the all users ", async () => {
      const mockUsers = [
        {
          id: 1,
          ime: "uporabnik1",
          lokacija: "loc1",
          geslo: "a"
        },
        {
          id: 2,
          ime: "uporabnik2",
          lokacija: "loc2",
          geslo: "b"
        },
        {
          id: 3,
          ime: "uporabnik3",
          lokacija: "loc3",
          geslo: "c"
        },
      ];

     // mockConnection.execute.mockResolvedValue([mockUsers]);
      const mockConnection = {
        execute: jest.fn().mockResolvedValue([mockUsers]),
      };

      mysql.createConnection.mockResolvedValue(mockConnection);


      const response = await request(app).get(`/users`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(mockConnection.execute).toHaveBeenCalledWith(
      "SELECT * FROM uporabnik"
      );
    });
  });

  describe("GET /users/:username/:password", () => {
    it("should return the user  with the specified username and password", async () => {
      const mockUser = [
        {
          id: 1,
          ime: "uporabnik1",
          lokacija: "loc1",
          geslo: "a"
        },
      ];

     // mockConnection.execute.mockResolvedValue([mockUser]);
      const mockConnection = {
        execute: jest.fn().mockResolvedValue([mockUser]),
      };

      mysql.createConnection.mockResolvedValue(mockConnection);

      let username="uporabnik1";
      let password= "a";
      const response = await request(app).get(`/users/${username}/${password}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockUser);
      

      expect(mockConnection.execute).toHaveBeenCalledWith(
        "SELECT id FROM uporabnik WHERE ime  =  ? and geslo =?",
        [username,password ]
      );
    });
   });

    describe("POST /users", () => {
      it("should insert a new user into the database", async () => {
        const newUser = {
          username: "testuser",
          location: "testville",
          password: "testpass"
        };

        const mockResult = [{ affectedRows: 1 }]; // Simulate result from INSERT
        const mockConnection = {
          execute: jest.fn().mockResolvedValue(mockResult),
        };

        mysql.createConnection.mockResolvedValue(mockConnection);

        const res = await request(app)
          .post("/users")
          .send(newUser)
          .set("Accept", "application/json");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockResult[0]);

        expect(mockConnection.execute).toHaveBeenCalled();

        // Optionally test part of the SQL (if you use placeholders)
        expect(mockConnection.execute.mock.calls[0][0]).toContain("INSERT INTO uporabnik");

        // Or test args directly if using parameterized queries
        // expect(mockConnection.execute).toHaveBeenCalledWith(
        //   expect.stringContaining("INSERT INTO uporabnik"),
        //   expect.arrayContaining([expect.any(Number), "testuser", "testville", "testpass", 0])
        // );
      });
    });


  describe("GET /validateUser/:username/:password", () => {
    it("should return the user  with the specified username and password", async () => {
      const mockUser = [
        {
          id: 1,
          ime: "uporabnik1",
          lokacija: "loc1",
          geslo: "a"
        },
      ];
     // mockConnection.execute.mockResolvedValue([mockUser]);
      const mockConnection = {
        execute: jest.fn().mockResolvedValue([mockUser]),
      };

      mysql.createConnection.mockResolvedValue(mockConnection);
      
      let username="uporabnik1";
      let password= "a";
      const response = await request(app).get(`/validateUser/${username}/${password}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockUser);
      
      expect(mockConnection.execute).toHaveBeenCalledWith(
      `SELECT * FROM uporabnik WHERE ime= ?  AND geslo=?`,[username,password]
      );
    });
   });


  /////  */
  });