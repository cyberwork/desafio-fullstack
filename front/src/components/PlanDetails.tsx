import { useState } from 'react'
import { Plan, Contract } from '../types'
import { subscribeToPlan, switchPlan } from '../services/contractService'

interface PlanDetailsProps {
  plan: Plan
  contract: Contract|null
  onSubscribe: () => void
}

export const PlanDetails = ({ plan, contract, onSubscribe }: PlanDetailsProps) => {
  const [subscribing, setSubscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubscribe = async () => {

    setSubscribing(true)
    setError(null)
    setSuccess(false)

    try {
      await subscribeToPlan(plan.id)
      setSuccess(true)
      onSubscribe()
    } catch (error: any) {
      setError(error.response?.data?.error || 'Erro ao assinar plano.')
    } finally {
      setSubscribing(false)
    }
  }
    const handleSwitch = async () => {

        setSubscribing(true)
        setError(null)
        setSuccess(false)

        try {
            await switchPlan(plan.id)
            setSuccess(true)
            onSubscribe()
        } catch (error: any) {
            setError(error.response?.data?.error || 'Erro ao assinar plano.')
        } finally {
            setSubscribing(false)
        }
    }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Detalhes do Plano</h2>
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Plano assinado com sucesso!
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Descrição:</label>
          <p className="text-gray-800">{plan.description}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Número de Clientes:</label>
          <p className="text-gray-800">{plan.numberOfClients}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Armazenamento:</label>
          <p className="text-gray-800">{plan.gigabytesStorage} GB</p>
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Preço:</label>
          <p className="text-gray-800">R$ {plan.price}</p>
        </div>
      </div>
      <button
        onClick={plan.id == contract?.plan_id ? handleSwitch : handleSubscribe}
        disabled={subscribing}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
          subscribing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
          {contract?.plan_id ?
                plan.id != contract.plan_id ? 'Trocar Plano' : 'Assinar Plano'
                : 'Assinar Plano'
          }
      </button>
    </div>
  )
}
