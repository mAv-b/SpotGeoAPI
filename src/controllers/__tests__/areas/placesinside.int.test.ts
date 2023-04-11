import * as jwt from 'jsonwebtoken';
import { User } from '../../../database/models/User';
import { Area } from '../../../database/models/Area';
import request from 'supertest';
import app from '../../../server';
import { Place } from '../../../database/models/Place';

describe('Area Tests: places inside', () =>{
  let prefixEndpoint: string;
  let subfixEndpoint: string;
  let token: string;
  let id: number;

  beforeAll(async () => {
    prefixEndpoint = '/areas/';
    subfixEndpoint = '/places/';

    const user = await User.create({
      name: 'user',
      email: 'user@email.com',
      password: 'pass'
    });

    await Place.create({
      name:'point1 inside places test',
      point: {
        type: 'Point',
        coordinates: [12.0, 18.0]
      }
    });

    await Place.create({
      name:'point2 inside places test',
      point: {
        type: 'Point',
        coordinates: [10.0, 15.0]
      }
    })

    const area = await Area.create({
      name: 'area inside places test',
      polygon: {
        type: 'Polygon',
        coordinates: [
          [[0.0, 0.0], [0.0, 20.0], [20.0, 20.0], [20.0, 0.0]]
        ]
      }
    });

    id = area.dataValues.id;

    token = jwt.sign({
      email: user.dataValues.email
    }, process.env.JWT_SECRET_KEY as string, {
      "expiresIn": '10m'
    });

  });

  // TEST: get all places inside of area
  test('should return all places inside that area', async () => {
    await request(app)
      .get(prefixEndpoint + id + subfixEndpoint)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  });

  // TEST: invalid id
  test('should return bad request for a invalid id', async () => {
    const idInvalid = 'invalid';

    await request(app)
      .get(prefixEndpoint + idInvalid + subfixEndpoint)
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
  });

  // TEST: unauthorizate request
  test('should return a forbbiden status', async () => {
    const tokenInvalid = 'invalid';

    await request(app)
      .get(prefixEndpoint + id + subfixEndpoint)
      .set('Authorization', 'Bearer ' + tokenInvalid)
      .expect(403)
  });
});