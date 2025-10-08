import React, { useState, useEffect } from 'react';
import { getContractHistory, ContractWithPayment } from '../services/contractHistoryService';

const ContractHistory: React.FC = () => {
    const [contracts, setContracts] = useState<ContractWithPayment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContractHistory = async () => {
            try {
                const data = await getContractHistory();
                setContracts(data);
                setLoading(false);
            } catch (err) {
                setError('Erro ao carregar o histórico de contratos');
                setLoading(false);
            }
        };

        fetchContractHistory();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Histórico de Planos</h2>

            {contracts.length === 0 ? (
                <p className="text-gray-600 text-center">Nenhum plano assinado até o momento.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descrição do Plano
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Valor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Desconto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data de Pagamento
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {contracts.map((contract) => {
                            // Assumindo que cada contrato tem apenas um pagamento
                            const payment = contract.payments && contract.payments.length > 0 ? contract.payments[0] : null;

                            // Calcular o desconto com base no valor original do plano e no valor pago
                            const originalPrice = parseFloat(contract.plan?.price || '0');
                            const paidAmount = payment ? parseFloat(payment.amount) : 0;
                            const discount = originalPrice > paidAmount ? originalPrice - paidAmount : 0;

                            return <tr key={contract.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{contract.plan?.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">R$ {contract.plan?.price}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">R$ {discount.toFixed(2)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {contract.active
                                            ? 'Ativo'
                                            : 'Inativo'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {payment
                                            ? new Date(payment.created_at).toLocaleDateString('pt-BR')
                                            : 'N/A'
                                        }
                                    </div>
                                </td>
                            </tr>;
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ContractHistory;
