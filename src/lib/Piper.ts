import fs from 'fs'
import path from "path"
import {MySQLClient} from "./MySQLClient";
import {OpenSensorWebClient} from "./OpenSensorWebClient";
import {TomTomTrafficClient} from "./TomTomTrafficClient";
import {OpenSensorWebResult} from "../types";

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

    private async subsetSensorData(sensorData: OpenSensorWebResult[]) {
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
        const sensorData = await this.subsetSensorData(await this.openSensorClient.fetchData(168));

        if (sensorData.length > 0) {
            this.databaseClient.updateSensorData(this.areaId, sensorData);
            const newTimestamp = sensorData[sensorData.length - 1].begin;

            this.updateTimestamp(newTimestamp);
        }
    }

    async pipeTrafficData(): Promise<void> {
        const trafficData = this.openDataClient.fetchData();
        this.databaseClient.updateTrafficData(this.areaId, trafficData);
    }

    async pipe(): Promise<void> {
        this.pipeSensorData();
        this.pipeTrafficData()
    }
}
