import { DataTypes } from "sequelize";
import { Schema } from ".";
import sequelize from "..";

interface UserInterface {
  email: string;
  name?: string;
  password: string;
}

const UserSchema: Schema = {
  fields: {
    name: 'string',
    email: 'string',
    password: 'string'
  },
  required: ['email', 'name', 'password']
}

const AuthUserSchema: Schema = {
  fields: {
    email: 'string',
    password: 'string'
  },
  required: ['email', 'password']
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

export { User, userAttributtes , UserSchema, AuthUserSchema, UserInterface };