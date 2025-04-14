// Fichier: types/KycRequest.ts
export interface KycRequestUser {
  user_unique_id: string;
  nom: string;
  prenom: string;
  kyc_limit_amount: number;
}

export interface KycRequestFile {
  paying_note: string;
  home_paper: string;
}

export interface KycRequest {
  id: number;
  user_unique_id: string;
  file_id: number;
  kind_op: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: KycRequestUser;
  file: KycRequestFile;
}

export interface KycRequestResponse {
  success: boolean;
  data: KycRequest[];
}

// DATA 2 POUR KYC 2

// interfaces/Kyc.ts
export interface FileObject {
  filename: string;
  url: string;
}

export interface User {
  user_unique_id: string;
  nom: string;
  prenom: string;
  phonenumber: number;
  email: string | null;
  kyc_level: string;
  createdAt: string;
  image: string | null;
  files: {
    identity_card: FileObject;
    first_shot: FileObject;
    second_shot: FileObject;
    third_shot: FileObject;
  };
}

export interface KycData {
  id: number;
  user: User;
  kind_op: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  success: boolean;
  data: KycData;
}
