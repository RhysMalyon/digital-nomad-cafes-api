import { Knex } from 'knex'

export default {
    port: process.env.PORT || 3000,
    knex: <Knex.Config>{
        client: 'mysql2',
        connection: {
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASS || '',
            port: process.env.MYSQL_DB_PORT,
            database: process.env.MYSQL_DB || 'test',
            connectionLimit: process.env.MYSQL_DB_CONNECTION_LIMIT
                ? parseInt(process.env.MYSQL_DB_CONNECTION_LIMIT)
                : 4,
        },
    },
}
