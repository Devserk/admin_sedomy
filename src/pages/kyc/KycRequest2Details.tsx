import { useLocation, useNavigate } from "react-router-dom";
import { KycRequest } from "../../interfaces/KycRequest";

export const KycRequest2Details = () => {
  const { state } = useLocation();
  const request = state?.request as KycRequest;
  const navigate = useNavigate();

  if (!request) {
    return (
      <div className="p-4">
        <p className="text-red-500">request non trouvée</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          Détails de la request #{request.id}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Expéditeur</h2>
              <p className="font-mono bg-gray-100 p-2 rounded">
                {request.user.nom}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Destinataire</h2>
              <p className="font-mono bg-gray-100 p-2 rounded">
                {request.user.prenom}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Montant</h2>
              {/* <p>{request.user.email ?? "N/A"}</p> */}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Statut</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  request.status === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {request.status}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">
                Temps de traitement
              </h2>
              {/* <p>{request.process_time_secondes.toFixed(2)} secondes</p> */}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Date de création</h2>
              <p>{new Date(request.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    </div>
  );
};
