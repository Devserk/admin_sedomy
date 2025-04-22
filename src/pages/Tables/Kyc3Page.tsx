import { useQuery } from "@tanstack/react-query";
import { KycRequest } from "../../interfaces/KycRequest";
// import { fetchKycRequests } from "../../api/kyc";
import { KycRequestTable } from "../../components/tables/KycRequestTable";
import { fetchKyc3Requests } from "../../api/kyc3";

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

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Liste des demandes </h1>
      <KycRequestTable data={data} isLoading={isLoading} isError={isError} />
    </div>
  );
};
