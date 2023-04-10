import request from "supertest";
import app from '../../../server';
import { UserService } from "../../../services/users";
import { PlaceService } from "../../../services/places";

describe('### DELETE ###', () => {
    const user = new UserService('admin@email.com', 'pass');
    const endpoint = '/places/';
    const data = {
      name: "PLACE DELETE 1",
      latitude: "54.342",
      longitude: "-74.3"
    };

    const place = new PlaceService(data, 'POST');


    // TEST: delete a place correctly
    test('should return a confirmation of deletion', async () => {
      const id = (await place.createPlace())!.dataValues.id;

      await user.getUserInstance();
      const token = await user.signToken();

      await request(app)
        .delete(endpoint + id)
        .set('Authorization', 'Bearer ' + token)
        .expect(204)
    });

    // TEST: delete a place that not exists
    test('should return not exists place\'s id', async () => {
      const id = 10;

      await user.getUserInstance();
      const token = await user.signToken();

      await request(app)
        .delete(endpoint + id)
        .set('Authorization', 'Bearer ' + token)
        .expect(404, {
          error: "place id not found"
        });
    });

    // TEST: delete a place with invalid id
    test('should return a invalid id error', async () => {
      const id = 'stiste';

      await user.getUserInstance();
      const token = await user.signToken();

      await request(app)
        .delete(endpoint + id)
        .set('Authorization', 'Bearer ' + token)
        .expect(400, {
          error: "invalid parameter"
        })
    });

    // TEST: unathorizate delete request
    test('should return a forbbiden status', async () => {
      const id = 1;

      await request(app)
        .delete(endpoint + id)
        .expect(403);
    });

  });