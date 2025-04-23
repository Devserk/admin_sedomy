import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   AttributionControl,
// } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Command } from "../../interfaces/orders";

// Statuts traduits pour l'affichage
const statusTranslations: Record<string, string> = {
  pending: "En attente",
  processing: "En traitement",
  shipped: "Expédié",
  delivered: "Livré",
  cancelled: "Annulé",
  completed: "Terminé",
};

// Fonction pour formater les dates
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Non définie";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Fonction pour formater le prix en FCFA
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-FC", {
    // Utilisez "fr-FC" pour le formatage en FCFA
    style: "currency",
    currency: "XOF", // Code de la monnaie pour le Franc CFA
  }).format(price);
};

export const OrdersDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [command, setCommand] = useState<Command | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<number>(0);

  useEffect(() => {
    // Si la commande est passée via la navigation state
    if (location.state && location.state.command) {
      setCommand(location.state.command);
      setLoading(false);
      return;
    }

    // Sinon, charger la commande depuis l'API
    const fetchCommand = async () => {
      try {
        // Remplacer par votre endpoint API
        const response = await fetch(`/api/commands/${id}`);
        if (!response.ok) {
          throw new Error("La commande n'a pas pu être chargée");
        }
        const data = await response.json();
        setCommand(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommand();
  }, [id, location.state]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!command) return;

    try {
      // Remplacer par votre endpoint API
      const response = await fetch(`/api/commands/${command.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Impossible de mettre à jour le statut");
      }

      const updatedCommand = await response.json();
      setCommand(updatedCommand.data);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleValidateDelivery = async () => {
    if (!command) return;

    try {
      // Remplacer par votre endpoint API
      const response = await fetch(`/api/commands/${command.id}/validate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ buyer_validation: true }),
      });

      if (!response.ok) {
        throw new Error("Impossible de valider la livraison");
      }

      const updatedCommand = await response.json();
      setCommand(updatedCommand.data);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !command) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Erreur</p>
          <p>{error || "Commande introuvable"}</p>
          <button
            onClick={() => navigate("/list-orders")}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retour aux commandes
          </button>
        </div>
      </div>
    );
  }

  const { product } = command;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Détails de la commande #{command.id}
        </h1>
        <button
          onClick={() => navigate("/list-orders")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Retour
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne de gauche - Informations produit */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Produit</h2>

              {/* Galerie d'images */}
              {/* <div className="mb-6">
                <div className="aspect-w-16 aspect-h-9 mb-2 overflow-hidden rounded-lg">
                  {product.image && product.image.length > 0 ? (
                    <img
                      src={product.image[activeImage]}
                      alt={product.nom_produit}
                      className="object-cover w-full h-64"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">Aucune image disponible</p>
                    </div>
                  )}
                </div>
                {product.image && product.image.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {product.image.map((img, index) => (
                      <div
                        key={index}
                        className={`w-16 h-16 cursor-pointer rounded ${
                          index === activeImage
                            ? "ring-2 ring-blue-500"
                            : "opacity-70"
                        }`}
                        onClick={() => setActiveImage(index)}
                      >
                        <img
                          src={img}
                          alt={`${product.nom_produit} - ${index + 1}`}
                          className="object-cover w-full h-full rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div> */}

              <div className="mb-6">
                <div className="aspect-w-16 aspect-h-9 mb-2 overflow-hidden rounded-lg">
                  {product.image && product.image.length > 0 ? (
                    <img
                      src={product.image[activeImage]?.url || ""}
                      alt={
                        product.image[activeImage]?.filename ||
                        product.nom_produit
                      }
                      className="object-contain w-full h-64"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">Aucune image disponible</p>
                    </div>
                  )}
                </div>

                {/* Afficher les vignettes uniquement s'il y a plus d'une image */}
                {product.image && product.image.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto py-2">
                    {product.image.map((img, index) => (
                      <div
                        key={index}
                        className={`w-16 h-16 cursor-pointer rounded flex-shrink-0 ${
                          index === activeImage
                            ? "ring-2 ring-blue-500"
                            : "opacity-70 hover:opacity-100"
                        }`}
                        onClick={() => setActiveImage(index)}
                      >
                        <img
                          src={img.url}
                          alt={
                            img.filename ||
                            `${product.nom_produit} - ${index + 1}`
                          }
                          className="object-contain w-full h-full rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-bold">{product.nom_produit}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Catégorie: {product.categorie_produit}
                  </p>
                  <p className="text-lg font-semibold text-blue-600 mb-2">
                    {formatPrice(product.prix_produit)} / unité
                  </p>
                  <p className="text-sm mb-4">
                    Stock disponible: {product.quantite_produit} unités
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700 text-sm">
                    {product.description_produit}
                  </p>
                </div>
              </div>
            </div>

            {product.geo_position && product.geo_position.coordinates && (
              <div className="p-6 border-t border-gray-200">
                <h3 className="font-semibold mb-3">Localisation du produit</h3>
                <div className="h-64 rounded-lg overflow-hidden">
                  {/* <MapContainer
                    center={[
                      product.geo_position.coordinates[1],
                      product.geo_position.coordinates[0],
                    ]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker
                      position={[
                        product.geo_position.coordinates[1],
                        product.geo_position.coordinates[0],
                      ]}
                    >
                      <Popup>{product.nom_produit}</Popup>
                    </Marker>
                  </MapContainer> */}

                  {/* <MapContainer
                    center={[
                      product.geo_position.coordinates[1],
                      product.geo_position.coordinates[0],
                    ]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <AttributionControl position="bottomright" />
                    <Marker
                      position={[
                        product.geo_position.coordinates[1],
                        product.geo_position.coordinates[0],
                      ]}
                    >
                      <Popup>{product.nom_produit}</Popup>
                    </Marker>
                  </MapContainer> */}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Colonne de droite - Informations commande */}
        <div className="lg:col-span-3 border border-gray-100">
          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Informations commande
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Statut:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    command.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : command.status === "pending" ||
                          command.status === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : command.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : command.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {statusTranslations[command.status] || command.status}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Quantité commandée:</span>
                <span className="font-medium">{command.quantity}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Prix total:</span>
                <span className="font-semibold">
                  {formatPrice(command.cost)}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Date de commande:</span>
                <span>{formatDate(command.createdAt)}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Date de livraison prévue:</span>
                <span>{formatDate(command.date_livraison)}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Date de réception:</span>
                <span>{formatDate(command.date_reception)}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">ID Vendeur:</span>
                <span className="font-mono text-xs truncate">
                  {command.merchant_payment_id}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">ID Acheteur:</span>
                <span className="font-mono text-xs truncate">
                  {command.buyer_payment_id}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Validation acheteur:</span>
                <span>
                  {command.buyer_validation ? (
                    <span className="text-green-600">Confirmé</span>
                  ) : (
                    <span className="text-yellow-600">En attente</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Validation vendeur:</span>
                <span>
                  {command.merchant_validationt === true ? (
                    <span className="text-green-600">Confirmé</span>
                  ) : command.merchant_validationt === false ? (
                    <span className="text-red-600">Refusé</span>
                  ) : (
                    <span className="text-yellow-600">En attente</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>

            <div className="space-y-3">
              {/* {command.status === "pending" && (
                <button
                  onClick={() => handleUpdateStatus("cancelled")}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition duration-200"
                >
                  Annuler la commande
                </button>
              )} */}

              {command.status === "shipped" && !command.buyer_validation && (
                <button
                  onClick={handleValidateDelivery}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition duration-200"
                >
                  Confirmer la réception
                </button>
              )}

              {/* <button
                onClick={() => window.print()}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded transition duration-200 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Imprimer les détails
              </button> */}

              <button
                onClick={() => window.print()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition duration-200 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
                Imprimer les détails
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
