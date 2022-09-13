import { Router } from 'express'
import * as Auth from '../../middlewares/auth'
import * as Controller from './controller'

const router = Router()

router.route('/').get(Controller.getUsers)

router.route('/:id').get(Controller.getUserById)

router.route('/').post(Auth.authorize(['addUser']), Controller.addUser)

router
    .route('/:id')
    .patch(Auth.authorize(['updateUser']), Controller.updateUserById)

router
    .route('/:id')
    .delete(Auth.authorize(['deleteUser']), Controller.deleteUserById)

export default router
