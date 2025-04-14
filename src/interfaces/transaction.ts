// types/transaction.ts
export interface ITransaction {
  id: number;
  sender_id: string;
  receiver_id: string;
  amount: number | null;
  process_time_secondes: number;
  kind_op: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  sender_id: string;
  receiver_id: string;
  amount: number | null;
  process_time_secondes: number;
  kind_op: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionResponse {
  data: Transaction[];
}
