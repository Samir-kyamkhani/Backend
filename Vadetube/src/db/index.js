import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const DB_CONNECTION = async () => {
    try {
        const connectionInstence = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MONGODB CONECTED || DB HOST: ${connectionInstence.connection.host}`);
    } catch (error) {
        console.log("DB CONNECTION FAILED: ",error);
        process.exit(1)
    }
}

export default DB_CONNECTION