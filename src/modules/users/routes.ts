import { Router } from 'express'
import * as Auth from '../../middlewares/auth'
import * as Controller from './controller'

const router = Router()

// GET all users
router.route('/').get(Controller.getUsers)

// GET user by ID
router.route('/:id').get(Auth.authorize(['user', 'admin']), Controller.getUserById)

// POST new user
router.route('/').post(Controller.addUser)

// UPDATE user
router
    .route('/:id')
    .patch(Auth.authorize(['user', 'admin']), Controller.updateUserById)

// DELETE user
router
    .route('/:id')
    .delete(Auth.authorize(['admin']), Controller.deleteUserById)

// GET user favorites
router.route('/:id/favorites').get(Auth.authorize(['user', 'admin']), Controller.getFavorites)

// POST new favorite
router.route('/favorites').post(Auth.authorize(['user', 'admin']), Controller.addFavorite)

// DELETE favorite
router
    .route('/favorites/:id')
    .delete(Auth.authorize(['user', 'admin']), Controller.deleteFavoriteById)

export default router
