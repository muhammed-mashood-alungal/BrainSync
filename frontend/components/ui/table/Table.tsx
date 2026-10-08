"use client";
import React, { useEffect, useState } from "react";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: (item: T) => React.ReactNode;
  totalCount?: number;
  onPageChange?: (
    page: number,
    limit: number,
    searchQuery?: string,
    selectValue?: string
  ) => void;
  title?: string;
  ShowSearchBar?: boolean;
  ShowDropDown?: boolean;
  dropDownLists?: { value: string; label: string }[];
}

const Table = <T,>({
  columns,
  data,
  actions,
  totalCount,
  onPageChange,
  title,
  ShowSearchBar = true,
  ShowDropDown = false,
  dropDownLists,
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectValue, setSelectValue] = useState("All");
  useEffect(() => {
    if (onPageChange) {
      onPageChange(currentPage, limit, searchQuery, selectValue);
    }
  }, [currentPage, searchQuery, selectValue]);
  useEffect(() => {
    if (totalCount) {
      setTotalPages(Math.ceil(totalCount / limit));
    }
  }, [totalCount]);

  return (
    <>
      <div className="w-full md:w-auto  p-2 flex justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight ml-2 mt-2">
            {title}
          </h2>
        </div>
        <div className="flex">
          {ShowDropDown && dropDownLists && dropDownLists?.length > 0 && (
            <div className="relative m-1">
              <select
                name=""
                id=""
                onChange={(e) => {
                  setSelectValue(e.target.value);
                }}
                className="w-full h-10  p-2 border border-gray-300 bg-gray-900 rounded-md focus:ring-2 focus:ring-[#00D2D9] focus:border-transparent"
              >
                <option value="All">All</option>
                {dropDownLists.map((item, index) => {
                  return (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          {ShowSearchBar && (
            <div className="relative m-1">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00D2D9]"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-x-auto  rounded-lg shadow-xl">
        <table className="min-w-full divide-y divide-gray-900">
          <thead className="bg-[#00D2D9] text-black">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  className="px-6 py-4 text-left text-xs font-medium  uppercase tracking-wider"
                  scope="col"
                >
                  {col.label}
                </th>
              ))}
              {actions && <th className="font-thin text-xs">ACTIONS</th>}
            </tr>
          </thead>
          <tbody className="bg-gray divide-y divide-cyan-900 ">
            {data?.length > 0 ? (
              data?.map((item, index) => (
                <tr key={index} className="hover:bg-gray-750">
                  {columns.map((col) => (
                    <td
                      key={col.key as string}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                    >
                      {col.render
                        ? col.render(item)
                        : (item[col.key] as React.ReactNode)}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-righ">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-10 text-center text-sm text-gray-400"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {onPageChange && (
        <div className="flex justify-center items-center my-3">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:cursor-pointer"
          >
            Previous
          </button>
          <span className="text-gray-300 mx-5">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

const MemoizedTable = React.memo(Table) as typeof Table;
export default MemoizedTable;
