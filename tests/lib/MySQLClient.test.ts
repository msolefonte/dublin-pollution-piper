import {MySQLClient} from '../../src/lib/MySQLClient';
import databaseConfig from '../../src/config/database.json';

describe('Testing MySQLClient', () => {
    if (process.env.MODE === 'CI/CD') {
        databaseConfig.host = <string> process.env.DATABASE_HOST;
        databaseConfig.port = parseInt(<string> process.env.DATABASE_PORT);
        databaseConfig.auth.username = <string> process.env.DATABASE_USERNAME;
        databaseConfig.auth.password = <string> process.env.DATABASE_PASSWORD;
        databaseConfig.database = <string> process.env.DATABASE_DATABASE;
    }

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
