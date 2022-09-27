import bcrypt from 'bcrypt'
import { JwtPayload } from 'jsonwebtoken'
import {
    decodeToken,
    generateAccessToken,
    generateRefreshToken,
} from '../../middlewares/auth'
import dbInstance from '../../utils/mysql.connector'
import { User } from '../users/types'

interface AuthResponse {
    status: number
    message: string
    access_token?: string
    expires_in?: number
    refresh_token?: string
    expiry_timestamp?: string
}

const response: Partial<AuthResponse> = {}

const fetchUser = async (username: string) => {
    return await dbInstance('users').select('*').where('username', username)
}

export const authenticateUser = async (username: string, password: string) => {
    const response: AuthResponse = {
        status: 0,
        message: ''
    }

    const userSearch: User[] = await fetchUser(username)

    if (userSearch.length == 0) {
        console.log('User not found.')

        response.status = 404
        response.message = 'User not found.'
    } else {
        const hashedPassword = userSearch[0].password

        if (await bcrypt.compare(password, hashedPassword)) {
            console.log('Login successful!')
            console.log('Generating accessToken.')

            const accessToken = generateAccessToken(
                userSearch[0].username,
                userSearch[0].role
            )
            const refreshToken = generateRefreshToken(
                userSearch[0].username,
                userSearch[0].role
            )

            await insertRefreshToken(refreshToken)

            response.access_token = accessToken
            response.expires_in = 900
            response.refresh_token = refreshToken
            response.expiry_timestamp = new Date((response.expires_in + Math.floor(Date.now() / 1000)) * 1000).toLocaleString()
        } else {
            console.log('Username or password does not match.')

            response.status = 401
            response.message = 'Username or password does not match.'
        }
    }

    return response
}

interface StoredToken {
    refresh_token: string
    expiry_timestamp: string
}

export const validateRefreshToken = async (refreshToken: string) => {
    let isValid = false

    const jwtid = decodeToken(refreshToken) as JwtPayload

    const token: StoredToken[] = await dbInstance('refresh_tokens')
        .select('*')
        .where('refresh_token', jwtid.jti)

    if (token.length !== 0) {
        const currentTime = new Date()
        const expiryTime = new Date(token[0].expiry_timestamp)
        isValid = currentTime < expiryTime
    }

    return isValid
}

const insertRefreshToken = async (refreshToken: string) => {
    // Add 20 minute expiry_timestamp
    const timestamp = new Date()
    timestamp.setMinutes(timestamp.getMinutes() + 20)

    const jwtid = decodeToken(refreshToken) as JwtPayload

    await dbInstance('refresh_tokens').insert({
        refresh_token: jwtid.jti,
        expiry_timestamp: timestamp,
    })
}

export const updateTokens = async (refreshToken: string, username: string) => {
    const isValidToken = await validateRefreshToken(refreshToken)

    if (!isValidToken) {
        response.status = 400
        response.message = 'Invalid refresh token.'
    } else {
        const userSearch: User[] = await fetchUser(username)
        await dbInstance('refresh_tokens')
            .where('refresh_token', refreshToken)
            .del()

        const newAccessToken = generateAccessToken(
            userSearch[0].username,
            userSearch[0].role
        )
        const newRefreshToken = generateRefreshToken(
            userSearch[0].username,
            userSearch[0].role
        )

        await insertRefreshToken(newRefreshToken)

        response.access_token = newAccessToken
        response.expires_in = 900
        response.refresh_token = newRefreshToken
        response.expiry_timestamp = new Date((response.expires_in + Math.floor(Date.now() / 1000)) * 1000).toLocaleString()

        return response
    }
}
