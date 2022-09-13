import bcrypt from 'bcrypt'
import { Request, RequestHandler, Response } from 'express'
import dbInstance from '../../utils/mysql.connector'
import { getAllUsers, getUser } from './model'
import {
	AddUserReq,
	DeleteUserReq,
	GetUserReq,
	UpdateUserReq,
	User
} from './types'

// GET /users
export const getUsers: RequestHandler = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers()
        res.send(users)
        return users
    } catch (error) {
        console.error(error)
    }
}

// GET /users/:id
export const getUserById: RequestHandler = async (
    req: GetUserReq,
    res: Response
) => {
    try {
        const user = await getUser(req.params.id)

        res.send(user)
        return user
    } catch (error) {
        console.error(error)
    }
}

// POST /users
export const addUser: RequestHandler = async (
    req: AddUserReq,
    res: Response
) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const user: Partial<User> = {
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role,
        }

        const userSearch: User[] = await dbInstance('users')
            .select('*')
            .where('username', user.username)

        if (userSearch.length > 0) {
            res.status(409).send('Username already exists.')
        } else {
            // 1. Insert user into users table
            const query = dbInstance('users').insert(user)
            // 2. Extract assigned id via knex
            const [id] = await query
            // 3. Create full user object including id
            const returnedUser = await getUser(id)

            // Return full user object as response
            res.send(returnedUser)
            return returnedUser
        }
    } catch (error) {
        console.error(error)
    }
}

// PATCH /users/:id
export const updateUserById: RequestHandler = async (
    req: UpdateUserReq,
    res: Response
) => {
    const updatedUser: User = {
        ...req.body,
    }

    await dbInstance('users').where('id', req.params.id).update(updatedUser)

    res.send({ success: `User ${req.params.id} successfully updated.` })
}

// DELETE /users/:id
export const deleteUserById: RequestHandler = async (
    req: DeleteUserReq,
    res: Response
) => {
    await dbInstance('users').where('id', req.params.id).del()

    res.send({ success: `User ${req.params.id} successfully deleted.` })
}
