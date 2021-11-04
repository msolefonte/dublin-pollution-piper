import {MySQLClient} from "./lib/MySQLClient";
import {OpenSensorWebClient} from "./lib/OpenSensorWebClient";
import {Piper} from "./lib/Piper";
import {TomTomTrafficClient} from "./lib/TomTomTrafficClient";
import areas from "./config/areas.json";
import tomTom from "./config/tomtom.json";

function main() {
    const mySQLClient = new MySQLClient();

    for (const area of areas.areas) {
        const sensorClient = new OpenSensorWebClient(area.sensor.deviceId, area.sensor.sensorId);
        const trafficClient = new TomTomTrafficClient(tomTom.apiKey, area.coordinates, 22);

        const piper = new Piper(area.id, mySQLClient, sensorClient, trafficClient);
        piper.pipe().then(() => {});
    }
}

main();
