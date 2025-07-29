jest.mock('mysql2/promise', () => {
  return {
    createConnection: jest.fn(), // <== key change
  };
});

const request = require('supertest');
const mysql = require('mysql2/promise');
const createApp = require('./gateway');

process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'Jebed1ah15car10t';
process.env.DB_NAME = 'smartpanda';


describe('Server Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


describe('POST /user_has_meal', () => {
  it('should return success when gRPC InsertOrder succeeds', async () => {
    const mockClient = {
      InsertOrder: jest.fn((data, callback) => {
        callback(null, { result: "SUCCESS" });
      })
    };

    const app = createApp(mockClient);

    const res = await request(app)
      .post('/user_has_meal')
      .send({ user_id: 1, meal_id: 2, amount: 3 });

    expect(mockClient.InsertOrder).toHaveBeenCalledWith(
      { user_id: 1, meal_id: 2, amount: 3 },
      expect.any(Function)
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "inserting order success" });
  });
});
////////////
describe('PUT /updateZaloga', () => {
   it('should update stock when gRPC UpdateZaloga succeeds', async () => {
    const mockClient = {
       UpdateZaloga: jest.fn((data, callback) => {
        callback(null, { result: "SUCCESS" });
      }),
    };

    const app = createApp(mockClient);

    const res = await request(app)
      .put('/updateZaloga')
      .send({ user_id: 1, meal_id: 2, amount: 3 });//sends the request body

    expect(mockClient.UpdateZaloga).toHaveBeenCalledWith(
      { user_id: 1, meal_id: 2, amount: 3 },
      expect.any(Function)
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "update zaloga success" });
  });
});
////////////
describe('DELETE /user_has_meal/:user_id/:meal_id', () => {
   it('should update stock when gRPC UpdateZaloga succeeds', async () => {
    const mockClient = {
        DeleteTimer: jest.fn((data, callback) => {
        callback(null, { result: "SUCCESS" });
      }),
    };

    const app = createApp(mockClient);

      let userId=1;
      let mealId=2;
      const res = await request(app)
      .delete(`/user_has_meal/${userId}/${mealId}`)
      
    expect(mockClient.DeleteTimer).toHaveBeenCalledWith(
      { user_id: 1, meal_id: 2 },
      expect.any(Function)
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "delete timer success" });
  });
});

  describe('GET /meals', () => {
    it('should fetch meals from database and return them', async () => {

    const mockClient = {
        InsertOrder: jest.fn((data, callback) => {
        callback(null, { result: "SUCCESS" });
      }),
    };
      const mockRows = [
        { id: 1, ime: 'Pizza', opis: 'Tasty', zaloga: 10, tip: 'Fast food', cena: 9 },
        { id: 2, ime: 'Pasta', opis: 'Delicious', zaloga: 5, tip: 'Main', cena: 7 }
      ];
      const mockConnection = {
        execute: jest.fn().mockResolvedValue([mockRows]),
      };
      mysql.createConnection.mockResolvedValue(mockConnection);
      const app = createApp(mockClient);
      const res = await request(app).get('/meals');

      //expect(mysql.createConnection).toHaveBeenCalled();
      expect(mysql.createConnection).toHaveBeenCalledTimes(1);
      expect(mockConnection.execute).toHaveBeenCalledWith('SELECT * FROM jed');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockRows);
    });

});
describe('GET /users/:username/:password', () => {
   it('should fetch specific username', async () => {
    const mockClient = {
        InsertOrder: jest.fn((data, callback) => {
        callback(null, { result: "SUCCESS" });
      }),
    };
   //////////////////////7
      const mockUser = [
        {
          id: 1,
          ime: "uporabnik1",
          lokacija: "loc1",
          geslo: "a"
        },
      ];
      const mockConnection = {
        execute: jest.fn().mockResolvedValue([mockUser]),
      };

      mysql.createConnection.mockResolvedValue(mockConnection);

////////////////////7
     const app = createApp(mockClient);

      let username="user1";
      let password="password1";
      const res = await request(app)
      .get(`/users/${username}/${password}`)

    expect(res.body).toEqual(mockUser);
    expect(res.statusCode).toBe(200);
    expect(mockConnection.execute).toHaveBeenCalledWith(
    `SELECT id FROM uporabnik WHERE ime= ? AND geslo= ?`,[username,password]
    )
    //expect(res.body).toEqual({ message: "delete timer success" }); 
  });
});
});/////////////////////////////