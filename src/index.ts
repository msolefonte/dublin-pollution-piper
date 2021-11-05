import {Area} from './types';
import {MySQLClient} from './lib/MySQLClient';
import {OpenSensorWebClient} from './lib/OpenSensorWebClient';
import {Piper} from './lib/Piper';
import {TomTomTrafficClient} from './lib/TomTomTrafficClient';
import areasConfig from './config/areas.json';
import databaseConfig from './config/database.json';
import tomTomConfig from './config/tomtom.json';

// @ts-ignore
async function main() {
    const mySQLClient = new MySQLClient(databaseConfig);
    const areas: Area[] = areasConfig.areas;

    console.log(process.env.MODE);
    console.log(process.env.DATABASE_PORT);
    console.log(process.env.DATABASE_DATABASE);
    if (process.env.MODE === 'CI/CD') {
        tomTomConfig.apiKey = <string> process.env.TOM_TOM_API_KEY;

        databaseConfig.host = <string> process.env.DATABASE_HOST;
        databaseConfig.port = parseInt(<string> process.env.DATABASE_PORT);
        databaseConfig.auth.username = <string> process.env.DATABASE_USERNAME;
        databaseConfig.auth.password = <string> process.env.DATABASE_PASSWORD;
        databaseConfig.database = <string> process.env.DATABASE_DATABASE;
    }

    // @ts-ignore
    for (const area of areas) {
        const sensorClient = new OpenSensorWebClient(area.sensor.deviceId, area.sensor.sensorId);
        const trafficClient = new TomTomTrafficClient(tomTomConfig.apiKey, area.coordinates, 22);

        const piper = new Piper(area.id, mySQLClient, sensorClient, trafficClient);
        await piper.pipe();
    }
}

main().then(() => {
    console.log('Data piped');
});
