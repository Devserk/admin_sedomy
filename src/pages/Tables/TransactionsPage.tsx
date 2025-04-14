import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "../../api/transaction";
import { TransactionTable } from "../../components/tables/TransactionTable";
import { Transaction } from "../../interfaces/transaction";

export const useTransactions = () => {
  return useQuery<Transaction[], Error>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await fetchTransactions();
      return response.data;
    },
  });
};

export const TransactionsPage = () => {
  const { data = [], isLoading, isError } = useTransactions();

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>
      <TransactionTable data={data} isLoading={isLoading} isError={isError} />
    </div>
  );
};
