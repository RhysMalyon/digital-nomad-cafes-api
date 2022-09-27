import { Router } from 'express'
import * as Auth from '../../middlewares/auth'
import * as Controller from './controller'

const router = Router()

// GET all users
router.route('/').get(Controller.getUsers)

// GET user by ID
router.route('/:id').get(Controller.getUserById)

// POST new user
router.route('/').post(Controller.addUser)

// UPDATE user
router
    .route('/:id')
    .patch(Auth.authorize(['user, admin']), Controller.updateUserById)

//
router
    .route('/:id')
    .delete(Auth.authorize(['admin']), Controller.deleteUserById)

export default router
