// require('dotenv').config({path: "./env"})
import dotenv from "dotenv"

import DB_CONNECTION from "./db/index.js"

dotenv.config({
    path: "./env"
})

DB_CONNECTION()



















/* const app = express()

//Frist approch

;( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("server: ",error);
            throw error
        })
        app.listen(process.env.PORT, () => {
            console.log(`Server at: ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED: ", error);
        process.exit(1)
    }
})()

*/