import api from './api'
import { User } from '../types'

export const getUser = async (): Promise<User> => {
  const response = await api.get('/user')
  return response.data
}
