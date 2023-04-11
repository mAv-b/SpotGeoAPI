import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../../../server';
import { User } from "../../../database/models/User";
import { Area } from '../../../database/models/Area';

describe('Areas Tests: POST', () => {
  let endpoint: string;
  let token: string;
  let payload: any;
  const duplicateAreaName = 'area test existence';

  beforeAll(async () => {
    endpoint = '/areas/';
    payload = {
      name: "area test 1",
      coordinates: [ 
        [ [40.70078680432135, 54.318751960999265], [126.34904261201774, 56.3027073497538],
          [176.26028066020842, 65.42704434624065], [11.725268979690952, 79.11642637658571],
          [40.70078680432135, 54.318751960999265] ]
      ]
    }

    await Area.create({
      name: duplicateAreaName,
      polygon: {
        type: "Polygon",
        coordinates: [
          [ [0,0], [0.0, 10.0], [10.0,10.0], [10.0, 0.0]]
        ]
      }
    });

    const user = await User.create({
      name: "user",
      email: "user@email.com",
      password: "pass"
    });

    token = jwt.sign({
      email: user.dataValues.email
    }, process.env.JWT_SECRET_KEY as string, {
      "expiresIn": '10m'
    });

  });

  // TEST: create a area successfully
  test('should return a OK status for area created', async () => {
    await request(app)
      .post(endpoint)
      .set('Authorization', 'Bearer ' + token)
      .send(payload)
      .expect(201)
  });

  // TEST: invalid payload 1
  test('should return a bad request for area request 1', async () => {
    const invalidPayload = {property: "invalid"};

    await request(app)
      .post(endpoint)
      .set('Authorization', 'Bearer ' + token)
      .send(invalidPayload)
      .expect(400, {
        error: 'invalid payload'
      })
  });

  // TEST: invalid payload 2
  test('should return a bad request for area request 2', async () => {
    const invalidPayload = {...payload, property: "invalid"};

    await request(app)
      .post(endpoint)
      .set('Authorization', 'Bearer ' + token)
      .send(invalidPayload)
      .expect(400, {
        error: 'invalid payload'
      })
  });

  // TEST: already exists area
  test('should return a conflict status for already exist place', async () => {
    await request(app)
      .post(endpoint)
      .set('Authorization', 'Bearer ' + token)
      .send({...payload, name: duplicateAreaName})
      .expect(409, {
        error: "area already exists"
      })
  });

  // TEST: unathorizate request
  test('should return a forbbiden status', async () => {
    const invalidToken = 'invalid'

    await request(app)
      .post(endpoint)
      .set('Authorization', 'Bearer ' + invalidToken)
      .send(payload)
      .expect(403)
  });
});