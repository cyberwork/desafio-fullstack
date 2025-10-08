import api from './api'
import {Contract, Payment} from '../types'

export interface ContractWithPayment extends Contract {
    payments: Payment[];
}

export const getContractHistory = async (): Promise<ContractWithPayment[]> => {
    const response = await api.get('/contracts')
    const contracts = response.data;

    // Para cada contrato, obter os pagamentos
    return await Promise.all(
        contracts.map(async (contract: Contract) => {
            const paymentResponse = await api.get(`/payments/contract/${contract.id}`);
            return {
                ...contract,
                payments: paymentResponse.data
            };
        })
    );
}