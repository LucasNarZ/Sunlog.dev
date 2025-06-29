import axios from 'axios'

const isServer = typeof window === 'undefined'

export const apiClient = axios.create({
  baseURL: isServer ? process.env.API_URL : process.env.NEXT_PUBLIC_API_URL,
})