import { get } from "../hooks/request";
import { KycResponse } from "../interfaces/KycRequest";
import { TransactionResponse } from "../interfaces/transaction";

export const fetchKycRequests = async (): Promise<KycResponse> => {
  const url = `/payment_manage/requests/allrequests_2`;

  const response = await get(url);
  if (!response) {
    throw new Error("Erreur lors de la récupération des requêtes KYC.");
  }

  return response;
};
