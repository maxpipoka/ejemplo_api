import express from 'express'

import db from './db/connection.js'

import makeBody from './middlewares/makeBody.js'
import authentication from './middlewares/authentication.js'

import productoRouter from './routes/productoRouter.js'
import usuarioRouter from './routes/usuarioRouter.js'

const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li>    <li>POST: /productos/</li>    <li>DELETE: /productos/id</li>    <li>PUT: /productos/id</li>    <li>PATCH: /productos/id</li>    <li>GET: /usuarios/</li>    <li>GET: /usuarios/id</li>    <li>POST: /usuarios/</li>    <li>DELETE: /usuarios/id</li>    <li>PUT: /usuarios/id</li>    <li>PATCH: /usuarios/id</li></ul>'

const app = express()

// const exposedPort = process.env.PORT || 3000
const exposedPort = 1234


app.get('/', (req, res) => {
    res.status(200).send(html)
})

app.use(makeBody)

//Enrutamiento
app.use('/', productoRouter)
app.use('/', usuarioRouter)

// Endpoint para la validacion de los datos de logueo
app.post('/auth', authentication)

app.use((req, res) => {
    res.status(404).send('<h1>404</h1>')
})

try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
  
app.listen( exposedPort, () => {
    console.log('Servidor escuchando en http://localhost:' + exposedPort)
})




