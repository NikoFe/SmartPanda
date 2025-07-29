
/*import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import mysql from 'mysql2/promise';*/

/*
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};*/

const grpc = require( '@grpc/grpc-js');
const protoLoader  = require('@grpc/proto-loader');
const mysql  = require('mysql2/promise');
const dotenv  = require('dotenv');

jest.mock('mysql2/promise');

const PROTO_PATH = './proto/pending_order.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = grpc.loadPackageDefinition(packageDefinition).pendingorder;
let client, server;

beforeAll((done) => {
  const PendingOrderService = {
    GetPendingOrders: jest.fn(),
    UpdateZaloga: async (call, callback) => {
      try {
        const { user_id, meal_id, amount } = call.request;
        const db = await mysql.createConnection({});
        await db.execute("UPDATE jed SET zaloga = ? WHERE id = ?", [amount, meal_id]);
        await db.execute("UPDATE uporabnik_has_jed SET odobreno = 1 WHERE uporabnik_id=? AND jed_id = ?", [user_id, meal_id]);
        await db.end();
        callback(null, {});
      } catch (err) {
        callback({
          code: grpc.status.INTERNAL,
          message: err.message || "Internal Server Error",
        });
      }
    },
    InsertOrder: async (call, callback) => {
      try {
      const { user_id, meal_id, amount } = call.request;
      const db = await mysql.createConnection({});
      const [rows2] = await db.execute(
        "SELECT * FROM uporabnik_has_jed WHERE  uporabnik_id = ? and jed_id = ? ",
        [user_id, meal_id]
      );
      if (rows2.length > 0) {
        await db.execute(
          "DELETE FROM  uporabnik_has_jed WHERE uporabnik_id= ? and jed_id =?",
          [user_id, meal_id]
        );
      }
      await db.execute("INSERT INTO uporabnik_has_jed VALUES (?,?,?,?)", [
        user_id,
        meal_id,
        amount,
        0,
      ]);
      await db.end();
      callback(null, { result: "SUCCESS" });
      } catch (err) {
      callback({
        code: grpc.status.INTERNAL,
        message: err.message || "Internal Server Error",
      });
      }
    },
    
  DeleteTimer: async (call, callback) => {
    try {
      const db = await mysql.createConnection({});
      const { user_id, meal_id } = call.request;
     // setTimeout(async () => {
        try {
          await db.execute(
            "DELETE FROM uporabnik_has_jed WHERE uporabnik_id = ? AND jed_id = ?",
            [user_id, meal_id]
          );
        } catch (error) {
          console.error("Error during delayed DELETE:", error);
        } finally {
          await db.end();
        }
   //   }, 1000);

      callback(null, {});
    } catch (error) {
      console.log("Error:", error);
      callback({
        code: grpc.status.INTERNAL,
        message: error.message || "Internal Server Error",
      });
    }
  },



  };

  server = new grpc.Server();
  server.addService(proto.PendingOrderService.service, PendingOrderService);
  server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    client = new proto.PendingOrderService('localhost:50052', grpc.credentials.createInsecure());
    done();
  });
});

afterAll(() => {
  server.tryShutdown(() => {});
});

test('UpdateZaloga returns success when DB updates work', (done) => {
  // Mock db.execute and db.end
  const mockExecute = jest.fn().mockResolvedValue([]);
  const mockEnd = jest.fn();
  mysql.createConnection.mockResolvedValue({
    execute: mockExecute,
    end: mockEnd,
  });

  const request = { user_id: 1, meal_id: 2, amount: 5 };

  client.UpdateZaloga(request, (err, response) => {
    expect(err).toBeNull();
    expect(response).toEqual({});
    expect(mockExecute).toHaveBeenCalledTimes(2);
    done();
  });
});

test('InsertOrder inserts new value in table', (done) => {
  //const mockExecute = jest.fn().mockResolvedValue([]);
  const mockExecute = jest.fn()
    .mockResolvedValueOnce([[]])   // SELECT returns no match
    .mockResolvedValueOnce([]);    // INSERT only

  const mockEnd = jest.fn();
  mysql.createConnection.mockResolvedValue({
    execute: mockExecute,
    end: mockEnd,
  });

  const request = { user_id: 1, meal_id: 2, amount: 5 };

  client.InsertOrder(request, (err, response) => {
    expect(err).toBeNull();
    expect(response).toEqual({ result: "SUCCESS" });
    expect(mockExecute).toHaveBeenCalledTimes(2);
  //  expect(mockExecute.mock.calls.length).toBeGreaterThanOrEqual(2);
   // expect(mockExecute.mock.calls.length).toBeLessThanOrEqual(3);
    done();
  });
});

test('Delete timer test', (done) => {
  const mockExecute = jest.fn().mockResolvedValue([]);
  const mockEnd = jest.fn();

  mysql.createConnection.mockResolvedValue({
    execute: mockExecute,
    end: mockEnd,
  });

  const request = { user_id: 1, meal_id: 2 };

  client.DeleteTimer(request, (err, response) => {
    expect(err).toBeNull();
    expect(response).toEqual({});
    
    // Fast-forward all timers to simulate delay
    //jest.runAllTimers();

    // Now the setTimeout callback should have been called
    setImmediate(async () => {
    await Promise.resolve(); // flush pending microtasks
    expect(mockExecute).toHaveBeenCalledTimes(1);
    done();
    });
  });
});
