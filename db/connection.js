import { Sequelize } from 'sequelize'

// Creación de la instancia de Sequelize
const db = new Sequelize(
    'fflksous', // DB name
    'fflksous', // User
    '9TQY0g9JemUsljwU_myeOMJT1DmMO0ZS', // Password
    {
  host: 'silly.db.elephantsql.com',
  dialect: 'postgres',
  logging: true
})

export default db

