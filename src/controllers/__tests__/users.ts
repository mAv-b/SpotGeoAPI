import request from "supertest";
import app from '../../server';

describe('### USER CONTROLLERS TESTS ###', () => {

  // TEST FOR GET A TOKEN
  test('should return a token for admin user', async () => {
    await request(app)
      .post('/users/login/')
      .send({
        email: "admin@email.com",
        password: "pass"
      })
      .expect(200);
  });

  // TEST FOR INVALID CREDENTIALS
  test('should return a invalid email and password', async () => {
    await request(app)
      .post('/users/login/')
      .send({
        email: "notadmin@email.com",
        password: "notpass"
      })
      .expect(404, {
        error: 'Email or Password are invalid.'
      });
  })
});