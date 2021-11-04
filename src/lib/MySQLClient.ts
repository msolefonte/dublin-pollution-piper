import mysql from 'mysql';

export class MySQLClient {
    private readonly config: MySQLClient;

    constructor(config: MySQLConfig) {
        this.config = config
    }

    private connectToDatabase() {
        mysql.createConnection({
            host: config.
        })
    }
}
