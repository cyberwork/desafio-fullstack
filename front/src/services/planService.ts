import api from './api'
import { Plan } from '../types'

export const getPlans = async (): Promise<Plan[]> => {
  const response = await api.get('/plans')
  return response.data
}
