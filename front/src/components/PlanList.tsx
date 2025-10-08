import { useEffect, useState } from 'react'
import { Plan, Contract } from '../types'
import { getPlans } from '../services/planService'
import { PlanDetails } from './PlanDetails'
import { getActiveContract } from '../services/contractService'

export const PlanList = () => {
  const [plans, setPlans] = useState<Plan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [activeContract, setActiveContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPlans = async () => {
    try {
      const plansData = await getPlans()
      setPlans(plansData)
    } catch (error) {
      console.error('Erro ao buscar planos:', error)
    } finally {
      setLoading(false)
    }
  }

    const fetchActiveContract = async () => {
        try {
            const activeContractData = await getActiveContract()
            setActiveContract(activeContractData)
            console.log(activeContract)
        } catch (error) {
            console.error('Erro ao buscar contrato ativo:', error)
        } finally {
            setLoading(false)
        }
    }

  useEffect(() => {
    fetchPlans()
    fetchActiveContract()
  }, [])

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan)
  }

  const handleSubscribe = () => {
    // Atualizar a lista de planos após a assinatura
    setSelectedPlan(null)
    // Recarregar os planos para refletir as mudanças
    fetchPlans()
  }

  if (loading) {
    return <div>Carregando planos...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Planos Disponíveis</h2>
      {selectedPlan ? (
        <PlanDetails plan={selectedPlan} contract={activeContract} onSubscribe={handleSubscribe} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2">{plan.description} {plan.id != activeContract?.plan_id ? '' : '(PLANO ATUAL)'}</h3>
              <div className="mb-2">
                <span className="text-gray-700 font-bold">Clientes:</span>
                <span className="text-gray-800 ml-2">{plan.numberOfClients}</span>
              </div>
              <div className="mb-2">
                <span className="text-gray-700 font-bold">Armazenamento:</span>
                <span className="text-gray-800 ml-2">{plan.gigabytesStorage} GB</span>
              </div>
              <div className="mb-4">
                <span className="text-gray-700 font-bold">Preço:</span>
                <span className="text-gray-800 ml-2">R$ {plan.price}</span>
              </div>
              <button
                onClick={() => handleSelectPlan(plan)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                  {activeContract?.plan_id ?
                      (plan.id != activeContract.plan_id ? 'Trocar Plano' : 'Assinar Plano')
                      : 'Assinar Plano'
                  }
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
