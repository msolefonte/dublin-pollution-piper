import {MySQLClient} from "./lib/MySQLClient";
import {OpenSensorWebClient} from "./lib/OpenSensorWebClient";
import {Piper} from "./lib/Piper";
import {TomTomTrafficClient} from "./lib/TomTomTrafficClient";
import areas from "./config/areas.json";
import databaseConfig from "./config/database.json";
import tomTomConfig from "./config/tomtom.json";

async function main() {
    const mySQLClient = new MySQLClient(databaseConfig);

    for (const area of areas.areas) {
        const sensorClient = new OpenSensorWebClient(area.sensor.deviceId, area.sensor.sensorId);
        const trafficClient = new TomTomTrafficClient(tomTomConfig.apiKey, area.coordinates, 22);

        const piper = new Piper(area.id, mySQLClient, sensorClient, trafficClient);
        await piper.pipe();
    }
}

main().then(() => {
    console.log('Data piped');
});
