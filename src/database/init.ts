import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import sequelize from ".";
import { userAttributtes } from "./models/User";
import { placeAttributtes } from './models/Place';
import { areaAttributes } from './models/Area';

dotenv.config();

const User = sequelize.define("users", userAttributtes);
const Place = sequelize.define("places", placeAttributtes);
const Area = sequelize.define("area", areaAttributes);

sequelize.sync().then(()=>{
  const salt = bcrypt.genSaltSync(10);

  User.create({
    email: "admin@email.com",
    name: "admin",
    password: bcrypt.hashSync("pass", salt)
  });

  console.log("Initializated.");
  
}).catch(err =>{
  console.error("Error in initializate database:", err);
});