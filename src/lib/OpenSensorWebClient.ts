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
        this.deviceId = deviceId
    }

    private readonly apiUrl: string;
    private readonly deviceId: string;

    async callApi(startDatetime: string, endDatetime: string): Promise<OpenSensorWebData[]> {
        const full_url = this.apiUrl +
            '&start=' + normalizeTimestampHTTPFormat(startDatetime) +
            '&end=' + normalizeTimestampHTTPFormat(endDatetime);

        try {
            console.log(full_url);
            console.log(JSON.parse((await got(full_url)).body).length);
            return <OpenSensorWebData[]><unknown>JSON.parse((await got(full_url)).body)
        } catch (error: unknown) {
            console.error('An error happened when getting sensor data (deviceId ' + this.deviceId + '): "' + error + '"');
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
