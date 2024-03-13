// require('dotenv').config({path: "./env"})
import dotenv from "dotenv"
import DB_CONNECTION from "./db/index.js"
import { app } from "./app.js";

dotenv.config({
    path: "./env"
})

const port = process.env.PORT || 8000

DB_CONNECTION()
.then(() => {
    app.on("error", (error) => {
        console.log("Server litioning error: ",error);
        throw error
    }),
    app.listen(port, () => {
        console.log(`Server running at port: ${port}`);
    })
})
.catch((error) => {
    console.log("Conection error :: ",error);
    throw error
})



