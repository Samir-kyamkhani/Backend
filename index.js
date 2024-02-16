require('dotenv').config()
const express = require('express')

const app = express()
const port = 4000

const githubData = {
    "login": "Samir-kyamkhani",
    "id": 134730963,
    "node_id": "U_kgDOCAfU0w",
    "avatar_url": "https://avatars.githubusercontent.com/u/134730963?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/Samir-kyamkhani",
    "html_url": "https://github.com/Samir-kyamkhani",
    "followers_url": "https://api.github.com/users/Samir-kyamkhani/followers",
    "following_url": "https://api.github.com/users/Samir-kyamkhani/following{/other_user}",
    "gists_url": "https://api.github.com/users/Samir-kyamkhani/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/Samir-kyamkhani/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/Samir-kyamkhani/subscriptions",
    "organizations_url": "https://api.github.com/users/Samir-kyamkhani/orgs",
    "repos_url": "https://api.github.com/users/Samir-kyamkhani/repos",
    "events_url": "https://api.github.com/users/Samir-kyamkhani/events{/privacy}",
    "received_events_url": "https://api.github.com/users/Samir-kyamkhani/received_events",
    "type": "User",
    "site_admin": false,
    "name": "Samir Kyamkhani",
    "company": null,
    "blog": "",
    "location": "Sikar, Rajasthan ",
    "email": null,
    "hireable": null,
    "bio": "B.C.A, First-Year Student | Tech Enthusiast. Passionate about coding, software development, and emerging technologies ",
    "twitter_username": "Samir_kyamkhani",
    "public_repos": 17,
    "public_gists": 0,
    "followers": 1,
    "following": 1,
    "created_at": "2023-05-26T17:42:19Z",
    "updated_at": "2023-10-24T16:37:56Z"
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/day', (req, res) => {
    res.send('01 day 1st')
})

app.get('/users/Samir-Kyamkhani', (req, res) => {
    res.json(githubData)
})


app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${port}`)
})