import { Area } from "../database/models/Area";
import { Place } from "../database/models/Place";

export class SearchService {

  static async entitiesInRadius(radius: number | null, coords: number[]) {
    if (!radius || !coords) {
      return null;
    }

    const [long, lat] = coords;
    const sequelize = Place.sequelize!;

    const point = sequelize.fn(
      'ST_SetSRID',
      sequelize.fn(
        'ST_MakePoint',
        long, lat
      ),
      4326
    );

    const places: any = await Place.findAll({
      where: sequelize.where(
        sequelize.fn(
          'ST_DWithin',
          sequelize.col('point'),
          point,
          radius
        ),
        true
      )
    });

    const areas = await Area.findAll({
      where: sequelize.where(
        sequelize.fn(
          'ST_DFullyWithin',
          sequelize.col('polygon'),
          point,
          radius
        ),
        true
      )
    });

    for(let i in places){
      const entity = places[i].point;
      delete entity.crs;

      const strEntity = JSON.stringify(entity);

      const distance: any = await sequelize.query(
        `SELECT ST_Distance(
          (SELECT ST_GeomFromGeoJSON('${strEntity}')),
          (SELECT ST_SetSRID(ST_MakePoint(${long}, ${lat}), 4326) )
        )`
      );

      places[i].dataValues.distance = distance[0][0].st_distance;
    }

    return {places, areas};
  }
}