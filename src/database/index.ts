import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE || 
    !process.env.DB_USERNAME ||
    !process.env.PASSWORD ||
    !process.env.HOST ||
    !Number(process.env.DB_PORT)) {

  throw new Error(
    "ERROR IN CONNECT TO DATABASE: please check the env file values."
  );

}

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USERNAME,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false
  }
);

export default sequelize;