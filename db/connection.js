import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config()

// Creación de la instancia de Sequelize
const db = new Sequelize(
    process.env.DB_NAME, // DB name
    process.env.DB_USERNAME, // User
    process.env.DB_PASSWORD, // Password
    {
  host: process.env.DB_HOSTNAME,
  dialect: process.env.DB_DIALECT,
  dialectModule: pg,
  logging: true
})

export default db

