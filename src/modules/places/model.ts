import { Request } from 'express'

export interface Place {
    id: number
    placeId: string
    name: string
    address: string
    latitude: number
    longitude: number
    hasWifi: boolean
    hasPower: boolean
    images: string
    businessHours: string
    rating: number
    website: string
    phoneNumber: string
    ratingsTotal: number
    businessStatus: string
}

export interface GetPlaceReq extends Request {
    id: Place['id']
}

export interface AddPlaceReq extends Request {}

export interface UpdatePlaceReq extends Request {
    id: Place['id']
}

export interface DeletePlaceReq extends Request {
    id: Place['id']
}
