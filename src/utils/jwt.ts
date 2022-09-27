import * as fs from 'fs'
import { verify, VerifyOptions } from 'jsonwebtoken'
import * as path from 'path'

interface TokenPayload {
    exp: number
    role: string
    name: string
    userId: number
}

/**
 * checks if JWT token is valid
 *
 * @param token the expected token payload
 */
export function validateToken(token: string): Promise<TokenPayload> {
    const publicKey = fs.readFileSync(
        path.join(__dirname, './../../public.key')
    )

    const verifyOptions: VerifyOptions = {
        algorithms: ['RS256'],
    }

    return new Promise((resolve, reject) => {
        verify(
            token,
            publicKey,
            verifyOptions,
            (error, decoded: TokenPayload) => {
                if (error) return reject(error)

                resolve(decoded)
            }
        )
    })
}
