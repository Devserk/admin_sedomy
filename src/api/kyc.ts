import { get } from "../hooks/request";
import { ApiResponse, GetRequestDataParams, KycRequestResponse } from "../interfaces/KycRequest";
// import { KycResponse } from "../interfaces/KycRequest";

export const fetchKycRequests = async (): Promise<KycRequestResponse> => {
  const url = `/payment_manage/requests/allrequests_2`;

  const response = await get(url);
  if (!response) {
    throw new Error("Erreur lors de la récupération des requêtes KYC.");
  }

  return response;
};


export const fetchKycRequestsById = async (
  params: GetRequestDataParams,
): Promise<ApiResponse> => {
  const url = `/payment_manage/requests/request_by_id/${params.id}`;
  const response = await get(url);

  if (!response) {
    throw new Error("Erreur lors de la récupération de la requête KYC : " + params.id);
  }

  return response;
};
