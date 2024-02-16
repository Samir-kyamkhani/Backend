import express  from "express";

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("server is ready")
})

app.get('/api/jokes', (req, res) => {
    const jokes = [
        {
            id: 1,
            title: "this is a joke",
            content: "no 1 joke"
        },
        {
            id: 2,
            title: "this is a joke",
            content: "no 2 joke"
        },
        {
            id: 3,
            title: "this is a joke",
            content: "no 3 joke"
        },
    ]
    res.json(jokes)
})

app.listen(port, () => {
    console.log(`server at http://localhost:${port}`);
})