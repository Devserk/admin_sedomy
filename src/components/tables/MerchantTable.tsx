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
import { Merchant } from "../../interfaces/Merchant";
import { useNavigate } from "react-router-dom";

interface MerchantTableProps {
  data: Merchant[];
  isLoading: boolean;
  isError: boolean;
}

export const MerchantTable = ({
  data,
  isLoading,
  isError,
}: MerchantTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<Merchant>();
  const navigate = useNavigate();

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("nom", {
      header: "Nom",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("prenom", {
      header: "Prénom",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("phoneNumber", {
      header: "Téléphone",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("status", {
      header: "Statut",
      cell: (info) => {
        const status = info.getValue();
        return status ? (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              status === "success"
                ? "bg-green-100 text-green-800"
                : status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </span>
        ) : (
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
            Non défini
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <button
          onClick={() => handleViewMerchant(info.row.original)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition duration-200 cursor:pointer"
        >
          Consulter le marchand
        </button>
      ),
    }),
  ];

  // Fonction pour gérer l'action de consultation
  const handleViewMerchant = (merchant: Merchant) => {
    navigate(`/merchants/${merchant.id}`, { state: { merchant } });
    console.log("Consulter le marchand:", merchant);
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
          <p className="mt-4 text-gray-600">Chargement des marchands...</p>
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
            Impossible de charger les données des marchands. Veuillez réessayer
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
                Aucun marchand trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200">
        <p className="text-sm text-gray-700 px-4 py-2">
          Nombre total de marchands : <strong>{data.length}</strong>
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
