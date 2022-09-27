import { Request, RequestHandler, Response } from 'express'
import { authenticateUser, updateTokens, validateRefreshToken } from './model'

// POST /auth/login
export const handleLogin: RequestHandler = async (req: Request, res: Response) => {
    try {
        const response = await authenticateUser(req.body.username, req.body.password)

        if (response.access_token && response.refresh_token) {
            res.json({ accessToken: response.access_token, refreshToken: response.refresh_token })
        } else {
            res.status(response.status).send(response.message)
        }
    } catch (err) {
        console.error(err)
    }
}

// POST /auth/refresh-token
export const handleRefreshToken: RequestHandler = async (req: Request, res: Response) => {
    try {
        const isValidToken = await validateRefreshToken(req.body.refresh_token)

        if (!isValidToken) {
            res.status(400).send("Invalid refresh token.")
        } else {
            const response = await updateTokens(req.body.refresh_token, req.body.username)

            res.json({ accessToken: response.access_token, refreshToken: response.refresh_token })
        }
    } catch (err) {
        console.error(err)
    }
}
