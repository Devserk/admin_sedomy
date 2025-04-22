import { useQuery } from "@tanstack/react-query";
import { Command, CommandsResponse } from "../../interfaces/orders";
import { fetchAllOrders } from "../../api/orders";
import { AllOrdersTable } from "../../components/tables/AllOrdersTable";

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

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Liste des Commandes </h1>
      <AllOrdersTable
        data={data || []}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};
