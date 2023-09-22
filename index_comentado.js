/* Las líneas 7, 10 y 11 son para importar el archivo json con require.
   Debido a que se esta usando ES Modules como sistema de módulos.
   El require lo hace mas facil directamente en el caso de usar
   CommonJS. Es solo para este ejemplo, en un escenario real
   los datos se estarían obteniendo desde una base de datos */

import { createRequire } from 'node:module'
import express from 'express'

const require = createRequire(import.meta.url)
const datos = require('./datos.json')

// Variable para devolver una especie de índice de la API al usuario al acceder a la url base
const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li><li>POST: /productos/</li><li>DELETE: /productos/id</li><li>PUT: /productos/id</li><li>PATCH: /productos/id</li><li>GET: /usuarios/</li><li>GET: /usuarios/id</li><li>POST: /usuarios/</li><li>DELETE: /usuarios/id</li><li>PUT: /usuarios/id</li><li>PATCH: /usuarios/id</li></ul>'

// Se inicializa una applicacion de Express
const app = express()

/* Puerto por el que se expondrá el servidor web con la API
   Por lo general los servicios donde se despliegan las aplicaciones
   de este tipo, proveen un puerto automáticamente, o se deberá
   capturar desde variables de entorno. 
   Para saber mas: https://desarrolloweb.com/articulos/variables-entorno-nodejs.html */
const exposedPort = 1234

/* Se define el manejo de la primer request de tipo GET.
   Siendo la que se recibiría en la url base, el home.
   Nótese el statusCode que devuelve y el contenido que envía.
   Express tiene la posibilidad de encadenar las configuraciones
   de la response que se quieren enviar. */
app.get('/', (req, res) => {
    res.status(200).send(html)
})

/* Manejo de una request GET para devolver contenido dinámico,
   aquí ya debería ir una consulta a una base de datos, en el
   ejemplo los datos se obtienen de la variable con los datos
   del json dentro.
   La estructura try/catch ya fue vista anteriormente, básicamente
   es una INTENTAR y SI DA ERROR. En el try se define lo que se quiere
   intentar hacer, y en el catch se define que hace nuestro código
   en caso de no lograr hacerse lo que se intento en el try.
   Es importante manejar los errores porque esto evita que nuestro
   programa se caiga. Al manejar el error el programa sigue funcionando. */
app.get('/productos/', (req, res) =>{
    try {
        let allProducts = datos.productos

        res.status(200).json(allProducts)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

/* Manejo de una request GET con parámetro, es para devolver un producto en particular.
   Podría hacerse el manejo de cada request GET
   para cada url en particular, productos/1, productos/2, productos/3,
   posible es, pero es totalmente impráctico. La cantidad de productos
   puede crecer sin límite y gestionar eso con código concreto no sería viable.
   Por eso se hace mediante la gestión de los parámetros, como se observa se define
   que lo que llegue despues de 'productos/' va a ser un parámetro con el ':'.
   Dentro de la función se observa que se asigna el valor del parámetro a la variable
   productoId, capturandolo con la instrucción 'req.params', junto se designa el
   parámetro se quiere capturar, en este caso 'id'. Llega como string por lo que
   (en este caso) es necesario convertirlo a entero, dentro del JSON el 'id' de
   los productos es un dato de tipo entero, eso se hace con la función 'parseInt'.
   Una vez obtenido el 'id', se crea una variable para guardar el producto solicitado.
   Obtenerlo se hace mediante el método 'find' de arrays en JS. PRODUCTOS es un array
   dentro del JSON, la función flecha que se pasa como parámetro a 'find' podría
   leerse como, 'iterar sobre los productos y encontrar el producto donde el 
   id del producto iterado sea igual al valor de la variable productoId.
   
   Se comprueba el caso de que no se encuentre el producto buscado, recordar que
   hacer la devolucion de la response mediante SEND o JSON hace las veces de
   'salida' de la función. */
app.get('/productos/:id', (req, res) => {
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)

        if (!productoEncontrado) {
            res.status(204).json({ "message": "Producto no encontrado"})
        }
        res.status(200).json(productoEncontrado)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

/* Manejo de una request de tipo POST que solicita guardar
   datos en el servidor. Se crea una variable temporal donde ir
   guardando el 'body' de la request que es donde estará el contenido
   que se solicita se guarde en el servidor, los datos viajan en forma
   de buffer, es decir en cadenas de datos binarios, 1 y 0. Además,
   viajan en pedazos, no de forma completa. Por esto es necesario capturar
   esos pedazos e ir construyendo el bloque completo que conforma el 'body'.
   Detectamos si se esta recibiendo información o ya se terminó el envío con
   el método 'on' del objeto request. Si tiene un parametro 'data' es porque
   se esta recibiendo, ese pedazo de información que se recibio se mete dentro
   de una variable llamada 'chunk' que se le suma a la variable bodyTemp
   convirtiendo los datos a string. Cuando se recibe el aviso de que la transferencia
   de datos terminó con el atributo 'end', se convierte todo el bodytemp a formato
   json, se guarda en una variable temporal y esa variable se le asigna al body
   de la request. Luego se usa el método push de los arrays de JS para meter ese
   objeto al array 'productos' de la variable 'datos'. En un caso real en vez
   de usar el push al array se haría la conexión a la DDBB y se guardaría ahí
   los datos.
    */
app.post('/productos', (req, res) => {
    try {
        let bodyTemp = ''

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString()
        })
    
        req.on('end', () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
            datos.productos.push(req.body)
        })
    
        res.status(201).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})


/* La request de tipo PATCH esta destinada a modificar parcialmente
   algún recurso en el servidor. El procedimiento de obtener el id
   del objeto que se desea modificar como la obtencion del objeto en sí
   ya esta descripto anteriormente. Se combina también el procedimiento
   para obtener el body de la request, que es donde vienen los datos
   que se desean modificar. Lo diferente esta cuando se recibe el aviso
   'end' en la req.on, ademas de parsearse a JSON y meterse en una variable
   los datos ya completos, se comprueba mediante condicionales la existencia
   de alguno de los atributos del objeto producto, en caso de la data tener ese atributo, 
   se le asigna los datos recibidos al atributo del objeto. Una vez finalizado se devuelve
   la respuesta, SIEMPRE SE DEBE DEVOLVER UNA RESPUESTA, avisando que se hizo la modificación.
   Se debería implementar tambíen un try/catch para manejar el posible error en la modificación */
app.patch('/productos/:id', (req, res) => {
    let idProductoAEditar = parseInt(req.params.id)
    let productoAActualizar = datos.productos.find((producto) => producto.id === idProductoAEditar)

    if (!productoAActualizar) {
        res.status(204).json({"message":"Producto no encontrado"})
    }

    let bodyTemp = ''

    req.on('data', (chunk) => {
        bodyTemp += chunk.toString()
    })

    req.on('end', () => {
        const data = JSON.parse(bodyTemp)
        req.body = data
        
        if(data.nombre){
            productoAActualizar.nombre = data.nombre
        }
        
        if (data.tipo){
            productoAActualizar.tipo = data.tipo
        }

        if (data.precio){
            productoAActualizar.precio = data.precio
        }

        res.status(200).send('Producto actualizado')
    })
})

/* Request de tipo DELETE. Hay que mencionar que en este ejemplo
   se hace el borrado del objeto mediante el método splice de los 
   arrays de JS. En un escenario real habría que usar la instrucción
   que elimine los datos en la ddbb, o cambie el valor de disponibilidad
   en caso de que se opte por un borrado lógico. */
app.delete('/productos/:id', (req, res) => {
    let idProductoABorrar = parseInt(req.params.id)
    let productoABorrar = datos.productos.find((producto) => producto.id === idProductoABorrar)

    if (!productoABorrar){
        res.status(204).json({"message":"Producto no encontrado"})
    }

    let indiceProductoABorrar = datos.productos.indexOf(productoABorrar)
    try {
         datos.productos.splice(indiceProductoABorrar, 1)
    res.status(200).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

/* Definición del manejo del error 404 cuando se intente
   acceder a un endpoint que no existe en la API. */
app.use((req, res) => {
    res.status(404).send('<h1>404</h1>')
})

/* Puesta en escucha del servidor, en el puerto especificado
   a la espera de las request por parte de los clientes. */
app.listen( exposedPort, () => {
    console.log('Servidor escuchando en http://localhost:' + exposedPort)
})




