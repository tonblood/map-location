export interface MapModel {
    features : Feature[]
    numberMatched: number
    numberReturned: number
}

export interface Feature {
    id: string
    geometry: {
        coordinates: number[]
    }
}