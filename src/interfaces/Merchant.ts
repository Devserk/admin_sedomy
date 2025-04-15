// Fichier: interfaces/Merchant.ts
export interface Merchant {
  id: number;
  phoneNumber: number;
  nom: string;
  prenom: string;
  status?: string; // Optionnel car présent seulement dans certaines entrées
}

export interface MerchantResponse {
  data: Merchant[];
}

export interface GetMerchantDetailsParams {
  id: number;
}

export interface MerchantDetailsResponse {
  id: number;
  nom: string;
  prenom: string;
  phoneNumber: number;
  merchant_id: string;
  rccm_paper: string | null;
  ifu_paper: string | null;
  quality_control_paper: string | null;
  property_legal_paper: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// export interface MerchantDetailsResponse {
//   success: boolean;
//   data: MerchantDetails;
// }
