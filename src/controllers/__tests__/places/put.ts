import request from "supertest";
import app from '../../../server';
import { UserService } from "../../../services/users";
import { Place } from "../../../database/models/Place";

describe('### PUT ###', () => {
    const user = new UserService('admin@email.com', 'pass');
    const endpoint = '/places/';

    const data = {
      name: "DELETE PLACE 1",
      point: {
        type: "Point",
        coordinates: [89.3, 23.3]
      }
    }
    const payload = {
      name: "DELETE PLACE 1 CHANGE",
      latitude: "40.0",
      longitude: "40.0"
    }

    const place = Place.create(data);

    // TEST: edit place successfully
    test('should return a success edit place', async () => {
      // const id = (await place.createPlace()).dataValues.id;
      const id = (await place).dataValues.id;

      await user.getUserInstance();
      const token = await user.signToken();

      await request(app)
        .put(endpoint + id)
        .set('Authorization', 'Bearer ' + token)
        .send(payload)
        .expect(200);
    });

    // TEST: invalid payload for place put request 1
    test('should return a bad request for invalid payload 1', async () => {
      // const id = (await place.createPlace()).dataValues.id;
      const id = (await place).dataValues.id;

      await user.getUserInstance();
      const token = await user.signToken();

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
      // const id = (await place.createPlace()).dataValues.id;
      const id = (await place).dataValues.id;

      await user.getUserInstance();
      const token = await user.signToken();

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
      const id = 120;
      
      await user.getUserInstance();
      const token = await user.signToken();

      await request(app)
        .put(endpoint + id)
        .set('Authorization', 'Bearer ' + token)
        .send(payload)
        .expect(404, {
          error: "place not found"
        });
    });

    // TEST: edit a place with a invalid id
    test('should return a invalid id response', async ()=> {
      const id = 'invalid';

      await user.getUserInstance();
      const token = await user.signToken();

      await request(app)
        .put(endpoint + id)
        .set('Authorization', 'Bearer ' + token)
        .send(payload).
        expect(400, {
          error: 'invalid parameter'
        })
    });

    // TEST: unauthorizate request
    test('should return a forbbiden status', async () => {
      const id = (await place).dataValues.id;

      const token = 'invalid';

      await request(app)
        .put(endpoint + id)
        .set('Authorization', 'Bearer ' + token)
        .send(payload)
        .expect(403)
    });

  });
