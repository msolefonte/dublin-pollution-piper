import {
    FlowData,
    TomTomTrafficData
} from '../types';
import got from 'got';
import {normalizeTimestampDBFormat} from './utils/normalizer';

export class TomTomTrafficClient {
    constructor(apiKey: string, coordinates: string, zoomLevel: number, serviceVersion?: number, flowSegmentData?: string) {
        if (serviceVersion === undefined) serviceVersion = 4;
        if (flowSegmentData === undefined) flowSegmentData = 'relative0';

        this.apiUrl = 'https://api.tomtom.com/traffic' +
                       '/services/' + serviceVersion +
                       '/flowSegmentData/' + flowSegmentData +
                       '/' + zoomLevel +
                       '/json?key=' + apiKey +
                       '&point=' + coordinates
    }
private readonly apiUrl: string;

    

    async callApi(): Promise<TomTomTrafficData> {
        return <TomTomTrafficData><unknown> JSON.parse((await got(this.apiUrl)).body)
    }

    async fetchData(): Promise<FlowData> {
        const flow_segment_data = (await this.callApi()).flowSegmentData;

        return {
            'frc': flow_segment_data.frc,
            'currentSpeed': flow_segment_data['currentSpeed'],
            'freeFlowSpeed': flow_segment_data['freeFlowSpeed'],
            'currentTravelTime': flow_segment_data['currentTravelTime'],
            'freeFlowTravelTime': flow_segment_data['freeFlowTravelTime'],
            'confidence': flow_segment_data['confidence'],
            'roadClosure': flow_segment_data['roadClosure'],
            'timestamp': normalizeTimestampDBFormat(new Date().toISOString())
        }
    }
}
