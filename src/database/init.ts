import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import sequelize from ".";
import { userAttributtes } from "./models/User";
import { placeAttributtes } from './models/Place';

dotenv.config();

const User = sequelize.define("users", userAttributtes);
const Place = sequelize.define("places", placeAttributtes);

sequelize.sync().then(()=>{
  const salt = bcrypt.genSaltSync(10);

  User.create({
    email: "admin@email.com",
    name: "admin",
    password: bcrypt.hashSync("pass", salt)
  });

  // Place.create({
  //   name:"Plaza Test",
  //   point: {
  //     type: 'Point',
  //     coordinates: [-45.22, -22.8]
  //   }
  // });

  console.log("Initializated.");
  
}).catch(err =>{
  console.error("Error in initializate database:", err);
});