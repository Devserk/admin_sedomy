// components/MerchantDetail.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { fetchMerchantsById } from "../../api/merchants";
import {
  GetMerchantDetailsParams,
  MerchantDetailsResponse,
} from "../../interfaces/Merchant";
import { useQuery } from "@tanstack/react-query";
// import { useMerchantDetails } from "../hooks/useMerchantDetails";
// import { MerchantDetails } from "../interfaces/Merchant";

export const useMerchantDetails = (params: GetMerchantDetailsParams) => {
  return useQuery<MerchantDetailsResponse, Error>({
    queryKey: ["merchant-details", params.id],
    queryFn: async () => {
      const response = await fetchMerchantsById(params);
      return response;
    },
  });
};

const MerchantsDetailsPage = () => {
  const { state } = useLocation();
  const merchants = state?.merchant as { id: number };

  // merchant
  console.log("id", merchants.id);

  const navigate = useNavigate();

  const {
    data: merchant,
    isLoading,
    isError,
  } = useMerchantDetails({ id: merchants.id });

  console.log("info récup", merchant);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError || !merchant) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <p>Erreur lors du chargement des détails du marchand</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {merchant.prenom} {merchant.nom}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Retour
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations de base */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Informations générales
            </h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">ID Marchand</dt>
                <dd className="font-mono text-gray-900">
                  {merchant.merchant_id}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Téléphone</dt>
                <dd className="text-gray-900">{merchant.phoneNumber}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Date de création</dt>
                <dd className="text-gray-900">
                  {new Date(merchant.createdAt).toLocaleDateString("fr-FR")}
                </dd>
              </div>
            </dl>
          </div>

          {/* Statut */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Statut</h2>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                merchant.status === "active"
                  ? "bg-green-100 text-green-800"
                  : merchant.status === "pending_verification"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {merchant.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Documents
          </h2>
          <div className="space-y-2">
            {[
              { label: "RCCM", value: merchant.rccm_paper },
              { label: "IFU", value: merchant.ifu_paper },
              {
                label: "Contrôle qualité",
                value: merchant.quality_control_paper,
              },
              {
                label: "Titre de propriété",
                value: merchant.property_legal_paper,
              },
            ].map((doc) => (
              <div
                key={doc.label}
                className="flex items-center justify-between"
              >
                <span className="text-gray-600">{doc.label}</span>
                {doc.value ? (
                  <a
                    href={doc.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Voir le document
                  </a>
                ) : (
                  <span className="text-gray-400">Non fourni</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantsDetailsPage;
