export type InterpolatorType = "LINEAR";

export interface FlowData {
    frc: string
    currentSpeed: number,
    freeFlowSpeed: number,
    currentTravelTime: number,
    freeFlowTravelTime: number,
    confidence: number,
    roadClosure:number,
    timestamp: string
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
        roadClosure:number,
        coordinates: {
            coordinate: {
                latitude: number,
                longitude: number
            }[]
        }
    }
}
