import request from "supertest";
import app from '../../../server';
import { UserService } from "../../../services/users";

describe('### POST ###', () => {
    const user = new UserService("admin@email.com", "pass")
    const endpoint = '/places/';
    const payload = {
      name: "Plaza Teste 901",
      latitude: "23.5",
      longitude: "9.3"
    }

    // TEST: create a place
    test('should return a place created in database in GeoJSON', async () => {
      await user.getUserInstance();
      const token = await user.signToken();

      await request(app)
        .post(endpoint)
        .set('Authorization', 'Bearer ' + token)
        .send(payload)
        .expect(201);
    });

    // TEST: invalid body place 1
    test('should return a bad request for invalid body', async () => {
      await user.getUserInstance();
      const token = await user.signToken();

      await request(app)
        .post(endpoint)
        .set('Authorization', 'Bearer ' + token)
        .send({...payload, property: "value"})
        .expect(400, {
          error: "invalid payload request"
        });
    });

    // TEST: invalid body place 2
    test('should return a bad request for a missing property', async () => {
      await user.getUserInstance();
      const token = await user.signToken();

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

      await request(app)
        .post(endpoint)
        .set('Authorization', 'invalid token')
        .send(payload)
        .expect(403, {
          error: "Forbbiden request"
        })
    });
  });
