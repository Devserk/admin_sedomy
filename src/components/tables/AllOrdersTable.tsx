import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { Command } from "../../interfaces/orders";

interface AllOrdersTableProps {
  data: Command[];
  isLoading: boolean;
  isError: boolean;
}

// Fonction utilitaire pour traduire les statuts
const statusTranslations: Record<string, string> = {
  pending: "En attente",
  processing: "En traitement",
  shipped: "Expédié",
  delivered: "Livré",
  cancelled: "Annulé",
  completed: "Terminé",
  // Ajoutez d'autres statuts selon vos besoins
};

// Fonction pour formater le prix
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
};

export const AllOrdersTable = ({
  data,
  isLoading,
  isError,
}: AllOrdersTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const navigate = useNavigate();

  const columnHelper = createColumnHelper<Command>();

  const columns = [
    columnHelper.accessor("merchant_payment_id", {
      header: "ID Vendeur",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("buyer_payment_id", {
      header: "ID Acheteur",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.product.nom_produit, {
      id: "product_name",
      header: "Produit",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("quantity", {
      header: "Quantité",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("cost", {
      header: "Prix Total",
      cell: (info) => formatPrice(info.getValue()),
    }),
    columnHelper.accessor("status", {
      header: "Statut",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            info.getValue() === "completed"
              ? "bg-green-100 text-green-800"
              : info.getValue() === "pending" ||
                  info.getValue() === "processing"
                ? "bg-yellow-100 text-yellow-800"
                : info.getValue() === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : info.getValue() === "shipped"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
          }`}
        >
          {statusTranslations[info.getValue()] || info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Date de commande",
      cell: (info) =>
        new Date(info.getValue()).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    }),
    // columnHelper.accessor("date_livraison", {
    //   header: "Date de livraison",
    //   cell: (info) =>
    //     info.getValue()
    //       ? new Date(info.getValue()).toLocaleDateString("fr-FR", {
    //           day: "2-digit",
    //           month: "2-digit",
    //           year: "numeric",
    //         })
    //       : "Non définie",
    // }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewCommand(info.row.original)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition duration-200"
          >
            Détails
          </button>
          {info.row.original.status === "pending" && (
            <button
              onClick={() => handleCancelCommand(info.row.original.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition duration-200"
            >
              Annuler
            </button>
          )}
        </div>
      ),
    }),
  ];

  // Fonction pour gérer l'action de consultation des détails
  const handleViewCommand = (command: Command) => {
    navigate(`/commandes/${command.id}`, { state: { command } });
  };

  // Fonction pour gérer l'annulation de commande
  const handleCancelCommand = (commandId: number) => {
    console.log("Annulation de la commande:", commandId);
    // Implémentez ici la logique d'annulation
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Chargement des commandes...</p>
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
            Impossible de charger les données des commandes. Veuillez réessayer
            plus tard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <span className="ml-1">
                      {{
                        asc: "↑",
                        desc: "↓",
                      }[header.column.getIsSorted() as string] ?? ""}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                Aucune commande trouvée
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200">
        <p className="text-sm text-gray-700 px-4 py-2">
          Nombre total de commandes : <strong>{data.length}</strong>
        </p>

        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <span className="text-sm text-gray-700">
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} sur{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <button
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <select
            className="ml-2 border rounded px-1"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Afficher {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
