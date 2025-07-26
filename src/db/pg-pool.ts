import { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD } from '../config.js';
import { Pool } from 'pg';

export const pool = new Pool({
	host: POSTGRES_HOST,
	user: POSTGRES_USER,
	port: 5432,
	password: POSTGRES_PASSWORD,
	database: 'postgres',
	connectionTimeoutMillis: 0,
	idleTimeoutMillis: 0,
	min: 10,
	max: 20
});
