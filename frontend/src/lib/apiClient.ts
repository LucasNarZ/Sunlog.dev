import axios from 'axios'

const isServer = typeof window === 'undefined'


export const apiClient = axios.create({
  baseURL: isServer ? "http://nginx/api" : "/api",
})