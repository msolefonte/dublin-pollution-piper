import got from 'got';
import {normalizeTimestampHTTPFormat} from "./utils/normalizer";
import {
    InterpolatorType,
    OpenSensorWebResult
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

    async callApi(startDatetime: string, endDatetime: string): Promise<OpenSensorWebResult[]> {
        const full_url = this.apiUrl +
            '&start=' + normalizeTimestampHTTPFormat(startDatetime) +
            '&end=' + normalizeTimestampHTTPFormat(endDatetime);

        return <OpenSensorWebResult[]><unknown> (await got(full_url)).body
    }

    async fetchData(deltaHours?: number): Promise<OpenSensorWebResult[]> {
        if (deltaHours === undefined) deltaHours = 24;
        const now = new Date();
        const deltaHoursAgo = new Date(now.getTime() - deltaHours * 3600 * 1000);

        return this.callApi(deltaHoursAgo.toISOString(), now.toISOString());
    }
}
