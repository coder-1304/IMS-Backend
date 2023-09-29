import {createPool} from 'mysql2';
import 'dotenv/config';
const pool = createPool({
    host: process.env.DB_HOST,
    user: 'sql12649930',
    password: process.env.DB_PASSWORD,
    database: 'sql12649930',
    connectionLimit: 10
})


export default pool;