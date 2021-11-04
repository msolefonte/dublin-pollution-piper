import got from 'got';
import {normalizeTimestampHTTPFormat} from "./utils/normalizer";
import {
    InterpolatorType
} from '../types';

export class OpenSensorWebClient {
    private readonly apiUrl: string;
    private readonly sensorId: string;

    constructor(deviceId: string, sensorId: string, networkId?: string, interpolator?: InterpolatorType) {
        if (interpolator === undefined) interpolator = 'LINEAR';
        if (networkId === undefined) networkId = 'EEA-air';

        this.sensorId = sensorId;
        this.apiUrl = "https://api.opensensorweb.de/v0" +
            '/networks/' + networkId +
            '/devices/' + deviceId +
            '/sensors/' + sensorId +
            '/measurements/raw?interpolator=' + interpolator
    }

    getSensorId(): string {
        return this.sensorId;
    }

    async call_api(startDatetime: string, endDatetime: string): Promise<any> {
        const full_url = this.apiUrl +
            '&start=' + normalizeTimestampHTTPFormat(startDatetime) +
            '&end=' + normalizeTimestampHTTPFormat(endDatetime);

        return (await got(full_url)).body
    }

    async fetch_data(deltaHours?: number): Promise<any> {
        if (deltaHours === undefined) deltaHours = 24;
        const now = new Date();
        const deltaHoursAgo = new Date(now.getTime() - deltaHours * 3600 * 1000);

        return this.call_api(deltaHoursAgo.toISOString(), now.toISOString());
    }
}
