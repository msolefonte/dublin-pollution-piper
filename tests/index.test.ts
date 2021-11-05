import {Area} from '../src/types';
import {MySQLClient} from '../src/lib/MySQLClient';
import {OpenSensorWebClient} from '../src/lib/OpenSensorWebClient';
import {Piper} from '../src/lib/Piper';
import {TomTomTrafficClient} from '../src/lib/TomTomTrafficClient';
import areasConfig from '../src/config/areas.json';
import databaseConfig from '../src/config/database.json';
import {expect} from 'chai';
import {step} from 'mocha-steps';
import tomTomConfig from '../src/config/tomtom.json';

describe('Testing Piper', () => {
    if (process.env.MODE === 'CI/CD') {
        tomTomConfig.apiKey = <string> process.env.TOM_TOM_API_KEY;

        databaseConfig.host = <string> process.env.DATABASE_HOST;
        databaseConfig.port = parseInt(<string> process.env.DATABASE_PORT);
        databaseConfig.auth.username = <string> process.env.DATABASE_USERNAME;
        databaseConfig.auth.password = <string> process.env.DATABASE_PASSWORD;
        databaseConfig.database = <string> process.env.DATABASE_DATABASE;
    }

    let mySQLClient: MySQLClient;
    const areas: Area[] = areasConfig.areas;

    step('MySQLClient is created', () => {
        mySQLClient = new MySQLClient(databaseConfig);
    });

    step('Areas are loaded', () => {
        // @ts-ignore
        expect(areas.length).to.be.greaterThan(1);
    });

    context('Standard', () => {
        // @ts-ignore
        for (const area of areas) {
            context('Area ' + area.id + ' - ' + area.description, () => {
                let sensorClient: OpenSensorWebClient;
                let trafficClient: TomTomTrafficClient;
                let piper: Piper;

                step('Sensor client is created', () => {
                    sensorClient = new OpenSensorWebClient(area.sensor.deviceId, area.sensor.sensorId);
                });

                step('Traffic client is created', () => {
                    trafficClient = new TomTomTrafficClient(tomTomConfig.apiKey, area.coordinates, 22);
                });

                step('Piper is created', () => {
                    piper = new Piper(area.id, mySQLClient, sensorClient, trafficClient);
                });

                // @ts-ignore
                step('Piping works', async () => {
                    await piper.pipe();
                });
            });
        }
    });

    context('Cache', () => {
        // @ts-ignore
        const area: Area = areas[0];
        const sensorClient = new OpenSensorWebClient(area.sensor.deviceId, area.sensor.sensorId);
        const trafficClient = new TomTomTrafficClient(tomTomConfig.apiKey, area.coordinates, 22);
        const piper = new Piper(area.id, mySQLClient, sensorClient, trafficClient);

        // @ts-ignore
        step('Cache works', async () => {
            await piper.updateTimestamp(new Date(now.getTime() - 48 * 3600 * 1000).);
        });

        // @ts-ignore
        step('Sensor data is piped if cache is old', async () => {
            await piper.pipeSensorData();
        });

        // @ts-ignore
        step('Sensor data is not piped if cache is recent', async () => {
            await piper.pipeSensorData();
        });
    });

    context('Network problems', () => {
        // @ts-ignore
        const area: Area = areas[0];
        // @ts-ignore
        const piper = new Piper(area.id, mySQLClient, undefined, undefined);

        // @ts-ignore
        step('No error is thrown if sensor data can not be fetched', async () => {
            await piper.pipeSensorData();
        });

        // @ts-ignore
        step('No error is thrown if traffic data can not be fetched', async () => {
            await piper.pipeTrafficData();
        });
    });
});
