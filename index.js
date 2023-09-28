import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const datos = require('./datos.json');

import express from 'express';

// HTML de bienvenida
const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li><li>POST: /productos/</li><li>DELETE: /productos/id</li><li>PUT: /productos/id</li><li>PATCH: /productos/id</li><li>GET: /usuarios/</li><li>GET: /usuarios/id</li><li>POST: /usuarios/</li><li>DELETE: /usuarios/id</li><li>PUT: /usuarios/id</li><li>PATCH: /usuarios/id</li><li>GET: /productos/id/precio</li><li>GET: /productos/id/nombre</li><li>GET: /usuarios/id/telefono</li><li>GET: /usuarios/id/nombre</li><li>GET: /productos/stock-total</li></ul>';

const app = express();

const exposedPort = 1234;

app.use(express.json());

// Endpoint para obtener información de la API
app.get('/', (req, res) => {
    res.status(200).send(html);
});

// Endpoints relacionados con productos
app.get('/productos/', (req, res) => {
    try {
        const allProducts = datos.productos;
        res.status(200).json(allProducts);
    } catch (error) {
        res.status(204).json({"message": error});
    }
});

app.get('/productos/:id', (req, res) => {
    try {
        const productoId = parseInt(req.params.id);
        const productoEncontrado = datos.productos.find((producto) => producto.id === productoId);
        res.status(200).json(productoEncontrado);
    } catch (error) {
        res.status(204).json({"message": error});
    }
});

app.post('/productos', (req, res) => {
    try {
        const nuevoProducto = req.body;
        nuevoProducto.id = datos.productos.length + 1;
        datos.productos.push(nuevoProducto);
        res.status(201).json({"message": "Producto creado exitosamente", "producto": nuevoProducto});
    } catch (error) {
        res.status(204).json({"message": "Error al crear el producto"});
    }
});

app.patch('/productos/:id', (req, res) => {
    try {
        const idProductoAEditar = parseInt(req.params.id);
        const productoAActualizar = datos.productos.find((producto) => producto.id === idProductoAEditar);

        if (!productoAActualizar) {
            res.status(204).json({"message": "Producto no encontrado"});
        }

        const data = req.body;

        if (data.nombre) {
            productoAActualizar.nombre = data.nombre;
        }

        if (data.tipo) {
            productoAActualizar.tipo = data.tipo;
        }

        if (data.precio) {
            productoAActualizar.precio = data.precio;
        }

        res.status(200).json({"message": "Producto actualizado exitosamente", "producto": productoAActualizar});
    } catch (error) {
        res.status(204).json({"message": "Error al actualizar el producto"});
    }
});

app.delete('/productos/:id', (req, res) => {
    try {
        const idProductoABorrar = parseInt(req.params.id);
        const productoABorrar = datos.productos.find((producto) => producto.id === idProductoABorrar);

        if (!productoABorrar) {
            res.status(204).json({"message": "Producto no encontrado"});
        }

        const indiceProductoABorrar = datos.productos.indexOf(productoABorrar);
        datos.productos.splice(indiceProductoABorrar, 1);
        res.status(200).json({"message": "Producto eliminado exitosamente"});
    } catch (error) {
        res.status(204).json({"message": "Error al eliminar el producto"});
    }
});

// Endpoints relacionados con usuarios
app.get('/usuarios/', (req, res) => {
    try {
        const allUsuarios = datos.usuarios;
        res.status(200).json(allUsuarios);
    } catch (error) {
        res.status(204).json({"message": error});
    }
});

app.get('/usuarios/:id', (req, res) => {
    try {
        const usuarioId = parseInt(req.params.id);
        const usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId);

        if (usuarioEncontrado) {
            res.status(200).json(usuarioEncontrado);
        } else {
            res.status(204).json({"message": "Usuario no encontrado"});
        }
    } catch (error) {
        res.status(204).json({"message": error});
    }
});

app.post('/usuarios', (req, res) => {
    try {
        const nuevoUsuario = req.body;
        nuevoUsuario.id = datos.usuarios.length + 1;
        datos.usuarios.push(nuevoUsuario);
        res.status(201).json({"message": "Usuario creado exitosamente", "usuario": nuevoUsuario});
    } catch (error) {
        res.status(204).json({"message": "Error al crear el usuario"});
    }
});

app.put('/usuarios/:id', (req, res) => {
    try {
        const usuarioId = parseInt(req.params.id);
        const usuarioAActualizar = datos.usuarios.find((usuario) => usuario.id === usuarioId);

        if (usuarioAActualizar) {
            const data = req.body;

            if (data.nombre) {
                usuarioAActualizar.nombre = data.nombre;
            }

            if (data.edad) {
                usuarioAActualizar.edad = data.edad;
            }

            if (data.email) {
                usuarioAActualizar.email = data.email;
            }

            if (data.telefono) {
                usuarioAActualizar.telefono = data.telefono;
            }

            res.status(200).json({"message": "Usuario actualizado exitosamente", "usuario": usuarioAActualizar});
        } else {
            res.status(204).json({"message": "Usuario no encontrado"});
        }
    } catch (error) {
        res.status(204).json({"message": "Error al actualizar el usuario"});
    }
});

app.delete('/usuarios/:id', (req, res) => {
    try {
        const usuarioId = parseInt(req.params.id);
        const usuarioABorrar = datos.usuarios.find((usuario) => usuario.id === usuarioId);

        if (usuarioABorrar) {
            const indiceUsuarioABorrar = datos.usuarios.indexOf(usuarioABorrar);
            datos.usuarios.splice(indiceUsuarioABorrar, 1);
            res.status(200).json({"message": "Usuario eliminado exitosamente"});
        } else {
            res.status(204).json({"message": "Usuario no encontrado"});
        }
    } catch (error) {
        res.status(204).json({"message": "Error al eliminar el usuario"});
    }
});

// Obtener precio de un producto por ID
app.get('/productos/:id/precio', (req, res) => {
    try {
        const productoId = parseInt(req.params.id);
        const productoEncontrado = datos.productos.find((producto) => producto.id === productoId);

        if (productoEncontrado) {
            const precio = productoEncontrado.precio;
            res.status(200).json({"precio": precio});
        } else {
            res.status(204).json({"message": "Producto no encontrado"});
        }
    } catch (error) {
        res.status(204).json({"message": error});
    }
});

// Obtener nombre de un producto por ID
app.get('/productos/:id/nombre', (req, res) => {
    try {
        const productoId = parseInt(req.params.id);
        const productoEncontrado = datos.productos.find((producto) => producto.id === productoId);

        if (productoEncontrado) {
            const nombre = productoEncontrado.nombre;
            res.status(200).json({"nombre": nombre});
        } else {
            res.status(204).json({"message": "Producto no encontrado"});
        }
    } catch (error) {
        res.status(204).json({"message": error});
    }
});

// Obtener teléfono de un usuario por ID
app.get('/usuarios/:id/telefono', (req, res) => {
    try {
        const usuarioId = parseInt(req.params.id);
        const usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId);

        if (usuarioEncontrado) {
            const telefono = usuarioEncontrado.telefono;
            res.status(200).json({"telefono": telefono});
        } else {
            res.status(204).json({"message": "Usuario no encontrado"});
        }
    } catch (error) {
        res.status(204).json({"message": error});
    }
});

// Obtener nombre de un usuario por ID
app.get('/usuarios/:id/nombre', (req, res) => {
    try {
        const usuarioId = parseInt(req.params.id);
        const usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId);

        if (usuarioEncontrado) {
            const nombre = usuarioEncontrado.nombre;
            res.status(200).json({"nombre": nombre});
        } else {
            res.status(204).json({"message": "Usuario no encontrado"});
        }
    } catch (error) {
        res.status(204).json({"message": error});
    }
});

// Obtener el total del stock actual de productos
app.get('/productos/stock-total', (req, res) => {
    try {
        const totalStock = datos.productos.reduce((accumulator, producto) => accumulator + producto.stock, 0);
        res.status(200).json({"total_stock": totalStock});
    } catch (error) {
        res.status(204).json({"message": error});
    }
});

app.listen(exposedPort, () => {
    console.log('Servidor escuchando en http://localhost1234:' + exposedPort);
});


