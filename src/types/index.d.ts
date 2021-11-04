export type InterpolatorType = "LINEAR";

export interface FlowData {
    frc: string
    currentSpeed: number,
    freeFlowSpeed: number,
    currentTravelTime: number,
    freeFlowTravelTime: number,
    confidence: number,
    roadClosure: boolean,
    timestamp: string
}

export interface MySQLConfig {
    auth: {
        username: string,
        password: string
    },
    host: string,
    port: number,
    database: string
}

export interface OpenSensorWebResult {
    begin: string,
    v: number
}

export interface TomTomTrafficResult {
    flowSegmentData: {
        frc: string
        currentSpeed: number,
        freeFlowSpeed: number,
        currentTravelTime: number,
        freeFlowTravelTime: number,
        confidence: number,
        roadClosure: boolean,
        coordinates: {
            coordinate: {
                latitude: number,
                longitude: number
            }[]
        }
    }
}
