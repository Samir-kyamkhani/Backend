import express from "express";
import 'dotenv/config'

const app = express()

const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("server is ready")
})

app.listen(port, () => {
    console.log(`App listening on PORT http://localhost:${port} `);
})