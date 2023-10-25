import express from 'express'

import tokenAuthentication from '../middlewares/tokenAuthentication.js'

const productoRouter = express.Router()

import { getAllProducts, getOneProductById, saveProduct, editProduct, deleteProduct} from '../controllers/productoController.js'


productoRouter.get('/productos', getAllProducts)
productoRouter.get('/productos/:id', getOneProductById)
productoRouter.post('/productos', tokenAuthentication, saveProduct)
productoRouter.patch('/productos/:id', tokenAuthentication, editProduct)
productoRouter.delete('/productos/:id', tokenAuthentication, deleteProduct)

export default productoRouter