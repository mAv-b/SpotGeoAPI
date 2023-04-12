import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { Client } from 'pg';
import { Sequelize } from 'sequelize';
import { userAttributtes } from "./models/User";
import { placeAttributtes } from './models/Place';
import { areaAttributes } from './models/Area';

dotenv.config();

const createDatabase = async () => {
  const client = new Client({
    host: process.env.HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.PASSWORD
  })

  try {
    await client.connect();

    const databaseQuery = `CREATE DATABASE ${process.env.DATABASE}`;

    await client.query(databaseQuery);

  } catch(err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

const migrateData = async () => {

  const sequelize = new Sequelize(
    process.env.DATABASE!,
    process.env.DB_USERNAME!,
    process.env.PASSWORD!,
    {
      host: process.env.HOST!,
      port: Number(process.env.DB_PORT!),
      dialect: 'postgres',
      logging: false
    })

  try {
    const addPostGis = `CREATE EXTENSION postgis`;
    await sequelize.query(addPostGis);
  } catch(err) {
    null
  }

  const User = sequelize.define("users", userAttributtes);
  
  sequelize.define("places", placeAttributtes);
  sequelize.define("area", areaAttributes);

  sequelize.sync().then(() => {
    const salt = bcrypt.genSaltSync(10);

    User.create({
      email: "admin@email.com",
      name: "admin",
      password: bcrypt.hashSync("pass", salt)
    });

  }).catch(err => {
    console.error("Error in initializate database:", err);
  });
}

const cleanDatabase = async () => {
  const client = new Client({
    database: process.env.DATABASE,
    host: process.env.HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.PASSWORD
  })

  try {
    await client.connect();

    const sqlDeleteUsersTable = `DROP TABLE users`;
    const sqlDeletePlacesTable = `DROP TABLE places`;
    const sqlDeleteAreasTable = `DROP TABLE areas`;

    await client.query(sqlDeleteUsersTable);

    await client.query(sqlDeletePlacesTable);

    await client.query(sqlDeleteAreasTable);

  } catch(err) {
    console.error(err);
  } finally {
    client.end();
  }
}

// check env variables
if (!process.env.DATABASE ||
  !process.env.DB_USERNAME ||
  !process.env.PASSWORD ||
  !process.env.HOST ||
  !Number(process.env.DB_PORT)) {

  throw new Error(
    "ERROR IN CONNECT TO DATABASE: please check the env file values."
  );

} else if (process.env.DATABASE.toLowerCase() !== process.env.DATABASE) {
  throw new Error(
    "Please use only lower case in database name"
  )
}

// flow to (create a database) to (migrate data)
const command = process.argv.splice(2)[0];

if (command === '--DB') {
  createDatabase().then(() => {
    console.log('DATABASE CREATED');
  }).catch(() => {
    console.log('FAIL IN CREATE DATABASE');
  });

} else if (command === '--clean') {

  cleanDatabase().then(() => {
    console.log('DATABASE CLEANED');
  }).catch(() => {
    console.log('FAIL TO CLEAN DATABASE');
  })

} else {

  migrateData().then(() => {
    console.log('MIGRATION COMPLETE');
  }).catch(_ => {
    console.log(_);
    console.log('FAIL IN MIGRATE')
  });

}
