import { MerchantTable } from "../../components/tables/MerchantTable";
import { useQuery } from "@tanstack/react-query";
import { Merchant } from "../../interfaces/Merchant";
import { fetchMerchants } from "../../api/merchants";

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

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Liste des marchands</h1>
      <MerchantTable data={data} isLoading={isLoading} isError={isError} />
    </div>
  );
};
