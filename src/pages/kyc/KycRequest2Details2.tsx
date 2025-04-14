// pages/KycRequest2Details2.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { ApiResponse } from "../../interfaces/KycRequest";

const KycRequest2Details2 = () => {
  const { state } = useLocation();
  const response = state?.response as ApiResponse;
  const navigate = useNavigate();

  if (!response?.data) {
    return (
      <div className="p-4">
        <p className="text-red-500">Données de transaction non disponibles</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Retour
        </button>
      </div>
    );
  }

  const { data } = response;
  const { user } = data;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-white shadow-xl rounded-lg p-6 space-y-8">
        {/* En-tête */}
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-gray-800">
            Détails de la transaction #{data.id}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retour
          </button>
        </div>

        {/* Section Utilisateur */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              Informations utilisateur
            </h2>

            <div>
              <label className="text-sm text-gray-500">ID Unique</label>
              <p className="font-mono bg-gray-100 p-2 rounded break-all">
                {user.user_unique_id}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Nom</label>
                <p className="font-medium">{user.nom}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Prénom</label>
                <p className="font-medium">{user.prenom}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Téléphone</label>
                <p className="font-medium">{user.phonenumber}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{user.email || "Non renseigné"}</p>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">Niveau KYC</label>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  user.kyc_level === "pending_to_niv2"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {user.kyc_level}
              </span>
            </div>
          </div>

          {/* Documents KYC */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              Documents KYC
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(user.files).map(([key, file]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm text-gray-500 capitalize">
                    {key.replace("_", " ")}
                  </label>
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={file.url}
                      alt={key}
                      className="w-full h-40 object-cover hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => window.open(file.url, "_blank")}
                    />
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {file.filename}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Transaction */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">
            Détails de la transaction
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-500">Type d'opération</label>
              <p className="font-medium">{data.kind_op}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Statut</label>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  data.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : data.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {data.status}
              </span>
            </div>

            <div>
              <label className="text-sm text-gray-500">Date de création</label>
              <p className="font-medium">
                {new Date(data.createdAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycRequest2Details2;
