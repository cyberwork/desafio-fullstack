import api from './api'
import { Contract, Plan } from '../types'

export const getActiveContract = async (): Promise<Contract | null> => {
  try {
    const response = await api.get('/contracts/active')
    return response.data
  } catch (error) {
    return null
  }
}

export const getPlans = async (): Promise<Plan[]> => {
  const response = await api.get('/plans')
  return response.data
}

export const subscribeToPlan = async (planId: number, startDate: string): Promise<Contract> => {
  const response = await api.post('/contracts', {
    plan_id: planId,
    start_date: startDate
  })
  return response.data
}

export const switchPlan = async (planId: number): Promise<Contract> => {
  const response = await api.post('/contracts/switch-plan', {
    plan_id: planId
  })
  return response.data
}
