import { Router } from 'express'

import PlacesRoutes from './modules/places/routes'
import UsersRoutes from './modules/users/routes'
import AuthRoutes from './modules/auth/routes'

const router = Router()

router.use('/auth', AuthRoutes)
router.use('/users', UsersRoutes)
router.use('/places', PlacesRoutes)

export default router
