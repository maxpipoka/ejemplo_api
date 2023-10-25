import Usuario from "../models/usuario.js"
import jwt from 'jsonwebtoken'

async function authentication(req, res) {

    //obtencion datos de logueo
    const usuarioABuscar = req.body.usuario
    const passwordRecibido = req.body.password

    let usuarioEncontrado = ''

    // Comprobacion del usuario
    try {
        usuarioEncontrado = await Usuario.findAll({where:{usuario:usuarioABuscar}})

        if (usuarioEncontrado == ''){ return res.status(400).json({message: 'Usuario no encontrado'}) }
    } catch (error) {
        return res.status(400).json({message: 'Usuario no encontrado'})
    }

    // Comprobacion del password
    if (usuarioEncontrado[0].password !== passwordRecibido){
        return res.status(400).json({message: 'Password incorrecto'})
    }

    // Generacion del token
    const sub = usuarioEncontrado[0].id
    const usuario = usuarioEncontrado[0].usuario
    const nivel = usuarioEncontrado[0].nivel

    // firma y construccion del token
    const token = jwt.sign({
        sub,
        usuario,
        nivel,
        exp: Date.now() + (60 * 1000)
    }, process.env.SECRET_KEY)

    res.status(200).json({ accessToken: token })
}

export default authentication