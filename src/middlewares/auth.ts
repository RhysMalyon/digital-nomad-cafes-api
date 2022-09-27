/* eslint-disable @typescript-eslint/ban-ts-comment */
// @types/jsonwebtoken incorrectly handles the key property of jwt functions
// KeyObject is a valid input but incorrectly raises a type error

import * as crypto from 'crypto'
import { createPrivateKey, createPublicKey } from 'crypto'
import { NextFunction, Request, Response } from 'express'
import * as fs from 'fs'
import * as jwt from 'jsonwebtoken'
import * as path from 'path'
import { User } from '../modules/users/types'
import { validateToken } from '../utils/jwt'

const privateKey = createPrivateKey({
    key: fs.readFileSync(path.join(__dirname, './../../private.key')),
    passphrase: process.env.PRIVATE_KEY_PASSPHRASE,
})

const publicKey = createPublicKey(privateKey)

/**
 * middleware to check whether user has access to a specific endpoint
 *
 * @param allowedRoles list of allowed access types of a specific endpoint
 */
export const authorize =
    (allowedRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let jwt = req.headers.authorization

            // Verify request has token
            if (!jwt) {
                return res.status(401).json({ message: 'Invalid token.' })
            }

            // Remove Bearer if using Bearer Authorization mechanism
            if (jwt.toLowerCase().startsWith('bearer')) {
                jwt = jwt.slice('bearer'.length).trim()
            }

            // Verify token hasn't expired
            const decodedToken = await validateToken(jwt)

            const hasAccessToEndpoint = allowedRoles.some((role) =>
                decodedToken.role === role
            )

            if (!hasAccessToEndpoint) {
                return res.status(401).json({
                    message: 'Insufficient privileges.',
                })
            }

            next()
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                res.status(401).json({ message: 'Expired token.' })
                return
            }

            res.status(500).json({ message: 'Failed to authenticate user.' })
        }
    }

export const generateAccessToken = (user: User['username'], role: string) => {
    const signOptions: jwt.SignOptions = {
        algorithm: 'RS256',
        expiresIn: '15m',
    }

    // @ts-ignore
    return jwt.sign({ user: user, role: role }, privateKey, signOptions)
}

export const generateRefreshToken = (user: User['username'], role: string) => {
    const tokenId = crypto.randomBytes(40).toString('hex')

    const signOptions: jwt.SignOptions = {
        algorithm: 'RS256',
        expiresIn: '20m',
        jwtid: tokenId,
    }

    // @ts-ignore
    return jwt.sign({ user: user, role: role }, privateKey, signOptions)
}

export const decodeToken = (token: string) => {
    try {
        // @ts-ignore
        const decoded = jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
        })
        return decoded
    } catch (err) {
        console.log(err)
    }
}
