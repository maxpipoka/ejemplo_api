import { DataTypes } from 'sequelize'
import db from '../db/connection.js'

const Usuario = db.define('Usuario', {
    dni: {
        type: DataTypes.STRING 
    },
    nombres: {
        type: DataTypes.STRING 
    },
    apellidos: {
        type: DataTypes.STRING 
    },
    email: {
        type: DataTypes.STRING 
    },
    telefono: {
        type: DataTypes.STRING 
    },
    usuario: {
        type: DataTypes.STRING 
    },
    password: {
        type: DataTypes.STRING 
    },
    nivel: {
        type: DataTypes.INTEGER
    },
},
{timestamps:false,
tableName: 'usuarios'}
)

export default Usuario

