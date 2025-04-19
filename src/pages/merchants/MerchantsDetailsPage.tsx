// components/MerchantDetail.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { fetchMerchantsById } from "../../api/merchants";
import {
  GetMerchantDetailsParams,
  MerchantDetailsResponse,
} from "../../interfaces/Merchant";
import { useQuery } from "@tanstack/react-query";
import { useMerchantActions } from "../../hooks/useMerchants";
import { toast } from "react-hot-toast";

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
  const { rejectMutation, validateMutation } = useMerchantActions();

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

  // const handleAction = async (actionType: "validate" | "reject") => {
  //   // const actionName = actionType === "validate" ? "Validation" : "Rejet";

  //   try {
  //     // Afficher le toast de chargement
  //     // const toastId = toast.loading(`${actionName} en cours...`);

  //     const params = { id: merchant.id };

  //     if (actionType === "validate") {
  //       await validateMerchant.execute(params);
  //     } else {
  //       await rejectMerchant.execute(params);
  //     }
  //   } catch (error) {
  //     // Gérer l'erreur (notification, log, etc.)
  //     console.error(`Erreur lors de ${actionType} :`, error);
  //   }
  // };

  const handleValidate = () => {
    validateMutation.mutate({ id: merchant.id });
  };

  const handleReject = () => {
    rejectMutation.mutate({ id: merchant.id });
  };

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
            {/* <dl className="grid grid-cols-2 gap-4">
              
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
            </dl> */}

            <dl className="space-y-6">
              {" "}
              {/* Utilisation de space-y au lieu de grid */}
              <div className="space-y-1">
                <dt className="text-sm text-gray-500">ID Marchand</dt>
                <dd className="font-mono text-gray-900 break-all">
                  {merchant.merchant_id}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm text-gray-500">Téléphone</dt>
                <dd className="text-gray-900">
                  {merchant.phoneNumber || "Non renseigné"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm text-gray-500">Date de création</dt>
                <dd className="text-gray-900">
                  {new Date(merchant.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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

          {/* Validation and Reject */}

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleValidate}
              disabled={validateMutation.isPending}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors
          ${
            validateMutation.isPending
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
            >
              {validateMutation.isPending
                ? "Validation..."
                : "Valider le marchand"}
            </button>

            <button
              onClick={handleReject}
              disabled={rejectMutation.isPending}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors
          ${
            rejectMutation.isPending
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
            >
              {rejectMutation.isPending
                ? "Rejet en cours..."
                : "Rejeter la demande"}
            </button>
          </div>

          {/* <div className="flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-500 text-white px-4 py-1  rounded hover:bg-blue-600 transition-colors"
            >
              Valider
            </button>
            <button
              onClick={() => navigate(-1)}
              className="bg-red-500 text-white px-4 py-1  rounded hover:bg-red-600 transition-colors"
            >
              Rejeter
            </button>
          </div> */}
        </div>

        {/*    */}

        {/* Documents */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Documents
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "RCCM", doc: merchant.rccm_paper },
              { label: "IFU", doc: merchant.ifu_paper },
              {
                label: "Contrôle qualité",
                doc: merchant.quality_control_paper,
              },
              {
                label: "Titre de propriété",
                doc: merchant.property_legal_paper,
              },
            ].map(({ label, doc }) => (
              <div key={label} className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">{label}</h3>
                {doc ? (
                  <div className="border rounded-lg overflow-hidden">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative group"
                    >
                      <img
                        src={doc.url}
                        alt={label}
                        className="w-full h-24 object-contain p-2"
                        style={{ objectFit: "contain" }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />

                      <p>lien : {doc.url}</p>
                      <svg className="absolute w-1/2 text-gray-300" />
                    </a>
                    {/* <p className="text-xs text-gray-500 p-2 truncate">
                      {doc.filename}
                    </p> */}
                  </div>
                ) : (
                  <div className="max-h-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    Document non fourni
                  </div>
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
