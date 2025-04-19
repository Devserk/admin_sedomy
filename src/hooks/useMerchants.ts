import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MerchantApi } from "../api/merchants";
import { MerchantActionParams } from "../interfaces/Merchant";
import toast from "react-hot-toast";

export const useMerchantActions = () => {
  const queryClient = useQueryClient();

  const baseConfig = {
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      queryClient.invalidateQueries({ queryKey: ["merchant-details"] });
    },
  };

  // Mutation de rejet
  const rejectMutation = useMutation({
    mutationFn: (params: MerchantActionParams) =>
      MerchantApi.rejectMerchant(params),
    onMutate: () => {
      toast.loading("Rejet de la requête en cours...", { id: "rejet" });
    },
    onSuccess: () => {
      toast.success("Demande rejetée avec succès !");
    },
    onError: (error) => {
      toast.error(`Échec du rejet : ${error.message}`);
    },
    ...baseConfig,
  });

  // Mutation de validation
  const validateMutation = useMutation({
    mutationFn: (params: MerchantActionParams) =>
      MerchantApi.validateMerchant(params),
    onMutate: () => {
      toast.loading("Validation de la requête en cours...", {
        id: "validation",
      });
    },
    onSuccess: () => {
      toast.success("Marchand validé avec succès !");
    },
    onError: (error) => {
      toast.error(`Échec de la validation : ${error.message}`);
    },
    ...baseConfig,
  });

  return {
    rejectMutation,
    validateMutation,
  };
};
