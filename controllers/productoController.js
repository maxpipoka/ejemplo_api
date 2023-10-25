import Producto from "../models/producto.js"

export async function getAllProducts(req, res){
    try {
        let allProducts = await Producto.findAll()

        res.status(200).json(allProducts)

    } catch (error) {
        res.status(204).json({"message": error})
    }
}


export async function getOneProductById(req, res) {
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = await Producto.findByPk(productoId)

        res.status(200).json(productoEncontrado)

    } catch (error) {
        res.status(204).json({"message": error})
    }
}

export async function saveProduct(req, res){
    try {

        const productoAGuardar = new Producto(req.body)
        await productoAGuardar.save()
    
        res.status(201).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
}

export async function editProduct(req, res){
    let idProductoAEditar = parseInt(req.params.id)
    try {
        let productoAActualizar = await Producto.findByPk(idProductoAEditar)

        if (!productoAActualizar) {
            return res.status(204).json({"message":"Producto no encontrado"})}
        
            await productoAActualizar.update(req.body)

            res.status(200).send('Producto actualizado')
    
    } catch (error) {
        res.status(204).json({"message":"Producto no encontrado"})
    }
}

export async function deleteProduct(req, res){
    let idProductoABorrar = parseInt(req.params.id)
    try {
        let productoABorrar = await Producto.findByPk(idProductoABorrar);
        if (!productoABorrar){
            return res.status(204).json({"message":"Producto no encontrado"})
        }

        await productoABorrar.destroy()
        res.status(200).json({message: 'Producto borrado'})

    } catch (error) {
        res.status(204).json({message: error})
    }
}

