import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import * as path from 'path'
import errorHandler from './middlewares/error-handler'
import logger from './middlewares/logger'
import router from './router'

dotenv.config()

const app = express()
const port = 3000

// serve static files
app.use(express.static(path.join(__dirname, '../public')))

// Response compression //
// https://www.npmjs.com/package/compression //
app.use(compression())

// HTTP Headers / Security //
// https://www.npmjs.com/package/helmet //
app.use(helmet())

// Parse incoming requests and append data to `req.body` //
// https://www.npmjs.com/package/body-parser //
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Enable CORS requests //
// https://www.npmjs.com/package/cors //
app.use(cors())

// Log events //
app.use(logger)

// Routes
app.use('/', router)

// Custom Error Handler
app.use(errorHandler)

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
