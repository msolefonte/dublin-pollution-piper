import {MySQLClient} from '../../src/lib/MySQLClient';
import databaseConfig from '../../src/config/database.json';

describe('Testing MySQLClient', () => {
    // @ts-ignore
    it('An error is thrown if transaction fails', (done) => {
        const mySQLClient = new MySQLClient(databaseConfig);
        // @ts-ignore
        mySQLClient.updateSensorData('this', [{begin: 'is', v: 'wrong'}])
            .catch(() => {
                done();
            });
    });
});
