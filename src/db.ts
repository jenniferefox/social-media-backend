// database connection setup

import { Pool } from 'pg';

export const pool = new Pool({
  database: "social_media_db",
  host: "localhost",
  port: 5432
});
