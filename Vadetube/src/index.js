// require('dotenv').config({path: "./env"})
import dotenv from "dotenv"

import DB_CONNECTION from "./db/index.js"

dotenv.config({
    path: "./env"
})

DB_CONNECTION()