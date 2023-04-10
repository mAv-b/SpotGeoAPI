import request from "supertest";
import app from '../../../server';
import { Place } from "../../../database/models/Place";
import { User } from "../../../database/models/User";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

describe('### GET ###', () => {
  let endpoint: string;
  let token: string;
  let id: number;

  beforeAll(async () => {
    endpoint = '/places/';

    const user = await User.create({
      email: "user@email.com",
      name: "user",
      password: "pass"
    });

    const place = await Place.create({
      name: "get place test 5",
      point: {
        type: "Point",
        coordinates: [45.3, 10.53]
      }
    });

    token = jwt.sign({
      email: user.dataValues.email
    }, process.env.JWT_SECRET_KEY as string, {
      "expiresIn": '10m'
    });

    id = place.dataValues.id;
  });


  // TEST: get place by id
  test('should return a place with that id', async () => {
    await request(app)
      .get(endpoint + id)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  });

  // TEST: get all places
  test('should return all places', async () => {
    await request(app)
      .get(endpoint)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  });

  // TEST: unauthorized request for all place
  test('should return a forbbiden status', async () => {
    const tokenInvalid = 'invalid token';

    await request(app)
      .get(endpoint)
      .set('Authorization', tokenInvalid)
      .expect(403)
  });

  // TEST: unauthorized request for one place
  test('should return a forbbiden status', async () => {
    await request(app)
      .get(endpoint + id)
      .expect(403)
  });

});
