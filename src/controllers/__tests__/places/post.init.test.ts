import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import request from "supertest";
import app from '../../../server';
import { User } from "../../../database/models/User";

dotenv.config();

describe('Places Tests: POST', () => {
  let endpoint: string;
  let payload: any;
  let token: string;

  beforeAll(async () => {
    endpoint = '/places/';

    payload = {
      name: "Plaza Teste 901",
      latitude: "23.5",
      longitude: "9.3"
    }

    const user = await User.create({
      email: "user@email.com",
      name: "user",
      password: "pass"
    });

    token = jwt.sign({
      email: user.dataValues.email
    }, process.env.JWT_SECRET_KEY as string, {
      "expiresIn": '10m'
    });

  });

  // TEST: create a place
  test('should return a place created in database in GeoJSON', async () => {
    await request(app)
      .post(endpoint)
      .set('Authorization', 'Bearer ' + token)
      .send(payload)
      .expect(201);
  });

  // TEST: invalid body place 1
  test('should return a bad request for invalid body', async () => {
    await request(app)
      .post(endpoint)
      .set('Authorization', 'Bearer ' + token)
      .send({ ...payload, property: "value" })
      .expect(400, {
        error: "invalid payload request"
      });
  });

  // TEST: invalid body place 2
  test('should return a bad request for a missing property', async () => {
    await request(app)
      .post(endpoint)
      .set('Authorization', 'Bearer ' + token)
      .send({})
      .expect(400, {
        error: "invalid payload request"
      })
  })

  // TEST: unauthorized request
  test('should return a forbbiden status', async () => {
    const tokenInvalid = 'invalid token';

    await request(app)
      .post(endpoint)
      .set('Authorization', tokenInvalid)
      .send(payload)
      .expect(403, {
        error: "Forbbiden request"
      })
  });
});
