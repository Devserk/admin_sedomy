import { get, put } from "../hooks/request";
import {
  ApiResponse,
  GetRequestDataParams,
  KycRequestResponse,
} from "../interfaces/KycRequest";
import { MerchantActionParams } from "../interfaces/Merchant";
// import { KycResponse } from "../interfaces/KycRequest";

export const fetchKyc3Requests = async (): Promise<KycRequestResponse> => {
  const url = `/payment_manage/requests/allrequests_3`;

  const response = await get(url);
  if (!response) {
    throw new Error("Erreur lors de la récupération des requêtes KYC de niveau 3.");
  }

  return response;
};

export const fetchKycRequestsById = async (
  params: GetRequestDataParams
): Promise<ApiResponse> => {
  const url = `/payment_manage/requests/request_by_id/${params.id}`;
  const response = await get(url);

  if (!response) {
    throw new Error(
      "Erreur lors de la récupération de la requête KYC : " + params.id
    );
  }

  return response;
};

export const KycRequestApi = {
  rejectKyc2: async ({ id }: MerchantActionParams): Promise<ApiResponse> => {
    const { data, error } = await put<ApiResponse>(
      `https://emes.bj:10001/api/payment_manage/requests/reject_request/${id}`
    );

    if (error) throw new Error(error);
    console.error("Détails des erreurs du validate", error);
    return data!;
  },

  validateKyc2: async ({ id }: MerchantActionParams): Promise<ApiResponse> => {
    const { data, error } = await put<ApiResponse>(
      `https://emes.bj:10001/api/payment_manage/requests/valid_request/${id}`
    );

    if (error) throw new Error(error);
    console.error("Détails des erreurs du reject:", error);
    return data!;
  },
};
