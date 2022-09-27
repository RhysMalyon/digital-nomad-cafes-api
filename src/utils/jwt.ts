import * as fs from 'fs'
import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken'
import * as path from 'path'

/**
 * generates JWT used for local testing
 */
export function generateToken() {
    // information to be encoded in the JWT
    const payload = {
        name: 'Jason Webtoken',
        userId: 1,
        accessTypes: [
            'addPlace',
            'updatePlace',
            'deletePlace',
            'addUser',
            'updateUser',
            'deleteUser',
        ],
    }
    // read private key value
    const privateKey = {
        key: fs.readFileSync(path.join(__dirname, './../../private.key')),
        passphrase: process.env.PRIVATE_KEY_PASSPHRASE,
    }

    const signInOptions: SignOptions = {
        // RS256 uses a public/private key pair. The API provides the private key
        // to generate the JWT. The client gets a public key to validate the
        // signature
        algorithm: 'RS256',
        expiresIn: '1h',
    }

    // generate JWT
    return sign(payload, privateKey, signInOptions)
}

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
