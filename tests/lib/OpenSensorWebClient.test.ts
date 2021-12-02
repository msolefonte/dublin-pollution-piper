import {OpenSensorWebClient} from '../../src/lib/OpenSensorWebClient';

describe('Testing OpenSensorWebClient', () => {
    it('No error is thrown if no data can be fetched', async () => {
        const sensorClient = new OpenSensorWebClient('this', 'is', 'wrong', 'LINEAR');
        await sensorClient.fetchData();
    });
});
