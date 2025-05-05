// pages/KycRequest2Details2.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { GetRequestDataParams, KycData } from "../../interfaces/KycRequest";
import { fetchKycRequestsById } from "../../api/kyc";
import { useQuery } from "@tanstack/react-query";
import { useRequestKycActions } from "../../hooks/useKyc2";
import { functions } from "../../function";
import { useState } from "react";

export const useKycData = (params: GetRequestDataParams) => {
  return useQuery<KycData, Error>({
    queryKey: ["kyc-data", params.id],
    queryFn: async () => {
      const response = await fetchKycRequestsById(params);
      return response.data;
    },
  });
};

interface File {
  url: string;
  filename?: string; // Optional if it may not always be present
}

interface FilePreviewProps {
  file: File;
  fileKey: string;
  onClick: (url: string, filename: string) => void;
}

const KycRequest2Details2 = () => {
  const { state } = useLocation();
  // const response = state?.response as ApiResponse;
  // const request = state?.request as KycRequest;
  const request = state?.request as { id: number };
  const navigate = useNavigate();
  const { rejectKycMutation, validateKycMutation } = useRequestKycActions();
  console.log("id", request.id);

  // const response = useKycData(Number(request.id));
  const { data, isLoading, isError } = useKycData({ id: request.id });
  console.log("réponse data", data);

  // Ajoutez ces états pour gérer l'affichage du document
  const [showViewer, setShowViewer] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  // Reste de votre code existant...

  // Fonction pour ouvrir le visualiseur
  const openDocumentViewer = (url: string, name: string) => {
    setSelectedFileUrl(url);
    setSelectedFileName(name);
    setShowViewer(true);
  };

  // Fonction pour fermer le visualiseur
  const closeDocumentViewer = () => {
    setShowViewer(false);
    setSelectedFileUrl("");
    setSelectedFileName("");
  };

  // Déterminer le type de fichier pour l'affichage approprié
  const getFileType = (url: any) => {
    const extension = url.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
      return "image";
    } else if (["pdf"].includes(extension)) {
      return "pdf";
    } else {
      return "other";
    }
  };

  // Composant pour afficher une vignette de fichier en fonction de son type
  const FilePreview: React.FC<FilePreviewProps> = ({
    file,
    fileKey,
    onClick,
  }) => {
    const fileType = getFileType(file.url);

    return (
      <div
        className="border rounded-lg overflow-hidden group cursor-pointer"
        onClick={() => onClick(file.url, file.filename || fileKey)}
      >
        <div className="relative w-full h-40">
          {fileType === "image" ? (
            // Prévisualisation d'image normale
            <img
              src={file.url}
              alt={fileKey}
              className="w-full h-full object-cover group-hover:opacity-90 transition-all"
            />
          ) : fileType === "pdf" ? (
            // Prévisualisation pour les PDFs
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4">
              <div className="w-16 h-20 mb-2 flex items-center justify-center bg-red-100 border border-red-200 rounded">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-center text-gray-800">
                Document PDF
              </p>
            </div>
          ) : (
            // Prévisualisation pour autres types de fichiers
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4">
              <div className="w-16 h-20 mb-2 flex items-center justify-center bg-blue-100 border border-blue-200 rounded">
                <svg
                  className="w-10 h-10 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-center text-gray-800">
                Fichier {file.url.split(".").pop()?.toUpperCase()}
              </p>
            </div>
          )}

          {/* Bouton de visualisation au survol */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white bg-opacity-90 p-3 rounded-full shadow-lg transform hover:scale-110 transition-transform">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!data) {
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

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Chargement des transactions...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Erreur</p>
          <p>
            Erreur lors du chargement des informations personnelles du client.
          </p>
        </div>
      </div>
    );
  }

  const handleValidate = () => {
    validateKycMutation.mutate({ id: request.id });
  };

  const handleReject = () => {
    rejectKycMutation.mutate({ id: request.id });
  };

  return (
    <div>
      <div className="p-4 max-w-6xl mx-auto">
        {/* {showViewer && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-99999 left-0 top-0 h-screen w-screen backdrop-blur-sm rounded-xl shadow-lg overflow-scroll">
            <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-semibold">{selectedFileName}</h3>
                <button
                  onClick={closeDocumentViewer}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-auto p-2 flex items-center justify-center bg-gray-100">
                {getFileType(selectedFileUrl) === "image" ? (
                  <img
                    src={selectedFileUrl}
                    alt={selectedFileName}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : getFileType(selectedFileUrl) === "pdf" ? (
                  <div className="w-full h-full">
                    <object
                      data={selectedFileUrl}
                      type="application/pdf"
                      width="100%"
                      height="100%"
                      className="w-full h-full"
                    >
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <p className="mb-4">
                          Impossible d'afficher le PDF directement.
                        </p>
                        <a
                          href={selectedFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Ouvrir le PDF
                        </a>
                      </div>
                    </object>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <p className="mb-4">
                      Ce type de fichier ne peut pas être prévisualisé.
                    </p>
                    <a
                      href={selectedFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Télécharger le fichier
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )} */}

        {showViewer && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-99999 left-0 top-0 h-screen w-screen backdrop-blur-sm rounded-xl shadow-lg overflow-scroll">
            <div className="bg-white rounded-lg w-full max-w-5xl h-[100vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-semibold">{selectedFileName}</h3>
                <div className="flex items-center space-x-2">
                  {/* <a
                    href={selectedFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    title="Ouvrir dans un nouvel onglet"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a> */}
                  <button
                    onClick={closeDocumentViewer}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    title="Fermer"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-2 flex items-center justify-center bg-gray-100">
                {getFileType(selectedFileUrl) === "image" ? (
                  <img
                    src={selectedFileUrl}
                    alt={selectedFileName}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : getFileType(selectedFileUrl) === "pdf" ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    {/* Google PDF Viewer - Une alternative plus fiable */}
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedFileUrl)}&embedded=true`}
                      width="100%"
                      height="100%"
                      className="w-full h-full border-0"
                      title={selectedFileName}
                    ></iframe>

                    {/* Message de secours qui s'affiche si la visionneuse ne charge pas */}
                    <div className="mt-4 text-center">
                      <p>
                        Si le PDF ne s'affiche pas correctement, vous pouvez :
                      </p>
                      <div className="mt-2">
                        <a
                          href={selectedFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                        >
                          Télécharger le PDF
                        </a>
                        <a
                          href={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedFileUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                          Ouvrir avec Google Viewer
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <p className="mb-4">
                      Ce type de fichier ne peut pas être prévisualisé.
                    </p>
                    <a
                      href={selectedFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Télécharger le fichier
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-xl rounded-xl p-6 space-y-8">
          {/* En-tête */}
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-800">
            Demande de Kyc 
            {/* #{data.id} */}
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
                  {data.user.user_unique_id}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Nom</label>
                  <p className="font-medium">{data.user.nom}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Prénom</label>
                  <p className="font-medium">{data.user.prenom}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Téléphone</label>
                  <p className="font-medium">{data.user.phonenumber}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">
                    {data.user.email || "Non renseigné"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Niveau KYC</label>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    data.user.kyc_level === "pending_to_niv2"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {functions.statusTranslations[data.user.kyc_level] ||
                    data.user.kyc_level}
                </span>
              </div>

              {/* Validation and Reject */}

              {data.status === "pending" && (
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleValidate}
                    disabled={validateKycMutation.isPending}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    validateKycMutation.isPending
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  >
                    {validateKycMutation.isPending
                      ? "Validation..."
                      : "Valider la requete"}
                  </button>

                  <button
                    onClick={handleReject}
                    disabled={rejectKycMutation.isPending}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    rejectKycMutation.isPending
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                  >
                    {rejectKycMutation.isPending
                      ? "Rejet en cours..."
                      : "Rejeter la requete"}
                  </button>
                </div>
              )}

              {/* FIN */}
            </div>

            {/* Documents KYC */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">
                Documents KYC
              </h2>

              {/* <div className="grid grid-cols-2 gap-4">
                {Object.entries(data.user.files).map(([key, file]) => (
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
              </div> */}

              {/* Deuxieme version affichage */}

              {/* <div className="grid grid-cols-2 gap-4">
                {Object.entries(data.user.files).map(([key, file]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm text-gray-500 capitalize">
                      {key.replace("_", " ")}
                    </label>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="relative">
                        <img
                          src={file.url}
                          alt={key}
                          className="w-full h-40 object-cover hover:scale-105 transition-transform cursor-pointer"
                          onClick={() =>
                            openDocumentViewer(file.url, file.filename || key)
                          }
                        />
                        <div className="absolute bottom-2 right-2">
                          <button
                            onClick={() =>
                              openDocumentViewer(file.url, file.filename || key)
                            }
                            className="bg-white bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full shadow"
                            title="Voir le document"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {file.filename}
                    </p>
                  </div>
                ))}
              </div> */}

              {/* <div className="grid grid-cols-2 gap-4">
                {Object.entries(data.user.files).map(([key, file]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm text-gray-500 capitalize">
                      {key.replace("_", " ")}
                    </label>
                    
                    <div className="border rounded-lg overflow-hidden group">
                      <div className="relative">
                        <img
                          src={file.url}
                          alt={key}
                          className="w-full h-40 object-cover group-hover:opacity-90 transition-all cursor-pointer"
                          onClick={() =>
                            openDocumentViewer(file.url, file.filename || key)
                          }
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              openDocumentViewer(file.url, file.filename || key)
                            }
                            className="bg-white bg-opacity-75 p-3 rounded-full shadow-lg transform hover:scale-110 transition-transform"
                            title="Voir le document"
                          >
                            <svg
                              className="w-6 h-6 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {file.filename}
                    </p>
                  </div>
                ))}
              </div> */}

              {/*  */}

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(data.user.files).map(([key, file]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm text-gray-500 capitalize">
                      {key.replace("_", " ")}
                    </label>
                    <FilePreview
                      file={file}
                      fileKey={key}
                      onClick={openDocumentViewer}
                    />
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
                <label className="text-sm text-gray-500">
                  Type d'opération
                </label>
                <p className="font-medium">{data.kind_op}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Statut</label>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    data.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : data.status === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {functions.statusTranslations[data.status]}
                </span>
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Date de création
                </label>
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
    </div>
  );
};

export default KycRequest2Details2;
