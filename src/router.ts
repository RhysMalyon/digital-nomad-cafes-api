import { Router } from 'express'

import PlacesRoutes from './modules/places/routes'

const router = Router()

router.use('/places', PlacesRoutes)

export default router
