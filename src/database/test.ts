import { Client } from "pg";

const pg = new Client({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: 'postgres',
  password: 'postgres'
})

const create = async () => {
  try {
    await pg.connect();
    await pg.query('CREATE DATABASE my_database');
    return true;
  } catch(err) {
    console.error(err);
    return false;
  } finally {
    await pg.end();
  }
}

create().then((res) => {
  if (res) {
    console.log('yeah');
  }
})