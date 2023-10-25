import express from 'express'

const usuarioRouter = express.Router()

import { getAllUsers } from '../controllers/usuarioController.js'

usuarioRouter.get('/usuarios', getAllUsers)

export default usuarioRouter