import axios from "axios"
import { DEV } from "../../constants"

let authTokens = ''
export async function setToken(token) {
  authTokens = await token
  return await true
}

export const Request = async (type, url, params) => {
  return new Promise((resolve, reject) => {
    _Request(type, url, params)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const _Request = async (type, url, params = {}) => {
  const _axios = axios.create({
    baseURL: DEV.BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
      "authToken": authTokens
    },
  })
  return _axios[type](url, params)
}