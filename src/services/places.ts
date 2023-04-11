import { validate, required } from "../database/models";
import { PlaceSchema, PutPlaceSchema } from "../database/models/Place";
import { Place } from "../database/models/Place";

export class PlaceService {
  requestBody: any = {};

  constructor(body: any, method: 'POST' | 'PUT') {

    let schema;
    if (method === 'PUT') {
      schema = PutPlaceSchema;
    } else {
      schema = PlaceSchema
    }

    const isValidateBody = validate(body, schema);
    if (!isValidateBody) {
      throw "invalid payload request";
    }

    const numLat = Number(body.latitude) || 0;
    const numLong = Number(body.longitude) || 0;

    if (isNaN(numLat) || isNaN(numLong)) {
      throw "invalid payload request";
    }

    for (let key of Object.keys(body)) {
      if (key === 'name') {
        this.requestBody[key] = body[key]
      } else {
        this.requestBody[key] = Number(body[key]);
      }
    }
  }

  async createPlace() {
    const { name, longitude, latitude } = this.requestBody;

    const alreadyExists = await Place.findOne({ where: { name: name } });
    if (alreadyExists) {
      return null;
    }

    const place = await Place.create({
      name: name,
      point: {
        type: "Point",
        coordinates: [longitude, latitude]
      }
    });

    return place;
  }

  static async getPlace(id: number | null) {
    if (!id) {
      return null;
    }

    const place = await Place.findOne({ where: { id } });
    return place;
  }

  static async getAllPlaces() {
    const places = await Place.findAll();
    return places;
  }

  static async deletePlace(id: number | null) {
    if (!id) {
      return null
    }

    const deletedRows = Place.destroy({ where: { id } });

    return deletedRows;
  }

  async editPlace(id: number | null) {
    let { name, latitude, longitude } = this.requestBody;

    if (!id) {
      return null;
    }

    const place = await Place.findOne({ where: { id } });

    if (!place) {
      return place;
    }


    name = name || place.dataValues.name;
    longitude = longitude || place.dataValues.point.coordinates[0];
    latitude = latitude || place.dataValues.point.coordinates[1];

    await place.update({
      name: name,
      point: {
        type: "Point",
        coordinates: [longitude, latitude]
      }
    });

    await place.save();

    return place;
  }

  static async pointsDistance(id1: number | null, id2: number | null) {
    const place1 = await Place.findOne({ where: { id: id1 } });
    const place2 = await Place.findOne({ where: { id: id2 } });

    if (!place1 || !place2) {
      return null;
    }

    const pointOne = place1.dataValues.point;
    const pointTwo = place2.dataValues.point;

    delete pointOne.crs;
    delete pointTwo.crs;

    const strPointOne = JSON.stringify(pointOne);
    const strPointTwo = JSON.stringify(pointTwo);

    const distance: any = await Place.sequelize!.query(
      `SELECT ST_Distance(
        (SELECT ST_GeomFromGeoJSON('${strPointOne}')),
        (SELECT ST_GeomFromGeoJSON('${strPointTwo}'))
      )`
    );

    return distance;
  }
}