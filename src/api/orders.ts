import { get } from "../hooks/request";
import {
  ApiResponse,
  GetRequestDataParams,
  KycRequestResponse,
} from "../interfaces/KycRequest";
import { CommandsResponse } from "../interfaces/orders";

export const fetchAllOrders = async (): Promise<CommandsResponse> => {
  const url = `https://emes.bj:10002/api/market_manage/commands/commands/`;

  const response = await get(url);
  if (!response) {
    throw new Error("Erreur lors de la récupération des requêtes KYC.");
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
