require('dotenv').config();
import { Pool } from 'pg';

const config =  {
    host: process.env.PG_HOST || 'db',
    user: process.env.PG_USERNAME ||'root',
    port: parseInt(process.env.PG_PORT || '5432'),
    password:process.env.PG_PASSWORD || 'root',
    database: process.env.PG_DATABASE || 'nodedb',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 60000,
};

export const pool = new Pool(config);

