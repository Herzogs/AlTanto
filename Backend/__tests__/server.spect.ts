import supertest from 'supertest'
import server from '../src/server'

describe('GET /', () => {
  it('should return 404 Not Found', async () => {
    const response = await supertest(server).get('/')
    expect(response.status).toBe(404)
  })
})

