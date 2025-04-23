import { useQuery } from "@tanstack/react-query";
import { KycRequest } from "../../interfaces/KycRequest";
import { fetchKycRequests } from "../../api/kyc";
import { KycRequestTable } from "../../components/tables/KycRequestTable";
import { useState } from "react";
import { SearchInput } from "../../components/SearchInput";

export const useKycRequests = () => {
  return useQuery<KycRequest[], Error>({
    queryKey: ["kyc-requests"],
    queryFn: async () => {
      const response = await fetchKycRequests();
      return response.data;
    },
  });
};

export const Kyc2Page = () => {
  const { data = [], isLoading, isError } = useKycRequests();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((kyc2Request) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      kyc2Request.user.nom.toLowerCase().includes(lowerSearch) ||
      kyc2Request.user.prenom.toLowerCase().includes(lowerSearch) ||
      kyc2Request.status.toLowerCase().includes(lowerSearch) ||
      kyc2Request.kind_op?.toLowerCase().includes(lowerSearch) ||
      (kyc2Request.createdAt
        ? new Date(kyc2Request.createdAt)
            .toLocaleString()
            .toLowerCase()
            .includes(lowerSearch)
        : false) ||
      (kyc2Request.updatedAt
        ? new Date(kyc2Request.updatedAt)
            .toLocaleString()
            .toLowerCase()
            .includes(lowerSearch)
        : false)
    );
  });

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Liste des demandes </h1>

      <SearchInput
        onSearch={setSearchTerm}
        placeholder="Rechercher par nom, prénom statut..."
      />

      <KycRequestTable
        data={filteredData}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};
