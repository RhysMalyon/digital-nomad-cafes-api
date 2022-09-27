import { Request } from 'express'

export interface User {
    id: number
    username: string
    password: string
    role: string
}

export interface GetUserReq extends Request {
    id: User['id']
}

export interface AddUserReq extends Request {}

export interface UpdateUserReq extends Request {
    id: User['id']
}

export interface DeleteUserReq extends Request {
    id: User['id']
}
