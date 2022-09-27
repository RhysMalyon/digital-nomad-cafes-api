import { Router } from 'express'
import * as Auth from '../../middlewares/auth'
import * as Controller from './controller'

const router = Router()

router.route('/').get(Controller.getPlaces)

router.route('/:id').get(Controller.getPlaceById)

router.route('/').post(Auth.authorize(['admin']), Controller.addPlace)

router
    .route('/:id')
    .patch(Auth.authorize(['admin']), Controller.updatePlaceById)

router
    .route('/:id')
    .delete(Auth.authorize(['admin']), Controller.deletePlaceById)

export default router
