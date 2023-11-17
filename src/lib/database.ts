import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export async function DB() {
  return open({
    filename: 'sql.db',
    driver: sqlite3.Database
  });
}