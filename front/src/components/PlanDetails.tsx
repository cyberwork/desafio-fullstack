import { useState } from 'react'
import { Plan } from '../types'
import { subscribeToPlan } from '../services/contractService'

interface PlanDetailsProps {
  plan: Plan
  onSubscribe: () => void
}

export const PlanDetails = ({ plan, onSubscribe }: PlanDetailsProps) => {
  const [startDate, setStartDate] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubscribe = async () => {
    if (!startDate) {
      setError('Por favor, selecione uma data de início.')
      return
    }

    setSubscribing(true)
    setError(null)
    setSuccess(false)

    try {
      await subscribeToPlan(plan.id, startDate)
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
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Data de Início:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          disabled={subscribing}
        />
      </div>
      <button
        onClick={handleSubscribe}
        disabled={subscribing || !startDate}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
          subscribing || !startDate ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {subscribing ? 'Assinando...' : 'Assinar Plano'}
      </button>
    </div>
  )
}
