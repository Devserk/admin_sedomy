import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "../../api/transaction";
import { TransactionTable } from "../../components/tables/TransactionTable";
import { Transaction } from "../../interfaces/transaction";
import { useState } from "react";
import { SearchInput } from "../../components/SearchInput";

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

  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((transaction) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      transaction.sender_id.toLowerCase().includes(lowerSearch) ||
      transaction.receiver_id.toLowerCase().includes(lowerSearch) ||
      transaction.status.toLowerCase().includes(lowerSearch) ||
      transaction.kind_op?.toLowerCase().includes(lowerSearch) ||
      transaction.amount?.toString().includes(lowerSearch) ||
      (transaction.createdAt
        ? new Date(transaction.createdAt)
            .toLocaleString()
            .toLowerCase()
            .includes(lowerSearch)
        : false) ||
      (transaction.updatedAt
        ? new Date(transaction.updatedAt)
            .toLocaleString()
            .toLowerCase()
            .includes(lowerSearch)
        : false)
    );
  });

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>
      <SearchInput
        onSearch={setSearchTerm}
        placeholder="Rechercher par ID d'expéditeur ou destinataire..."
      />

      <TransactionTable
        data={filteredData}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};
