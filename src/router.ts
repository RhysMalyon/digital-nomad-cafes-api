import { Router } from 'express'

import PlacesRoutes from './modules/places/routes'
import UsersRoutes from './modules/users/routes'

const router = Router()

router.use('/places', PlacesRoutes)
router.use('/users', UsersRoutes)

export default router
