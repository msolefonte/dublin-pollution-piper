// import {OpenSensorWebClient} from "./lib/OpenSensorWebClient";
import {TomTomTrafficClient} from "./lib/TomTomTrafficClient";

// const oswc = new OpenSensorWebClient('STA.IE.IE0098A', 'SPO.IE.IE0098ASample1_8-NO2-PT1H');
const oswc = new TomTomTrafficClient('FQXYF9UX1peapMlODDER3MQSGJbv1Yx1', '53.346019,-6.293357', 22);
oswc.fetchData().then((data) => {
    console.log(data);
});
