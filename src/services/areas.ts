import * as Area from "../database/models/Area";
import { validate } from "../database/models";
import { Place } from "../database/models/Place";
import { Sequelize } from "sequelize";

export class AreaService {
  requestBody: any;

  constructor(body: any, isPutAreaSchema: boolean) {
    let schema;

    if (isPutAreaSchema) {
      schema = Area.PutAreaSchema;
    } else {
      schema = Area.AreaSchema;
    }

    const isValid = validate(body, schema);
    if (!isValid) {
      throw 'invalid payload'
    }

    const isPolygon = body.polygon || [[0]];
    if (Area.checkPolygonObject(isPolygon)) {
      throw 'invalid payload';
    }

    this.requestBody = body;

    // TODO convert array of strings to numbers
  }

  async createArea() {
    const { name, coordinates } = this.requestBody;

    const alreadyExists = await Area.Area.findOne({ where: { name } });
    if (alreadyExists) {
      return null;
    }

    const area = await Area.Area.create({
      name: name,
      polygon: {
        type: "Polygon",
        coordinates: coordinates
      }
    });

    return area;
  }

  static async getAllArea() {
    return await Area.Area.findAll();
  }

  static async getSingleArea(id: number | null) {
    if (!id) {
      return null;
    }

    const area = await Area.Area.findOne({ where: { id } });
    if (!area) {
      return area;
    }

    return area;
  }

  async editArea(id: number | null) {
    if (!id) {
      return null;
    }

    let { name, coordinates } = this.requestBody;

    const area = await Area.Area.findOne({ where: { id } });
    if (!area) {
      return area;
    }

    name = name || area.dataValues.name;
    coordinates = coordinates || area.dataValues.polygon.coordinates;

    await area.update({
      name: name,
      polygon: {
        type: 'Polygon',
        coordinates: coordinates
      }
    });

    await area.save();

    return area;
  }

  static async deleteArea(id: number | null) {
    if (!id) {
      return false;
    }

    const area = await Area.Area.findOne({ where: { id } });
    if (!area) {
      return false;
    }

    await area.destroy();
    return true;
  }

  static async placesInsideOfArea(id: number | null) {
    if (!id) {
      return null;
    }

    const area = await Area.Area.findOne({ where: { id } });
    if (!area) {
      return area;
    }

    const polygon = area.dataValues.polygon;
    delete polygon.crs;

    const strPolygon = JSON.stringify(polygon);
    const sequelize = Area.Area.sequelize!;

    const placesInside = await Place.findAll({ where:
      sequelize.where(

        sequelize.fn('ST_Contains',
          sequelize.fn('ST_GeomFromGeoJSON', strPolygon),
          sequelize.col('point')
        ),

        true
      )
    });

    return placesInside;
  }
}