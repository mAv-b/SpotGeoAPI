import { DataTypes } from "sequelize";
import { Schema } from ".";
import sequelize from "..";

const AreaSchema: Schema = {
  fields: {
    name: 'string',
    coordinates: 'object'
  },
  required: ['name', 'coordinates']
}

const PutAreaSchema: Schema = {
  ...AreaSchema,
  required: []
}

const areaAttributes = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  polygon: {
    type: DataTypes.GEOMETRY('POLYGON', 4326),
    allowNull: false
  }
}

const Area = sequelize.define("areas", areaAttributes);

const checkPolygonObject = (polygon: object) => {
  if (!Array.isArray(polygon)) {
    return false
  }

  return polygon.every((i)=>{
    if (!Array.isArray(i) || i.length < 2) return false;

    for (const value of i) {
      if (typeof value !== 'number') return false;
    }
    return true;
  });
}

export { Area, areaAttributes, AreaSchema, PutAreaSchema, checkPolygonObject };