import { useQuery } from "@tanstack/react-query";
import { KycRequest } from "../../interfaces/KycRequest";
// import { fetchKycRequests } from "../../api/kyc";
import { KycRequestTable } from "../../components/tables/KycRequestTable";
import { fetchKyc3Requests } from "../../api/kyc3";
import { SearchInput } from "../../components/SearchInput";
import { useState } from "react";

export const useKycRequests = () => {
  return useQuery<KycRequest[], Error>({
    queryKey: ["kyc-requests"],
    queryFn: async () => {
      const response = await fetchKyc3Requests();
      return response.data;
    },
  });
};

export const Kyc3Page = () => {
  const { data = [], isLoading, isError } = useKycRequests();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((kyc3Request) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      kyc3Request.user.nom.toLowerCase().includes(lowerSearch) ||
      kyc3Request.user.prenom.toLowerCase().includes(lowerSearch) ||
      kyc3Request.status.toLowerCase().includes(lowerSearch) ||
      kyc3Request.kind_op?.toLowerCase().includes(lowerSearch) ||
      (kyc3Request.createdAt
        ? new Date(kyc3Request.createdAt)
            .toLocaleString()
            .toLowerCase()
            .includes(lowerSearch)
        : false) ||
      (kyc3Request.updatedAt
        ? new Date(kyc3Request.updatedAt)
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
