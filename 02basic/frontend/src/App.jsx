import { useEffect, useState } from 'react'
import axios from "axios"
import './App.css'

function App() {
  const [jokes, setJokes] = useState([])

  useEffect(() => {
    axios.get('/api/jokes')
    .then((res) => {
      setJokes(res.data)
    })
    .catch((eror) => {
      console.log(eror);
    })
  })

  return (
    <>
      <h1>Full Stack Connect backend with frontend</h1>
      <p>Jokes: {jokes.length}</p>

      {jokes.map((joke) => (
        <div key={joke.id}>
          <h3>title: {joke.title}</h3>
          <p>content: {joke.content}</p>
        </div>
      ))}
    </>
  )
}

export default App
