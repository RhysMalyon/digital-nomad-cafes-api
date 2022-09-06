import knex from 'knex'
import config from '../config/index'

const dbInstance = knex(config.knex)

export default dbInstance
