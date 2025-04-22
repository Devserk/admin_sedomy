// interfaces/Command.ts
export interface GeoPosition {
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
  type: string;
  coordinates: [number, number];
}

export interface Product {
  id_produit: number;
  nom_produit: string;
  description_produit: string;
  categorie_produit: string;
  prix_produit: number;
  quantite_produit: number;
  publicKey: string | null;
  id_merchant: number | null;
  merchant_payment_id: string;
  geo_position: GeoPosition | null;
  deleted: boolean;
  image: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Command {
  id: number;
  id_produit: number;
  merchant_payment_id: string;
  id_merchant: number | null;
  buyer_payment_id: string;
  cost: number;
  quantity: number;
  buyer_validation: boolean;
  merchant_validationt: boolean | null;
  status: string;
  date_reception: string | null;
  date_livraison: string | null;
  createdAt: string;
  updatedAt: string;
  product: Product;
  merchant: null; 
}

export interface CommandsResponse {
  success: boolean;
  data: Command[];
}
