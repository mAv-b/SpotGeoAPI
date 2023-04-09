import { DataTypes } from "sequelize";
import sequelize from "../.";

interface UserInterface {
  email: string;
  name?: string;
  password: string;
}

const userAttributtes = {
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}

const User = sequelize.define("users", userAttributtes);

export { User, userAttributtes , UserInterface}