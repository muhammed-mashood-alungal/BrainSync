// GenericListing.tsx
"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { Search, ChevronDown } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpWideShort,
  faClose,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-hot-toast';
import SimpleStudyLoading from "@/Components/Loading/Loading";
import EmptyList from "@/Components/EmptyList/EmptyList";

interface FilterOption {
  value: string;
  label: string;
}

interface GenericListingProps<T> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  renderCard: (item: T) => ReactNode;
  fetchData: (
    searchQuery: string,
    filterValue: string,
    startDate: string | null,
    endDate: string | null,
    sort: boolean,
    skip: number,
    limit: number
  ) => Promise<{ items: T[]; count: number }>;
  onCreateClick?: () => void;
  createButtonText?: string;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  searchPlaceholder?: string;
  showDateFilter?: boolean;
  showCreateButton?: boolean;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
  limit?: number;
}

const GenericListing = <T extends object>({
  items,
  setItems,
  renderCard,
  fetchData,
  onCreateClick,
  createButtonText = "Create New",
  filterOptions = [],
  filterLabel = "Filter",
  searchPlaceholder = "Search",
  showDateFilter = true,
  showCreateButton = true,
  loading = false,
  setLoading = () => {},
  limit = 9,
}: GenericListingProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sort, setSort] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  const handleFetchData = async (
    search: string,
    filter: string,
    start: string | null,
    end: string | null,
    sort: boolean,
    skip: number,
    pageLimit: number
  ) => {
    try {
      setLoading(true);
      const { items, count } = await fetchData(
        search,
        filter,
        start,
        end,
        sort,
        skip,
        pageLimit
      );
      setItems(items);
      setTotalPages(Math.ceil(count / pageLimit));
    } catch (error) {
      toast.error((error as Error).message);
    }
    setLoading(false);
  };

  const customDateFilter = () => {
    if (!startDate) {
      return toast.error("Please Select a Start Date");
    }
    if (!endDate) {
      return toast.error("Please Select a End Date");
    }
    if (startDate > endDate) {
      return toast.error("Please Enter a Valid Range");
    }
    handleFetchData(
      searchQuery,
      filterValue,
      startDate,
      endDate,
      sort,
      (currentPage - 1) * limit,
      limit
    );
  };

  useEffect(() => {
    let filterStartDate: string | null = startDate;
    let filterEndDate: string | null = endDate;
    if (!filterStartDate) filterEndDate = null;
    if (!filterEndDate) filterStartDate = null;

    handleFetchData(
      searchQuery,
      filterValue,
      filterStartDate,
      filterEndDate,
      sort,
      (currentPage - 1) * limit,
      limit
    );
  }, [searchQuery, filterValue, sort, currentPage]);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="relative flex-grow min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-gray-900 text-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {filterOptions.length > 0 && (
            <div className="relative w-full sm:w-auto">
              <select
                className="bg-gray-900 text-gray-300 rounded-md px-4 py-2 w-full sm:w-auto appearance-none pr-8"
                onChange={(e) => setFilterValue(e.target.value)}
                value={filterValue}
              >
                <option value="">{filterLabel}</option>
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
          )}

          {showDateFilter && (
            <>
              <input
                type="text"
                name="startDate"
                placeholder="Start Date"
                value={startDate}
                className="h-10 rounded p-2 bg-gray-900"
                onChange={(e) => setStartDate(e.target.value)}
                onFocus={(e) => (e.target.type = "date")}
              />

              <input
                type="text"
                name="endDate"
                placeholder="End Date"
                value={endDate}
                className="h-10 rounded p-2 bg-gray-900"
                onChange={(e) => setEndDate(e.target.value)}
                onFocus={(e) => (e.target.type = "date")}
              />
              <div className="h-10 w-10 flex justify-center items-center bg-gray-900 rounded">
                <FontAwesomeIcon icon={faFilter} onClick={customDateFilter} />
              </div>
              {startDate && endDate && (
                <div className="h-10 w-10 flex justify-center items-center bg-gray-900 rounded">
                  <FontAwesomeIcon
                    icon={faClose}
                    onClick={() => {
                      clearDateFilter();
                      handleFetchData(
                        searchQuery,
                        filterValue,
                        "",
                        "",
                        sort,
                        (currentPage - 1) * limit,
                        limit
                      );
                    }}
                  />
                </div>
              )}
            </>
          )}

          <div
            className="h-10 w-10 flex justify-center items-center bg-gray-900 rounded"
            onClick={() => setSort(!sort)}
          >
            <FontAwesomeIcon
              icon={faArrowUpWideShort}
              className={sort ? "rotate-180" : ""}
            />
          </div>
        </div>

        {showCreateButton && (
          <div className="relative w-full sm:w-auto">
            <button
              onClick={onCreateClick}
              className="bg-[#00D2D9] hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 w-full sm:w-auto"
            >
              {createButtonText}
            </button>
          </div>
        )}
      </div>

      <div>{loading && <SimpleStudyLoading />}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading && items.length > 0 && items.map(renderCard)}
        {!loading && items.length <= 0 && <EmptyList />}
      </div>

      <div className="flex justify-center mt-8">
        <div className="flex space-x-2">
          {!loading &&
            Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  currentPage === index + 1
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                {index + 1}
              </button>
            ))}
        </div>
      </div>
    </>
  );
};

export default GenericListing;