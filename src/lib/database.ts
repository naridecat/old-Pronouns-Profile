import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export async function DBInit(){
  console.log('db 초기화중')
  const client = await DB()
  await client.exec(`CREATE TABLE IF NOT EXISTS document(
    idx INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT not null,
    username TEXT not null,
    password_plain TEXT not null,
    password_salt TEXT not null,
    data JSON default "[]",
    bumped_at DATETIME DEFAULT (datetime('now', 'localtime'))
  )`)
  await client.close()
}

export async function DB() {
  return open({
    filename: 'sql.db',
    driver: sqlite3.Database
  });
}

