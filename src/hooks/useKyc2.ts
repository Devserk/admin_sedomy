import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MerchantActionParams } from "../interfaces/Merchant";
import toast from "react-hot-toast";
import { KycRequestApi } from "../api/kyc";

export const useRequestKycActions = () => {
  const queryClient = useQueryClient();

  const baseConfig = {
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc-requests"] });
      queryClient.invalidateQueries({ queryKey: ["kyc-data"] });
    },
  };

  // Mutation de rejet
  const rejectKycMutation = useMutation({
    mutationFn: (params: MerchantActionParams) =>
      KycRequestApi.rejectKyc2(params),
    // onMutate: () => {
    //   toast.loading("Rejet de la requête en cours...", { id: "rejet" });
    // },
    onSuccess: () => {
      toast.success("Demande rejetée avec succès !", {
        duration: 10000, // 5000 ms = 5 secondes
      });
    },
    onError: (error) => {
      toast.error(`Échec du rejet : ${error.message}`);
    },
    ...baseConfig,
  });

  // Mutation de validation
  const validateKycMutation = useMutation({
    mutationFn: (params: MerchantActionParams) =>
      KycRequestApi.validateKyc2(params),
    // onMutate: () => {
    //   toast.loading("Validation de la requête en cours...", {
    //     id: "validation",
    //   });
    // },
    onSuccess: () => {
      toast.success("Marchand validé avec succès !", {
        duration: 10000, // 5000 ms = 5 secondes
      });
    },
    onError: (error) => {
      toast.error(`Échec de la validation : ${error.message}`);
    },
    ...baseConfig,
  });

  return {
    rejectKycMutation,
    validateKycMutation,
  };
};
