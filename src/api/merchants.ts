import { get } from "../hooks/request";
import {
  GetMerchantDetailsParams,
  Merchant,
  MerchantDetailsResponse,
} from "../interfaces/Merchant";

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
