import { Router } from 'express'
import * as Auth from '../../middlewares/auth'
import * as Controller from './controller'

const router = Router()

router.route('/').get(Controller.getPlaces)

router.route('/:id').get(Controller.getPlaceById)

router.route('/').post(Auth.authorize(['addPlace']), Controller.addPlace)

router
    .route('/:id')
    .patch(Auth.authorize(['updatePlace']), Controller.updatePlaceById)

router
    .route('/:id')
    .delete(Auth.authorize(['deletePlace']), Controller.deletePlaceById)

export default router
