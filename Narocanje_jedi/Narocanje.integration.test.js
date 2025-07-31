const { spawn } = require('child_process');
const path = require('path');
const request = require('supertest');
const createApp = require('./gateway'); // Adjust path if needed
const mysql = require('mysql2/promise');

let grpcProcess;
let app;
let server;
let connection;

beforeAll(async () => {
  // 1. Start gRPC service (Odobrenje) as a separate process
  grpcProcess = spawn('node', [path.join(__dirname, '../Odobrenje_Narocila/Odobrenje.js')]);

  grpcProcess.stdout.on('data', data => {
    if (data.toString().includes('PendingOrderService running')) {
      console.log('gRPC server started');
    }
  });

  grpcProcess.stderr.on('data', data => {
    console.error(`gRPC stderr: ${data}`);
  });
  // 2. Wait for gRPC server to start (could use a better sync if needed)
  await new Promise(resolve => setTimeout(resolve, 1500));
  // 3. Create app with default gRPC client
  app = createApp();
  // 4. Setup test database connection
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
      decimalNumbers: true // <<< ADD THIS
  });

  // Clean target table
//  await connection.execute('DELETE FROM uporabnik_has_jed');
});

afterAll(async () => {
  if (connection) await connection.end();
  if (grpcProcess) grpcProcess.kill();
});

beforeEach(async () => {
  await connection.beginTransaction();
});
afterEach(async () => {
  await connection.rollback(); // revert changes
});


describe('Integration: POST /user_has_meal', () => {
  it('should call Odobrenje via gRPC and insert into DB', async () => {
    const user_id = 1;
    const meal_id = 1;
    const amount = 5;

    const res = await request(app)
      .post('/user_has_meal')
      .send({ user_id, meal_id, amount });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "inserting order success" });

    // Verify DB was updated
    const [rows] = await connection.execute(
      'SELECT * FROM uporabnik_has_jed WHERE uporabnik_id = ? AND jed_id = ?',
      [user_id, meal_id]
    );

    expect(rows.length).toBe(1);
    expect(rows[0]).toMatchObject({
      uporabnik_id: user_id,
      jed_id: meal_id,
      kolicina: amount,
      odobreno: 0,
    });
  });
});

describe('PUT /updateZaloga', () => {
  it('should call Odobrenje via gRPC and insert into DB', async () => {
    const user_id = 1;
    const meal_id = 1;
    const amount = 1000;
    const res = await request(app)
      .put('/updateZaloga')
      .send({ user_id, meal_id, amount });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "update zaloga success" });

    // Verify DB was updated
    const [rows] = await connection.execute(
      'SELECT zaloga FROM jed WHERE id = ?',
      [meal_id]
    );
    const newAmount= rows[0].zaloga;
    expect(newAmount).toBe(1000);

    const [rows2] = await connection.execute(
      'SELECT * FROM uporabnik_has_jed  WHERE uporabnik_id = ? AND jed_id = ?;',
      [user_id,meal_id]
    );
    expect(rows2[0]).toMatchObject({
      uporabnik_id: user_id,
      jed_id: meal_id,
      kolicina: expect.any(Number),
      odobreno: 1,
    });
  });
});

describe('DELETE /user_has_meal/:user_id/:meal_id', () => {
  it('should call Odobrenje via gRPC and insert into DB', async () => {
   // const user_id = 1;
   // const meal_id = 1;
    const res = await request(app)
      .delete('/user_has_meal/1/1')

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "delete timer success" });

    // Verify DB was updated
    const [rows] = await connection.execute(
      'SELECT * FROM uporabnik_has_jed'
    );


    expect(rows).toEqual(expect.arrayContaining([
        expect.objectContaining({ uporabnik_id: 2, jed_id: 2, kolicina:5,odobreno:0  }),
        expect.objectContaining({ uporabnik_id: 3, jed_id: 3, kolicina:5,odobreno:0  }),
    ]));

    /*
    expect(rows).toMatchObject({
      uporabnik_id: user_id,
      jed_id: meal_id,
      kolicina: expect.any(Number),
      odobreno: 1,
    });*/
    const user_id = 1;
    const meal_id = 1;
    const amount = 1000;
    const res2 = await request(app)
      .post('/user_has_meal')
      .send({ user_id, meal_id, amount });

    const [rows2] = await connection.execute(
      'SELECT * FROM uporabnik_has_jed'
    );
    expect(rows2).toEqual(expect.arrayContaining([
        expect.objectContaining({ uporabnik_id: 1, jed_id: 1, kolicina:expect.any(Number),odobreno:1  }),
        expect.objectContaining({ uporabnik_id: 2, jed_id: 2, kolicina:5,odobreno:0  }),
        expect.objectContaining({ uporabnik_id: 3, jed_id: 3, kolicina:5,odobreno:0  }),
    ]));

  });
});

    describe('GET /meals', () => {
        it('should fetch all meals from the actual database', async () => {
            const res = await request(app).get('/meals');

            expect(res.statusCode).toBe(200);
            // Expect the body to contain the data inserted in beforeAll
            expect(res.body.length).toBeGreaterThanOrEqual(1); // At least 3 meals
            expect(res.body).toEqual(expect.arrayContaining([
                expect.objectContaining({ ime: 'jed1', zaloga: 1000, cena: 5,  id:1, opis:"opis1", tip:"vegansko"}),
                expect.objectContaining({ ime: 'jed2', zaloga: 2000, cena: 10,  id:2, opis:"opis2", tip:"mesno"}),
                expect.objectContaining({ ime: 'jed3', zaloga: 3000, cena: 15,  id:3, opis:"opis3", tip:"mesno"}),
            ]));
        });
    });
      describe('GET /users/:username/:password', () => {
        it('should return the user with the  specified id from the actual database', async () => {
            // First, find an ID from the pre-populated data
         res = await request(app).get(`/users/a/ap`);

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
            expect(res.body).toEqual(expect.arrayContaining([
               expect.objectContaining({ id: 1 }),
            ]));
        });
    });    

