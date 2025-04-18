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

export interface FileObject {
  filename: string;
  url: string;
}

export interface MerchantDetailsResponse {
  id: number;
  nom: string;
  prenom: string;
  phoneNumber: number;
  merchant_id: string;
  rccm_paper: FileObject | null;
  ifu_paper: FileObject | null;
  quality_control_paper: FileObject | null;
  property_legal_paper: FileObject | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// export interface MerchantDetailsResponse {
//   success: boolean;
//   data: MerchantDetails;
// }
