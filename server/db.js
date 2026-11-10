import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'bankdb',
  password: 'password',
  port: 5432,
});

export default {
  query: (text, params) => pool.query(text, params),
};
