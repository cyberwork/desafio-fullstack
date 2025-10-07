export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Plan {
  id: number;
  description: string;
  numberOfClients: number;
  gigabytesStorage: number;
  price: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: number;
  user_id: number;
  plan_id: number;
  start_date: string;
  end_date: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  plan?: Plan;
}

export interface Payment {
  id: number;
  contract_id: number;
  amount: string;
  due_date: string;
  payment_date: string | null;
  paid: boolean;
  created_at: string;
  updated_at: string;
  contract?: Contract;
}
