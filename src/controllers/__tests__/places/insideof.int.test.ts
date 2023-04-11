import * as jwt from 'jsonwebtoken';
import { User } from '../../../database/models/User';
import { Area } from '../../../database/models/Area';
import request from 'supertest';
import app from '../../../server';
import { Place } from '../../../database/models/Place';

describe('Place Tests: insideof', () =>{
  let prefixEndpoint: string;
  let subfixEndpoint: string;
  let token: string;
  let idPlace: number;
  let idArea: number;

  beforeAll(async () => {
    prefixEndpoint = '/places/';
    subfixEndpoint = '/insideof/';

    const user = await User.create({
      name: 'user',
      email: 'user@email.com',
      password: 'pass'
    });

    const place = await Place.create({
      name: 'place inside test',
      point: {
        type: 'Point',
        coordinates: [150.0, 150.0]
      }
    });

    const area = await Area.create({
      name: 'area inside test',
      polygon: {
        type: 'Polygon',
        coordinates: [
          [ [140.0, 140.0], [140.0, 160.0], [160.0, 160.0], [160.0, 140.0] ]
        ]
      }
    });

    token = jwt.sign({
      email: user.dataValues.email
    }, process.env.JWT_SECRET_KEY as string, {
      "expiresIn": '10m'
    });

    idPlace = place.dataValues.id;
    idArea = area.dataValues.id;

  });
  
  // TEST: check if a place is inside of area successfully
  test('should return that place is inside of that area', async () =>{
    await request(app)
      .get(prefixEndpoint + idPlace + subfixEndpoint + idArea)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  });

  // TEST: invalid parameter 1
  test('should return a bad request for invalid place id', async () => {
    const idPlaceInvalid = 'invalid';

    await request(app)
      .get(prefixEndpoint + idPlaceInvalid + subfixEndpoint + idArea)
      .set('Authorization', 'Bearer ' + token)
      .expect(400, {
        error: 'invalid parameter'
      })
  });

  // TEST: invalid parameter 2
  test('should return a bad request for a invalid area id', async () => {
    const idAreaInvalid = 'invalid';

    await request(app)
      .get(prefixEndpoint + idPlace + subfixEndpoint + idAreaInvalid)
      .set('Authorization', 'Bearer ' + token)
      .expect(400, {
        error: 'invalid parameter'
      })
  });

  // TEST: not found place
  test('should return a not found place', async () => {
    const idPlaceNotFound = idPlace + 100;

    await request(app)
      .get(prefixEndpoint + idPlaceNotFound + subfixEndpoint + idArea)
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        error: 'place or area not found'
      })
  });

  // TEST: not found area
  test('should return a not found area', async () => {
    const idAreaNotFound = idArea + 100;

    await request(app)
      .get(prefixEndpoint + idPlace + subfixEndpoint + idAreaNotFound)
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        error: 'place or area not found'
      })
  });

  // TEST: unauthorizate request
  test('should return a forbbiden status', async () => {
    const tokenInvalid = 'invalid';

    await request(app)
      .get(prefixEndpoint + idPlace + subfixEndpoint + idArea)
      .set('Authorization', 'Bearer ' + tokenInvalid)
      .expect(403)
  });
});