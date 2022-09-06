import { Request, RequestHandler, Response } from 'express'
import dbInstance from '../../utils/mysql.connector'
import {
    AddPlaceReq,
    DeletePlaceReq,
    GetPlaceReq,
    Place,
    UpdatePlaceReq
} from './model'

// GET /places
export const getPlaces: RequestHandler = async (
    req: Request,
    res: Response
) => {
    const places = await dbInstance('places').select('*')
    res.send(places)
}

// GET /places/:id
export const getPlaceById: RequestHandler = async (
    req: GetPlaceReq,
    res: Response
) => {
    const place = await dbInstance('places')
        .select('*')
        .where('id', req.params.id)

    res.send(place)
}

// POST /places/:id
export const addPlace: RequestHandler = async (
    req: AddPlaceReq,
    res: Response
) => {
    const lastId = await dbInstance('places')
        .select('*')
        .whereRaw('id = (SELECT MAX(id) FROM places)')
    const id = lastId[0].id + 1
    const newPlace: Place = {
        id,
        ...req.body,
    }

    newPlace.images = JSON.stringify(newPlace.images)
    newPlace.businessHours = JSON.stringify(newPlace.businessHours)

    await dbInstance('places').insert(newPlace)

    res.send(newPlace)
}

// PATCH /places/:id
export const updatePlaceById: RequestHandler = async (
    req: UpdatePlaceReq,
    res: Response
) => {
    const updatedPlace: Place = {
        ...req.body,
    }

    updatedPlace.images = JSON.stringify(updatedPlace.images)
    updatedPlace.businessHours = JSON.stringify(updatedPlace.businessHours)

    await dbInstance('places').where('id', req.params.id).update(updatedPlace)

    res.send({ success: `${req.body.name} successfully updated.` })
}

// DELETE /places/:id
export const deletePlaceById: RequestHandler = async (
    req: DeletePlaceReq,
    res: Response
) => {
    await dbInstance('places').where('id', req.params.id).del()

    res.send({ success: `${req.body.name} successfully deleted.` })
}
