import request from "supertest";
import app from '../../../server';
import * as jwt from 'jsonwebtoken';
import { User } from "../../../database/models/User";
import { Place } from "../../../database/models/Place";

describe('### DELETE ###', () => {
  let endpoint: string;
  let token:string;
  let id:number;

  beforeAll(async () => {
    endpoint = '/places/';

    const user = await User.create({
      email: "user@email.com",
      name: "user",
      password: "pass"
    })

    const place = await Place.create({
      name: "PLACE DELETE 1",
      point: {
        type: "Point",
        coordinates: [-74.3, 54.342]
      }
    });

    token = jwt.sign({
      email: user.dataValues.email
    }, process.env.JWT_SECRET_KEY as string, {
      "expiresIn": '10m'
    });

    id = place.dataValues.id;

  });


  // TEST: delete a place correctly
  test('should return a confirmation of deletion', async () => {
    await request(app)
      .delete(endpoint + id)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)
  });

  // TEST: delete a place that not exists
  test('should return not exists place\'s id', async () => {
    const idInvalid = 100;

    await request(app)
      .delete(endpoint + idInvalid)
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        error: "place id not found"
      });
  });

  // TEST: delete a place with invalid id
  test('should return a invalid id error', async () => {
    const idInvalid = 'stiste';

    await request(app)
      .delete(endpoint + idInvalid)
      .set('Authorization', 'Bearer ' + token)
      .expect(400, {
        error: "invalid parameter"
      })
  });

  // TEST: unathorizate delete request
  test('should return a forbbiden status', async () => {
    await request(app)
      .delete(endpoint + id)
      .expect(403);
  });

});