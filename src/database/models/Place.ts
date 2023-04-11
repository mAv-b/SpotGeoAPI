import { DataTypes } from "sequelize";
import { Schema } from ".";
import sequelize from "..";

// interface PlaceInterface {
//   id?: string
//   name: string;
//   latitude: number;
//   longitude: number;
// }

const PlaceSchema: Schema = {
  fields: {
    name: 'string',
    latitude: 'string',
    longitude: 'string',
  },
  required: ['name', 'latitude', 'longitude']
}

const PutPlaceSchema: Schema = {
  ...PlaceSchema,
  required: []
}

const placeAttributtes = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  point: {
    type: DataTypes.GEOMETRY('POINT', 4326),
    allowNull: false
  }
}

const Place = sequelize.define("places", placeAttributtes);

export { Place, placeAttributtes, PlaceSchema, PutPlaceSchema};