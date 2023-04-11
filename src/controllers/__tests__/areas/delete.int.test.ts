import * as jwt from 'jsonwebtoken';
import { User } from '../../../database/models/User';
import { Area } from '../../../database/models/Area';
import request from 'supertest';
import app from '../../../server';

describe('Area Tests: DELETE', () => {
  let endpoint: string;
  let id: number;
  let token: string

  beforeAll(async () => {
    endpoint = '/areas/';

    const area = await Area.create({
      name: 'delete area test',
      polygon: {
        type: 'Polygon',
        coordinates: [
          [[90.0, 60.0], [90.0, 50.0], [80.0, 50.0], [80.0, 60.0]]
        ]
      }
    });

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

  // TEST: delete a area successfully
  test('should delete successfully a area by id', async () => {
    await request(app)
      .delete(endpoint + id)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)
  });

  // TEST: invalid id for area
  test('should return a bad request for a area', async () => {
    const idInvalid = 'invalid';

    await request(app)
      .delete(endpoint + idInvalid)
      .set('Authorization', 'Bearer ' + token)
      .expect(400, {
        error: 'invalid parameter'
      })
  });

  // TEST: not found area
  test('should return a not found area by id', async () => {
    const idNotFound = id + 100;

    await request(app)
      .delete(endpoint + idNotFound)
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        error: 'area not found'
      })
  });

  // TEST: unauthorizate request
  test('should return a forbbiden request', async () => {
    const tokenInvalid = 'invalid';

    await request(app)
      .delete(endpoint + id)
      .set('Authorization', 'Bearer ' + tokenInvalid)
      .expect(403)
  });

});