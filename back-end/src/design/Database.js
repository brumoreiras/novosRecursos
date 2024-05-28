const { Pool } = require('pg');

class Database {
    constructor() {
        if (!Database.instance) {
            this.pool = new Pool({
                user: 'postgres',
                host: 'localhost',
                database: 'toyadventure02',
                password: '123456',
                port: 5432,
            });
            Database.instance = this;
        }
        return Database.instance;
    }

    query(text, params) {
        return this.pool.query(text, params);
    }

    async close() {
        await this.pool.end();
    }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;
