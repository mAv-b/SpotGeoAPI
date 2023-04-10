import request from "supertest";
import app from '../../../server';
import { UserService } from "../../../services/users";
import { PlaceService } from "../../../services/places";

describe('### GET ###', () => {
    const user = new UserService("admin@email.com", "pass")
    const endpoint = '/places/';
    const data = {
      name: "get place test 5",
      latitude: "45.3",
      longitude: "10.53"
    };

    const place = new PlaceService(data, 'POST');

    // TEST: get place by id
    test('should return a place with that id', async () => {
      const id = (await place.createPlace())!.dataValues.id;

      await user.getUserInstance();
      const token = await user.signToken();

      await request(app)
        .get(endpoint + id)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
    });

    // TEST: get all places
    test('should return all places', async () => {
      await user.getUserInstance();
      const token = await user.signToken();

      await request(app)
        .get(endpoint)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
    });

    // TEST: unauthorized request for all place
    test('should return a forbbiden status', async () => {
      await request(app)
        .get(endpoint)
        .set('Authorization', 'invalid token')
        .expect(403)
    });

    // TEST: unauthorized request for one place
    test('should return a forbbiden status', async () => {
      await request(app)
        .get(endpoint + '1')
        .expect(403)
    });

  });
