import { useQuery } from "@tanstack/react-query";
import { Command } from "../../interfaces/orders";
import { fetchAllOrders } from "../../api/orders";
import { AllOrdersTable } from "../../components/tables/AllOrdersTable";
import { useState } from "react";
import { SearchInput } from "../../components/SearchInput";

// export const useKycRequests = () => {
//   return useQuery<KycRequest[], Error>({
//     queryKey: ["kyc-requests"],
//     queryFn: async () => {
//       const response = await fetchKycRequests();
//       return response.data;
//     },
//   });
// };

export const useCommands = () => {
  return useQuery<Command[], Error>({
    queryKey: ["commands"],

    queryFn: async () => {
      const response = await fetchAllOrders();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const AllOrders = () => {
  const { data, isLoading, isError } = useCommands();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = (data || []).filter((command) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      command.merchant_payment_id.toLowerCase().includes(lowerSearch) ||
      command.buyer_payment_id.toLowerCase().includes(lowerSearch) ||
      command.product.nom_produit.toLowerCase().includes(lowerSearch) ||
      command.quantity.toString().toLowerCase().includes(lowerSearch) ||
      command.cost.toString().toLowerCase().includes(lowerSearch) ||
      command.status.toLowerCase().includes(lowerSearch) ||
      (command.createdAt
        ? new Date(command.createdAt)
            .toLocaleString()
            .toLowerCase()
            .includes(lowerSearch)
        : false) ||
      (command.updatedAt
        ? new Date(command.updatedAt)
            .toLocaleString()
            .toLowerCase()
            .includes(lowerSearch)
        : false)
    );
  });

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Liste des Commandes </h1>

      <SearchInput
        onSearch={setSearchTerm}
        placeholder="Rechercher par nom, prénom statut..."
      />

      <AllOrdersTable
        data={filteredData || []}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};
