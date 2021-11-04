import {OpenSensorWebClient} from "./lib/OpenSensorWebClient";

const oswc = new OpenSensorWebClient('STA.IE.IE0098A', 'SPO.IE.IE0098ASample1_8-NO2-PT1H');
oswc.fetch_data(168).then((data) => {
    console.log(data);
});
