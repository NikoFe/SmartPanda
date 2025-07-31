/*import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';*/

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require('path');

dotenv.config();
const PROTO_PATH = path.join(__dirname, 'proto', 'pending_order.proto');
//const PROTO_PATH = "./proto/pending_order.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition).pendingorder;

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const PendingOrderService = {
  GetPendingOrders: async (_, callback) => {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute(
      "SELECT * FROM uporabnik_has_jed WHERE odobreno = 0"
    );
    callback(null, { orders: rows });
  },

  DeleteTimer: async (call, callback) => {
    try {
      const { user_id, meal_id } = call.request;
      console.log("TIMER CALLED");
      console.log("DeleteTimer user_id: ", user_id);
      console.log("DeleteTimer meal_id: ", meal_id);

      setTimeout(async () => {
        console.log("20 seconds have passed.");

        const db = await mysql.createConnection(dbConfig);
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
      }, 20000);

      // Callback right away — this doesn't wait 20s
      callback(null, {});
    } catch (error) {
      console.log("Error:", error);
      callback({
        code: grpc.status.INTERNAL,
        message: error.message || "Internal Server Error",
      });
    }
  },

  /*
  DeleteTimer: async (call, callback) => {
    const { user_id, meal_id } = call.request;
    try{

    console.log("TIMER CALLED")
    //console.log("CALLING DELETE TIMER")

    console.log("DeleteTimer user_id: ",user_id)
    console.log("DeleteTimer meal_id: ",meal_id)


    setTimeout(async () =>  {
      console.log("20 seconds have passed.");
      
      const [rows] = await db.execute(
        "DELETE FROM uporabnik_has_jed  WHERE uporabnik_id =? AND jed_id = ? ",
         [user_id, meal_id]
      );
    }, 20000);
    await db.end();
    }
 catch(error){
      console.log("Error:", error);
      await db.end(); 
      callback({
        code: grpc.status.INTERNAL,
        message: error.message || "Internal Server Error"
      });
   }

  },*/

  UpdateZaloga: async (call, callback) => {
    console.log("ZALOGA CALLED");
    try {
      const { user_id, meal_id, amount } = call.request;
      console.log("UpdateZaloga user_id: ", user_id);
      console.log("UpdateZaloga meal_id: ", meal_id);
      console.log("UpdateZaloga amount: ", amount);

      const db = await mysql.createConnection(dbConfig);

      await db.execute("UPDATE jed SET zaloga = ? WHERE id = ?", [
        amount,
        meal_id,
      ]);

      await db.execute(
        "UPDATE uporabnik_has_jed SET odobreno = 1 WHERE uporabnik_id=? AND jed_id = ?;",
        [user_id, meal_id]
      );
      await db.end();
      callback(null, { result: "SUCCESS" });
    } catch (error) {
      console.log("Error:", error);
      callback({
        code: grpc.status.INTERNAL,
        message: error.message || "Internal Server Error",
      });
    }
  },

  InsertOrder: async (call, callback) => {
    try {
      const db = await mysql.createConnection(dbConfig);
      const { user_id, meal_id, amount } = call.request;
      const [rows2] = await db.execute(
        "SELECT * FROM uporabnik_has_jed WHERE  uporabnik_id = ? and  jed_id = ? ",
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
    } catch (error) {

      console.log("Error:", error, "\n \n host: ", host, " user ",user, 
        " password: ", password, " database: ",database );
      await db.end();
      callback({
        code: grpc.status.INTERNAL,
        message: error.message || "Internal Server Error",
      });
    }
  },
};

const server = new grpc.Server();
server.addService(proto.PendingOrderService.service, PendingOrderService);
server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("PendingOrderService running on port 50051");
    server.start();
  }
);
/*
  CheckIfEnoughStock: async (call, callback) => {
    const { user_id, meal_id } = call.request;
    console.log("______________________________: "+user_id+ " meal_id: "+meal_id)
    console.table(call.request);
    console.log("CALL REQUEST: "+JSON.stringify(call.request));
    const db = await mysql.createConnection(dbConfig);
    try {
      // Get order
      const [[kolicina]] = await db.execute(
        "SELECT kolicina FROM uporabnik_has_jed WHERE uporabnik_id = ? AND jed_id = ? AND odobreno = 0",
        [user_id, meal_id]
      );
      if (!kolicina) {
       // return callback(null, { success: false, message: "Order not found" });
        return callback(null, { success: false, amount: 0 });
      }
      console.log("GRPCSSSSSSSS: ")
      console.log("kolicina: ",kolicina)
      console.log("user_id: ",user_id)
      console.log("meal_id: ",meal_id)
      const [[zaloga]] = await db.execute(
        "SELECT zaloga FROM jed WHERE id = ?",
        [meal_id]
      );

      if(kolicina > zaloga ){
        console.log("not enough in stock")
        return callback(null, { result:false });
        //delete
      }
     else {
      console.log("KOLICINA: ",kolicina)

       await db.execute(
          "UPDATE jed SET zaloga = ? WHERE id=?;",
          [zaloga-kolicina, meal_id]
        );
       console.log("111111: ", user_id)
       console.log("222222: ", meal_id)
       await db.execute(
          "UPDATE uporabnik_has_jed SET odobreno = 1 WHERE uporabnik_id=? AND jed_id = ?;",
          [ user_id, meal_id]
        );



      //set odobreno to 1 and delete after 2 minutes
      return callback(null, { result:true });
     }
      //callback(null, { success: true, message: "Order approved" });
    } catch (err) {
      console.error("CAUGHT ERROR: "+err);
      callback(null, { success: false, amount: 9999 });
    }
  },*/
