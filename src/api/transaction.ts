// // services/api.ts
import { get } from "../hooks/request";
import { TransactionResponse } from "../interfaces/transaction";


export const fetchTransactions = async (): Promise<TransactionResponse> => {
  const url = `/payment_manage/transactions/allExchanges`;

  const response = await get(url);
  if (!response) {
    throw new Error("Erreur lors de la récupération des transactions.");
  }
  return { data: response };
};




// import axios from 'axios';
// import { ITransaction } from '../interfaces/transaction';

// const API_URL = 'http://emes.bj:10001/api/';

// export const fetchTransactions = async (): Promise<ITransaction[]> => {
//   const response = await axios.get(API_URL);
//   // On filtre pour ne garder que les champs nécessaires
//   return response.data.map((transaction: any) => ({
//     id: transaction.id,
//     sender_id: transaction.sender_id,
//     receiver_id: transaction.receiver_id,
//     amount: transaction.amount,
//     process_time_secondes: transaction.process_time_secondes,
//     kind_op: transaction.kind_op,
//     status: transaction.status,
//     createdAt: transaction.createdAt,
//     updatedAt: transaction.updatedAt
//   }));
// };
