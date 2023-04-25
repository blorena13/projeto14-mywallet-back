import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);

try{
   await mongoClient.connect();
   console.log("Mongodb conectado!");

} catch(err){
    console.log(err.message);
}
export const db = mongoClient.db();

// refatorado