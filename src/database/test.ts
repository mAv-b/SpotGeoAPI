import { Client } from "pg";

const pg = new Client({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: 'postgres',
  password: 'postgres',
  database: 'postgres'
})

pg.connect();

const table = 'CREATE TABLE student(id SERIAL PRIMARY KEY)';
pg.query(table, (err, res) =>{
  if (err) throw err;
});