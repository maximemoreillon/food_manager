import request from "supertest"
import { expect } from "chai"
import axios from "axios"
import { app } from "../index"

let jwt: string, image_id: string

const {
  LOGIN_URL = "http://users/auth/login",
  TEST_USER_USERNAME,
  TEST_USER_PASSWORD,
} = process.env

const login = async () => {
  const body = {
    username: TEST_USER_USERNAME,
    password: TEST_USER_PASSWORD,
  }
  const {
    data: { jwt },
  } = await axios.post(LOGIN_URL, body)
  return jwt
}

describe("/", async () => {
  before(async () => {
    // Silencing console
    //console.log = () => {}
    // jwt = await login()
  })

  describe("GET /", () => {
    it("Should respond with app info", async () => {
      const { status } = await request(app).get(`/`)

      expect(status).to.equal(200)
    })
  })
})
