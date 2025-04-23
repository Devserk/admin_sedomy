import { MerchantTable } from "../../components/tables/MerchantTable";
import { useQuery } from "@tanstack/react-query";
import { Merchant } from "../../interfaces/Merchant";
import { fetchMerchants } from "../../api/merchants";
import { useState } from "react";
import { SearchInput } from "../../components/SearchInput";

export const useMerchants = () => {
  return useQuery<Merchant[], Error>({
    queryKey: ["merchants"],
    queryFn: async () => {
      const response = await fetchMerchants();
      return response.data;
    },
  });
};

export const MerchantsPage = () => {
  const { data = [], isLoading, isError } = useMerchants();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((merchant) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      merchant.nom.toLowerCase().includes(lowerSearch) ||
      merchant.prenom.toLowerCase().includes(lowerSearch) ||
      merchant.phoneNumber?.toString().includes(lowerSearch)
    );
  });

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Liste des marchands</h1>

      <SearchInput
        onSearch={setSearchTerm}
        placeholder="Rechercher par nom, prénom statut..."
      />

      <MerchantTable
        data={filteredData}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};
