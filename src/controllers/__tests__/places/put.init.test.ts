import request from "supertest";
import app from '../../../server';
import { Place } from "../../../database/models/Place";
import { User } from "../../../database/models/User";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

describe('### PUT ###', () => {
  let endpoint: string;
  let payload: any;
  let token: string;
  let id: number;

  beforeAll(async () => {
    endpoint = '/places/';

    payload = {
      name: "DELETE PLACE 1 CHANGE",
      latitude: "40.0",
      longitude: "40.0"
    }

    const user = await User.create({
      email: "user@email.com",
      name: "user",
      password: "pass"
    });

    const place = await Place.create({
      name: "PUT PLACE 1",
      point: {
        type: "Point",
        coordinates: [89.3, 23.3]
      }
    });

    token = jwt.sign({
      email: user.dataValues.email
    }, process.env.JWT_SECRET_KEY as string, {
      "expiresIn": '10m'
    });

    id = place.dataValues.id
  });

  // TEST: edit place successfully
  test('should return a success edit place', async () => {
    await request(app)
      .put(endpoint + id)
      .set('Authorization', 'Bearer ' + token)
      .send(payload)
      .expect(200);
  });

  // TEST: invalid payload for place put request 1
  test('should return a bad request for invalid payload 1', async () => {
    await request(app)
      .put(endpoint + id)
      .set('Authorization', 'Bearer ' + token)
      .send({
        ...payload,
        property: "value"
      })
      .expect(400, {
        error: "invalid payload request"
      })
  });

  // TEST: invalid payload for place put request 2
  test('should return a bad request for invalid payload 2', async () => {

    await request(app)
      .put(endpoint + id)
      .set('Authorization', 'Bearer ' + token)
      .send({
        "property": "value"
      })
      .expect(400, {
        error: "invalid payload request"
      })
  });

  // TEST: edit a place that not exists
  test('should return a not exists place\'s id', async () => {
    const idInvalid = id + 100;

    await request(app)
      .put(endpoint + idInvalid)
      .set('Authorization', 'Bearer ' + token)
      .send(payload)
      .expect(404, {
        error: "place not found"
      });
  });

  // TEST: edit a place with a invalid id
  test('should return a invalid id response', async () => {
    const idInvalid = 'invalid';

    await request(app)
      .put(endpoint + idInvalid)
      .set('Authorization', 'Bearer ' + token)
      .send(payload).
      expect(400, {
        error: 'invalid parameter'
      })
  });

  // TEST: unauthorizate request
  test('should return a forbbiden status', async () => {
    const tokenInvalid = 'invalid';

    await request(app)
      .put(endpoint + id)
      .set('Authorization', 'Bearer ' + tokenInvalid)
      .send(payload)
      .expect(403)
  });

});
