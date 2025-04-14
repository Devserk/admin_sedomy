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
import { KycRequest } from "../../interfaces/KycRequest";
import { useNavigate } from "react-router-dom";

interface KycRequestTableProps {
  data: KycRequest[];
  isLoading: boolean;
  isError: boolean;
}

export const KycRequestTable = ({
  data,
  isLoading,
  isError,
}: KycRequestTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<KycRequest>();
  const navigate = useNavigate();

  const columns = [
    columnHelper.accessor((row) => row.user.nom, {
      id: "nom",
      header: "Nom",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.user.prenom, {
      id: "prenom",
      header: "Prénom",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("kind_op", {
      header: "Type",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("status", {
      header: "Statut",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            info.getValue() === "approved"
              ? "bg-green-100 text-green-800"
              : info.getValue() === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Date de création",
      cell: (info) =>
        new Date(info.getValue()).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <button
          onClick={() => handleViewRequest(info.row.original)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition duration-200 cursor:pointer"
        >
          Consulter la demande
        </button>
      ),
    }),
  ];

  // Fonction pour gérer l'action de consultation
  const handleViewRequest = (request: KycRequest) => {
    navigate(`/user-kyc2/${request.id}`, { state: { request } });
    console.log("Consulter la demande:", request);
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
  });

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Chargement des demandes KYC...</p>
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
            Impossible de charger les données de demandes KYC. Veuillez
            réessayer plus tard.
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
                Aucune demande KYC trouvée
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200">
        <p className="text-sm text-gray-700 px-4 py-2">
          Nombre total de demandes : <strong>{data.length}</strong>
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
          <span>
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <select
            className="ml-2 border rounded px-1"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
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
