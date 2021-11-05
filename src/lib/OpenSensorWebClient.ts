import {
    InterpolatorType,
    OpenSensorWebData
} from '../types';
import got from 'got';
import {normalizeTimestampHTTPFormat} from './utils/normalizer';

export class OpenSensorWebClient {
    constructor(deviceId: string, sensorId: string, networkId?: string, interpolator?: InterpolatorType) {
        if (interpolator === undefined) interpolator = 'LINEAR';
        if (networkId === undefined) networkId = 'EEA-air';

        this.apiUrl = 'https://api.opensensorweb.de/v0' +
            '/networks/' + networkId +
            '/devices/' + deviceId +
            '/sensors/' + sensorId +
            '/measurements/raw?interpolator=' + interpolator
    }

    private readonly apiUrl: string;

    async callApi(startDatetime: string, endDatetime: string): Promise<OpenSensorWebData[]> {
        const full_url = this.apiUrl +
            '&start=' + normalizeTimestampHTTPFormat(startDatetime) +
            '&end=' + normalizeTimestampHTTPFormat(endDatetime);

        try {
            return <OpenSensorWebData[]><unknown>JSON.parse((await got(full_url)).body)
        } catch (error: unknown) {
            return []
        }
    }

    async fetchData(deltaHours?: number): Promise<OpenSensorWebData[]> {
        if (deltaHours === undefined) deltaHours = 24;
        const now = new Date();
        const deltaHoursAgo = new Date(now.getTime() - deltaHours * 3600 * 1000);

        return this.callApi(deltaHoursAgo.toISOString(), now.toISOString());
    }
}
