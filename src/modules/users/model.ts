import dbInstance from '../../utils/mysql.connector'

export const getAllUsers = async () => {
    return await dbInstance('users').select('*')
}

export const getUser = async (id: string | number) => {
    return await dbInstance('users').select('*').where('id', id)
}

export const getUserFavorites = async (id: string | number) => {
    return await dbInstance('favorites')
        .select(dbInstance.ref('favorites.id').as('favorite_id'), 'places.*')
        .where('user_id', id)
        .innerJoin('places', 'favorites.place_id', 'places.id')
}

export const getFavorite = async (id: string | number) => {
    return await dbInstance('favorites').select().where('id', id)
}
