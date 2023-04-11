import * as jwt from 'jsonwebtoken';
import { User } from '../../../database/models/User';
import { Area } from '../../../database/models/Area';
import request from 'supertest';
import app from '../../../server';

describe('Areas test: GET', () => {
  let endpoint: string;
  let id: number;
  let token: string;

  beforeAll(async () => {
    endpoint = '/areas/';

    const area = await Area.create({
      name: 'area test get',
      polygon: {
        type: 'Polygon',
        coordinates: [
          [ [0.0, 0.0], [0.0, 10.0], [10.0, 10.0], [10.0, 0.0]]
        ]
      }
    })
    
    const user = await User.create({
      name: 'user',
      email: 'user@email.com',
      password: 'pass'
    });

    id = area.dataValues.id;

    token = jwt.sign({
      email: user.dataValues.email
    }, process.env.JWT_SECRET_KEY as string, {
      "expiresIn": '10m'
    });

  });

  // TEST: get a single area successfully
  test('should return a single area by id', async () => {
    await request(app)
      .get(endpoint + id)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  });

  // TEST: get all areas successfully
  test('should return all areas', async () => {
    await request(app)
      .get(endpoint)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  });

  // TEST: not found a place within that id
  test('should return a not found place by id', async () =>{
    const idNotFound = id + 100;

    await request(app)
      .get(endpoint + idNotFound)
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        error: 'area not found'
      })
  });

  // TEST: bad request for a invalid id
  test('should return a bad request for invalid id', async () => {
    const idInvalid = 'invalid'

    await request(app)
      .get(endpoint + idInvalid)
      .set('Authorization', 'Bearer ' + token)
      .expect(400, {
        error: 'invalid parameter'
      })
  });

  // TEST: unauthorization for request
  test('should return a forbbiden request', async () => {
    const tokenInvalid = 'invalid';

    await request(app)
      .get(endpoint + id)
      .set('Authorization', 'Bearer ' + tokenInvalid)
      .expect(403)
  });
});