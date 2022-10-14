import * as request from 'supertest';
import { url, makeUsers, deleteUsers } from '../../../test/utils';

describe('friends api endpoints', () => {
  beforeAll(async () => {
    await makeUsers(2);
  });

  afterAll(async () => {
    await deleteUsers(2);
  });

  it('user should have 0 friends', async () => {
    await request(url).get('users/1/friends').expect({});
  });
});
