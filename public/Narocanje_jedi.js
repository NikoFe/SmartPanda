const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mysql = require('mysql2/promise');
require('dotenv').config();
const PROTO_PATH = __dirname + '/proto/data.proto';
//const PORT = '0.0.0.0:50051'
const PORT = '0.0.0.0:3002'
//const packageDef = protoLoader.loadSync(PROTO_PATH, {});
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const dbConfig = {
  host:  `${process.env.DB_HOST}`,
  user:  `${process.env.DB_USER}`,
  password:  `${process.env.DB_PASSWORD}` ,
  database:  `${process.env.DB_NAME}` ,
};

const grpcObject = grpc.loadPackageDefinition(packageDef);
const dataPackage = grpcObject.data;

async function main() {
  const db = await mysql.createConnection(dbConfig);

  const server = new grpc.Server();

  server.addService(dataPackage.DataService.service, {
    GetAllRows: async (_, callback) => {
      try {
        const [rows] = await db.execute('SELECT id, name, email FROM users');
        callback(null, { rows });
      } catch (err) {
        callback(err);
      }
    },
  CreateUser: async (call, callback) => {
    const { id, name, email } = call.request;
    try {
      await db.execute('INSERT INTO users (id, name, email) VALUES (?, ?, ?)', [id, name, email]);
      callback(null, { message: 'User created successfully' });
    } catch (err) {
      callback(err);
    }
  },
  updateZaloga: async (call, callback) => {
    const { id,amount } = call.request;
    try {
    //await db.execute('INSERT INTO users (id, name, email) VALUES (?, ?, ?)', [id, name, email]);
      await db.execute(`UPDATE jed SET zaloga = ${amount} WHERE id = ${id};`);
      callback(null, { message: 'Jed updated successfully' });
    } catch (err) {
      callback(err);
    }
  },
  getAllMeals: async (call, callback) => {
    try {
      const [rows] = await db.execute("SELECT * FROM jed");
     // callback(null, { rows });
        callback(null, { meals: rows });
   //   callback(null, { message: 'Jed updated successfully' });
    } catch (err) {
      callback(err);
    }
  },
 
  getIdByUsername: async (call, callback) => {
  const { username,password } = call.request;
    console.log("USERNAME: ", username, " PASSWORD: ", password)
    try {
      const [rows] = await db.execute(  "SELECT id FROM uporabnik WHERE ime  =  ? AND geslo= ?",
        [username,password]);
     // callback(null, { rows });
        callback(null, { meals: rows });
   //   callback(null, { message: 'Jed updated successfully' });
    } catch (err) {
      callback(err);
    }
  },

  createInBetween: async (call, callback) => {
  const { /*id,*/user_id, meal_id,amount } = call.request;
   // console.log("USERNAME: ", username, " PASSWORD: ", password)
  console.log("SERVER.js")
  console.log("Raw request:", call.request);
 // console.log("id: ", id)
  console.log("user_id: ", user_id)
  console.log("meal_id: ", meal_id)
  console.log("amount: ", amount)
    try {
       //(6556757, 1,1,10);

       const [rows2] = await db.execute( "SELECT * FROM uporabnik_has_jed WHERE  uporabnik_id = ? and  jed_id = ? ",
         [user_id, meal_id]);
      
       console.log("ROWS2: ", rows2)
       console.log("ROWS2 length: ", rows2.length)
      // console.log("ROWS2.json: ", json.stringify(rows2))

       if(rows2.length>0){
        console.log("DELETING !!!!!!!!!!!!!!!!!!!")
         const [rows3] = await db.execute( "DELETE FROM  uporabnik_has_jed WHERE uporabnik_id= ? and jed_id =?",
         [user_id, meal_id]);
       }

        const [rows] = await db.execute( "INSERT INTO uporabnik_has_jed VALUES (?,?,?,?)",
         [user_id, meal_id,amount,0]);

       callback(null,null);
    } catch (err) {
     callback(err);
    }
  }
   });


 server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), () => {
   server.start();
   console.log('gRPC server running on port '+PORT  );
 });
  
  /*
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('gRPC server running at http://0.0.0.0:50051');
   // server.start();
  });*/
}

main();
