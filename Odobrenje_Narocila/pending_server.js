import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const PROTO_PATH = './proto/pending_order.proto';
//const packageDefinition = protoLoader.loadSync(PROTO_PATH);

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
      //set odobreno to 1 and delete after 2 minutes
      return callback(null, { result:true });
     }
      //callback(null, { success: true, message: "Order approved" });
    } catch (err) {
      console.error("CAUGHT ERROR: "+err);
      callback(null, { success: false, amount: 9999 });
    }
  },

  DeleteTimer: async (call, callback) => {
    console.log("CALLING DELETE TIMER")
    const db = await mysql.createConnection(dbConfig);
    const { user_id, meal_id } = call.request;
    setTimeout(async () =>  {
      console.log("30 seconds have passed.");
      const [rows] = await db.execute(
        "DELETE FROM uporabnik_has_jed  WHERE uporabnik_id =? AND jed_id = ? ",
         [user_id, meal_id]

      );

    }, 30000);

  },
};

const server = new grpc.Server();
server.addService(proto.PendingOrderService.service, PendingOrderService);
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log("PendingOrderService running on port 50051");
  server.start();
});
