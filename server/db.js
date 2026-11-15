import pg from "pg";

// pg reads PGHOST, PGPORT, PGUSER, PGPASSWORD, and PGDATABASE from the environment.
const db = new pg.Pool();

export default db;
