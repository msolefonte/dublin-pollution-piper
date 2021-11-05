import {FlowData, MySQLConfig, OpenSensorWebData} from '../types';
import mysql, {Connection} from 'mysql2/promise';
import {normalizeTimestampDBFormat} from './utils/normalizer';

export class MySQLClient {
    constructor(config: MySQLConfig) {
        this.config = config
    }
private readonly config: MySQLConfig;

    

    private async connectToDatabase(): Promise<Connection> {
        return mysql.createConnection({
            host: this.config.host,
            port: this.config.port,
            user: this.config.auth.username,
            password: this.config.auth.password,
            database: this.config.database,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }

    async updateSensorData(areaId: number, sensorData: OpenSensorWebData[]) {
        const connection = await this.connectToDatabase();

        for (const entry of sensorData) {
            const post  = {area_id: areaId, timestamp: normalizeTimestampDBFormat(entry.begin), no2_level: entry.v};
            try {
                await connection.query('INSERT INTO no2_emissions SET ?', post);
            } catch (error) {
                // @ts-ignore
                if (error && error.code !== 'ER_DUP_ENTRY') {
                    await connection.end();
                    throw error;
                }
            }
        }

        await connection.end();
    }

    async updateTrafficData(areaId: number, trafficData: FlowData) {
        const connection = await this.connectToDatabase();

        const post  = {
            area_id: areaId,
            frc: trafficData.frc,
            current_speed: trafficData.currentSpeed,
            free_flow_speed: trafficData.freeFlowSpeed,
            current_travel_time: trafficData.currentTravelTime,
            free_flow_travel_time: trafficData.freeFlowTravelTime,
            confidence: trafficData.confidence,
            road_closure: trafficData.roadClosure,
            timestamp: normalizeTimestampDBFormat(trafficData.timestamp),
        };

        await connection.query('INSERT INTO traffic SET ?', post);
        await connection.end();
    }
}
