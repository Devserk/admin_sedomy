// Fichier: hooks/useTransactions.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Transaction, TransactionResponse } from "../interfaces/transaction";

// const http = axios.create({
// 	baseURL: import.meta.env.VITE_API_BASE_URL,
// 	headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
// });

const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await axios.get<TransactionResponse>(
    "http://emes.bj:10001/api/payment_manage/transactions/allExchanges",
  );

  // Filtrage des champs que nous voulons garder
  return response.data.data.map((transaction) => ({
    id: transaction.id,
    sender_id: transaction.sender_id,
    receiver_id: transaction.receiver_id,
    amount: transaction.amount,
    process_time_secondes: transaction.process_time_secondes,
    kind_op: transaction.kind_op,
    status: transaction.status,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
  }));
};

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });
};
