import request from 'supertest';
import app from '../../../server';
import * as jwt from 'jsonwebtoken';
import { Place } from '../../../database/models/Place';
import { User } from '../../../database/models/User';

describe('Places Tests: Distanceto', () => {
  let placesEndpoint: string;
  let distanceToEndpoint: string;
  let id1: number;
  let id2: number;
  let token: string;

  beforeAll(async () => {
    placesEndpoint = '/places/';
    distanceToEndpoint = '/distanceto/'

    const user = await User.create({
      name: 'user',
      email: 'user@email.com',
      password: 'pass'
    });

    const placeOne = await Place.create({
      name: 'pointD1',
      point: {
        type: 'Point',
        coordinates: [12.5, 93.4]
      }
    });

    const placeTwo = await Place.create({
      name: 'pointD2',
      point: {
        type: 'Point',
        coordinates: [65.32, 88.3]
      }
    });

    id1 = placeOne.dataValues.id;
    id2 = placeTwo.dataValues.id;

    token = jwt.sign({
      email: user.dataValues.email
    }, process.env.JWT_SECRET_KEY as string, {
      "expiresIn": '10m'
    });

  });

  // TEST: 'Distance to' request success
  test('should return a distance between two points', async () => {
    await request(app)
      .get(placesEndpoint + id1 + distanceToEndpoint + id2)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  // TEST: not found id 1
  test('should return a not found place', async () => {
    const idInvalid = id1 + 100;

    await request(app)
      .get(placesEndpoint + idInvalid + distanceToEndpoint + id2)
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        error: "place not found"
      });
  });

  // TEST: not found id 2
  test('should return a not found place 2', async () => {
    const idInvalid = id2 + 100;

    await request(app)
      .get(placesEndpoint + id1 + distanceToEndpoint + idInvalid)
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        error: "place not found"
      })
  });

  // TEST: invalid id 1
  test('should return a bad request for invalid id 1', async () => {
    const idInvalid = 'invalid';

    await request(app)
      .get(placesEndpoint + idInvalid + distanceToEndpoint + id2)
      .set('Authorization', 'Bearer ' + token)
      .expect(400, {
        error: "invalid parameter"
      })
  });

  // TEST: invalid id 2
  test('should return a bad request for invalid id 2', async () =>{
    const idInvalid = 'invalid';

    await request(app)
      .get(placesEndpoint + id1 + distanceToEndpoint + idInvalid)
      .set('Authorization', 'Bearer ' + token)
      .expect(400, {
        error: 'invalid parameter'
      })
  })

  // TEST: unauthorizate request
  test('should return a forbbiden status', async () =>{
    await request(app)
      .get(placesEndpoint + id1 + distanceToEndpoint + id2)
      .expect(403)
  });

});