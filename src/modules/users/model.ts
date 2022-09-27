import dbInstance from '../../utils/mysql.connector'

export const getAllUsers = async () => {
    return await dbInstance('users').select('*')
}

export const getUser = async (id: string | number) => {
    return await dbInstance('users').select('*').where('id', id)
}
