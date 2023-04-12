import * as jwt from 'jsonwebtoken';
import { User } from '../../../database/models/User';
import { Area } from '../../../database/models/Area';
import request from 'supertest';
import app from '../../../server';
import { Place } from '../../../database/models/Place';

describe('Search Tests: ByRadius', () =>{
  let endpoint: string;
  let token: string;
  const radius = 15.0
  const latitude = 0.0;
  const longitude = 0.0;
  let getSearchQuery: any;

  beforeAll(async () => {
    endpoint = '/search';

    await Area.create({
      name: 'area test search 1',
      polygon: {
        type: 'Polygon',
        coordinates: [
          [ [0.0, 0.0], [0.0, 10.0], [10.0, 10.0], [10.0, 0.0]]
        ]
      }
    })

    await Place.create({
      name: 'place test search 1',
      point: {
        type: 'Point',
        coordinates: [5.0, 5.0]
      }
    })

    const user = await User.create({
      name: 'user',
      email: 'user@email.com',
      password: 'pass'
    });

    token = jwt.sign({
      email: user.dataValues.email
    }, process.env.JWT_SECRET_KEY as string, {
      "expiresIn": '10m'
    });

    getSearchQuery = (radius: number, lat: number, long: number) => {
      return `?radius=${radius}&latitude=${lat}&longitude=${long}`;
    }
  });

  // TEST: successfully search
  test('should return a list of places and areas that lies on circle', async () => {
    await request(app)
      .get(endpoint + getSearchQuery(radius, latitude, longitude))
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  });

  // TEST: invalid parameter 1
  test('should return a bad request for invalid parameter 1', async () => {
    const radiusInvalid = 'invalid';
    await request(app)
      .get(endpoint + getSearchQuery(radiusInvalid, latitude, longitude))
      .set('Authorization', 'Bearer ' + token)
      .expect(400, {
        error: 'invalid parameter'
      })
  });

  // TEST: invalid parameter 2
  test('should return a bad request for invalid parameter 2', async () => {
    const latInvalid = 'invalid';
    const longInvalid = 'invalid';

    await request(app)
      .get(endpoint + getSearchQuery(radius, latInvalid, longInvalid))
      .set('Authorization', 'Bearer ' + token)
      .expect(400, {
        error: "invalid parameter"
      })
  });

  // TEST: unauthorized request
  test('should return a forbbiden status for request', async () => {
    const tokenInvalid = 'invalid';

    await request(app)
      .get(endpoint + getSearchQuery(radius, latitude, longitude))
      .set('Authorization', 'Bearer ' + tokenInvalid)
      .expect(403)
  });

});