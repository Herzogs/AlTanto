import supertest from 'supertest'
import {server, app} from '../src/server'

describe.skip('GET /', () => {
  it('should return 404 Not Found', async () => { 
    const response = await supertest(server).get('/');
    expect(response.status).toBe(404)
  });

  afterAll(() => {
    app.close()
  })
});

