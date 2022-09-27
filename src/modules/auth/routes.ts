import { Router } from 'express'
import * as Controller from './controller'

const router = Router()

router.route('/login').post(Controller.handleLogin)
router.route('/refresh-token').post(Controller.handleRefreshToken)

export default router
