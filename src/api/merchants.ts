import { get, put } from "../hooks/request";
import {
  GetMerchantDetailsParams,
  Merchant,
  MerchantDetailsResponse,
  MerchantActionParams,
  MerchantActionResponse,
} from "../interfaces/Merchant";

const API_MERCHNATS_BASE = "https://emes.bj:10002";

export const fetchMerchants = async (): Promise<{ data: Merchant[] }> => {
  const url = "https://emes.bj:10002/api/market_manage/merchants/all_merchants";

  const response = await get(url);
  if (!response) {
    throw new Error("Erreur lors de la récupération des marchands.");
  }
  return { data: response }; // Adapter le format de réponse pour correspondre à votre structure
};

export const fetchMerchantsById = async (
  params: GetMerchantDetailsParams
): Promise<MerchantDetailsResponse> => {
  const url = `https://emes.bj:10002/api/market_manage/merchants/merchant_by_id/${params.id}`;

  const response = await get(url);

  if (!response) {
    throw new Error(
      "Erreur lors de la récupération de la requête KYC : " + params.id
    );
  }

  return response;
};

export const MerchantApi = {
  rejectMerchant: async ({
    id,
  }: MerchantActionParams): Promise<MerchantActionResponse> => {
    const { data, error } = await put<MerchantActionResponse>(
      `https://emes.bj:10002/api/market_manage/merchants/reject_of_merchant/${id}`
    );

    if (error) throw new Error(error);
    console.error("Détails des erreurs du validate", error);
    return data!;
  },

  validateMerchant: async ({
    id,
  }: MerchantActionParams): Promise<MerchantActionResponse> => {
    const { data, error } = await put<MerchantActionResponse>(
      `https://emes.bj:10002/api/market_manage/merchants/valid_of_merchant/${id}`
    );

    if (error) throw new Error(error);
    console.error("Détails des erreurs du reject:", error);
    return data!;
  },
};
