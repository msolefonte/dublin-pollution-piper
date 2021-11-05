import fs from 'fs'
import path from "path"
import {MySQLClient} from "./MySQLClient";
import {OpenSensorWebClient} from "./OpenSensorWebClient";
import {TomTomTrafficClient} from "./TomTomTrafficClient";
import {OpenSensorWebData} from "../types";

export class Piper {
    private readonly areaId: number;
    private readonly databaseClient: MySQLClient;
    private readonly openSensorClient: OpenSensorWebClient;
    private readonly openDataClient: TomTomTrafficClient;
    private readonly timestampFilePath: string;

    constructor(areaId: number, databaseClient: MySQLClient, openSensorClient: OpenSensorWebClient, openDataClient: TomTomTrafficClient) {
        this.areaId = areaId;
        this.databaseClient = databaseClient;
        this.openSensorClient = openSensorClient;
        this.openDataClient = openDataClient;
        this.timestampFilePath =  path.resolve(__dirname, "../../tmp/" + areaId + ".tms");
    }

    private async getLastTimestamp(): Promise<Date> {
        const timestamp: string = await fs.promises.readFile(this.timestampFilePath, 'utf8');
        return new Date(timestamp);
    }

    private async updateTimestamp(timestamp: string): Promise<void> {
        await fs.promises.writeFile(this.timestampFilePath, timestamp, 'utf8');
    }

    private async subsetSensorData(sensorData: OpenSensorWebData[]) {
        let lastTimestamp;

        try {
            lastTimestamp = await this.getLastTimestamp();
        } catch (e) {
            return sensorData
        }

        let i = 0;
        while (i < sensorData.length) {
            const entryTimestamp = new Date(sensorData[i].begin);
            if (entryTimestamp > lastTimestamp) break;

            i += 1
        }

        return sensorData.slice(i);
    }

    async pipeSensorData(): Promise<void> {
        try {
            const sensorData = await this.subsetSensorData(await this.openSensorClient.fetchData(168));

            if (sensorData.length > 0) {
                await this.databaseClient.updateSensorData(this.areaId, sensorData);
                const newTimestamp = sensorData[sensorData.length - 1].begin;

                this.updateTimestamp(newTimestamp);
            }
        } catch (error: any) {
            console.error('An error happened when piping sensor data (area ' + this.areaId + '): "' + error + '"');
        }
    }

    async pipeTrafficData(): Promise<void> {
        try {
            const trafficData = await this.openDataClient.fetchData();
            await this.databaseClient.updateTrafficData(this.areaId, trafficData);
        } catch (error: any) {
            console.error('An error happened when piping traffic data (area ' + this.areaId + '): "' + error + '"');
        }
    }

    async pipe(): Promise<void> {
        await this.pipeSensorData();
        await this.pipeTrafficData();
    }
}
