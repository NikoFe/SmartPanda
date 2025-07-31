/*jest.mock('mysql2/promise', () => {
  return {
    createConnection: jest.fn(), // <== key change
  };
});*/
require('dotenv').config({ path: './.env.test' });
/*
process.env.DB_HOST = 'localhost'; // Or your Docker container name, or IP
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'Jebed1ah15car10t';
process.env.DB_NAME = 'smartpanda_test'; // Use a dedicated test database*/

const request = require('supertest');
const mysql = require('mysql2/promise');
const app = require('./Meni'); // Adjust path if needed

//console.log(" DDDDDDDDDDDDDDDDDDDDDDDDDD process.env.DB_HOST: ", process.env.DB_HOST)
console.log('DDDDDDDDDDDDDDDDDDDDDDDDDD ENV:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  decimalNumbers: true // <<< ADD THIS
});



// IMPORTANT: These should point to your ACTUAL test database
// For a real scenario, you'd typically load these from a .env file specific to testing

describe('Menu Service Integration Tests', () => {
    let connection;

    // Before all tests, establish a real database connection and populate data
    beforeAll(async () => {
        try {
            connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
            });
      
            // Ensure the 'jed' table exists and is empty before starting tests
            await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
 
            await connection.execute('DELETE FROM uporabnik_has_jed');
            await connection.execute('DELETE FROM jed_has_sestavina');
            await connection.execute('DELETE FROM jed');
            await connection.execute('DELETE FROM uporabnik');
            await connection.execute('DELETE FROM sestavina');

            await connection.execute(`
                INSERT INTO jed  VALUES  (1,'jed1', 'opis1', 1000, 'vegansko', 5)
                ,(2,'jed2', 'opis2', 2000, 'mesno', 10),(3,'jed3', 'opis3', 3000, 'mesno', 15)
                 `
                );
            await connection.execute(`
                INSERT INTO jed_has_sestavina  VALUES
                (1,1001),
                (2,1001),
                (2,1002),
                (3,1001),
                (3,1002),
                (3,1003)
            `);
            await connection.execute(`
                INSERT INTO sestavina  VALUES
                   (1001, 'sest1', 1),
                   (1002, 'sest2', 2),
                   (1003, 'sest3', 3)
            `);
            await connection.execute(`
                INSERT INTO uporabnik VALUES
                (1,'a', 'loc1', 'ap'),
                (2,'b', 'loc2', 'bp'),
                (3,'c', 'loc3', 'cp')
            `);
            await connection.execute(`
                INSERT INTO uporabnik_has_jed VALUES
                (1,1,5,0),
                (2,2,5,0),
                (3,3,5,0)
            `);
      

            await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
        } catch (error) {
            console.error('Failed to connect to test database or set up schema:', error);
            // If setup fails, prevent tests from running
            throw error; // <- Better than process.exit()
          //  process.exit(1);
        }

    });

    // After all tests, close the database connection
    afterAll(async () => {
        if (connection) {
            // Optional: Clean up test data or drop the table if you want a completely clean slate
           // await connection.execute('DELETE FROM jed');
            await connection.end();
        }
    });

    // Before each test, you might want to reset the state if tests modify data
    // For GET requests, it's often not strictly necessary unless you're testing data modification later.
    // For this example, we're assuming GET operations don't modify data, so `beforeAll` setup is sufficient.
    beforeEach(async () => {
        // You could, for instance, clear and re-insert a consistent dataset here
        // if your tests modified the database and you need a fresh state for each test.
        // For simple GETs, it's often not needed.
    });

    /*
    describe('GET /', () => {
        it('should return Hello World (integration test)', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toBe(200);
            expect(res.text).toBe('Hello World!');
        });
    });*/

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
 
    describe('GET /meals/:id', () => {
        it('should return the meal with the specified id from the actual database', async () => {
            // First, find an ID from the pre-populated data
            const [rows] = await connection.execute('SELECT id FROM jed WHERE ime = ?', ['jed1']);
            const mealId = rows[0].id;

            const res = await request(app).get(`/meals/${mealId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    id: mealId,
                    ime: 'jed1',
                    opis: 'opis1',
                    zaloga: 1000,
                    tip: 'vegansko',
                    cena: 5
                })
            ]));
        });
        /*
        it('should return 404 for a non-existent meal ID', async () => {
            const nonExistentId = 9999; // Assuming this ID won't exist
            const res = await request(app).get(`/meals/${nonExistentId}`);
            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({}); // Or whatever your service returns for not found
        });*/
    });     

  app.get('/ingredients/:id', async(req, res) => {
    id=  parseInt(req.params.id)
    console.log("URL id: ||", id,"||")
    try {
      const connection =(await mysql.createConnection(dbConfig));

      const [rows] = await connection.execute( `SELECT sestavina.ime,kalorije FROM sestavina JOIN jed_has_sestavina ON Sestavina_id =
         sestavina.id  JOIN jed ON jed.id=Jed_id WHERE Jed_id = ?`, [1]);

      console.log("sest: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error getting meal post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })

    describe('GET /ingredients/:id', () => {
        it('should return the meal with the specified id from the actual database', async () => {
            // First, find an ID from the pre-populated data
         res = await request(app).get(`/ingredients/${3}`);


            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThanOrEqual(3);
            expect(res.body).toEqual(expect.arrayContaining([
               expect.objectContaining({ ime: 'sest1', kalorije:1}),
               expect.objectContaining({ ime: 'sest2', kalorije:2}),
               expect.objectContaining({ ime: 'sest3', kalorije:3}),
            ]));
        });

    });    

    describe('GET /users', () => {
        it('should return the users', async () => {
            // First, find an ID from the pre-populated data
         res = await request(app).get(`/users`);


            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThanOrEqual(3);
            expect(res.body).toEqual(expect.arrayContaining([
               expect.objectContaining({ id: 1, ime: 'a', lokacija:"loc1",geslo:"ap" ,  }),
               expect.objectContaining({ id: 2, ime: 'b', lokacija:"loc2",geslo:"bp" ,  }),
               expect.objectContaining({ id: 3, ime: 'c', lokacija:"loc3",geslo:"cp" ,  }),
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

    describe('POST /users', () => {
        it('should return the users', async () => {
        const newUser = {
          username: "d",
          location: "loc4",
          password: "dp",
        };

         await request(app)
          .post("/users")
          .send(newUser)
          .set("Accept", "application/json");

         const res = await request(app)
          .get("/users")
   
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThanOrEqual(4);
            expect(res.body).toEqual(expect.arrayContaining([
               expect.objectContaining({ id: 1, ime: 'a', lokacija:"loc1",geslo:"ap"  }),
               expect.objectContaining({ id: 2, ime: 'b', lokacija:"loc2",geslo:"bp"  }),
               expect.objectContaining({ id: 3, ime: 'c', lokacija:"loc3",geslo:"cp"  }),
               expect.objectContaining({ id:  expect.any(Number), ime: 'd', lokacija:"loc4",geslo:"dp"  }),
            ]));
        });
    });    

   describe('GET /validateUser/:username/:password', () => {
        it('should return the users', async () => {
        //  const res = await request(app).get(`/validateUser/${'a'}/${'ap'}`)
            const res = await request(app).get(`/validateUser/a/ap`)
            expect(res.statusCode).toBe(200);
            //expect(res.body.length).toBeGreaterThanOrEqual(4);
            expect(res.body).toEqual(expect.arrayContaining([
               expect.objectContaining({ id: 1, ime: 'a', lokacija:"loc1",geslo:"ap"  }),
            ]));
        });
    });   
    // Add integration tests for other Menu service endpoints (POST, PUT, DELETE if applicable)
    // For POST/PUT/DELETE, you'd insert/update/delete data and then verify the changes
    // by querying the database directly or through another GET request.

    /*
    Example for a POST endpoint (if your Menu service had one for adding meals)
    describe('POST /meals', () => {
        it('should add a new meal to the database', async () => {
            const newMeal = {
                ime: 'New Burger',
                opis: 'A juicy test burger',
                zaloga: 15,
                tip: 'Fast food',
                cena: 12.50
            };

            const res = await request(app).post('/meals').send(newMeal);

            expect(res.statusCode).toBe(201); // Or whatever status code your API returns for creation
            expect(res.body).toEqual(expect.objectContaining({ message: 'Meal added successfully' })); // Adjust based on your API response

            // Verify by querying the database directly
            const [rows] = await connection.execute('SELECT * FROM jed WHERE ime = ?', ['New Burger']);
            expect(rows.length).toBe(1);
            expect(rows[0]).toEqual(expect.objectContaining({
                ime: 'New Burger',
                opis: 'A juicy test burger',
                zaloga: 15,
                tip: 'Fast food',
                cena: 12.50
            }));
        });
    });

            // Insert some initial data for tests

            await connection.execute(`
                CREATE TABLE jed (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    ime VARCHAR(255) NOT NULL,
                    opis TEXT,
                    zaloga INT NOT NULL,
                    tip VARCHAR(100),
                    cena DECIMAL(10, 2) NOT NULL
                )
            `);
            /*
            await connection.execute(`
                INSERT INTO jed (ime, opis, zaloga, tip, cena) VALUES
                ('Test Pizza', 'A delicious test pizza', 10, 'Fast food', 9.99),
                ('Test Pasta', 'Creamy test pasta', 5, 'Main', 7.50),
                ('Test Salad', 'Fresh test salad', 20, 'Healthy', 6.00);
            `);*/
});