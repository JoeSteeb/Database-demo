import { useEffect, useState } from "react";
import { QueryView } from "../components/queryView";
import { QueryBuilder } from "../components/queryBuilder";
import type { QueryObject, LikeFilter } from "../interfaces/databaseInterface";
import { fetchData, fetchFilters } from "../api/fetchData";

type SearchPageProps = {
  table: string;
  displayAttributes: string[];
  view: React.ComponentType<any>;
};

export const SearchPage = ({
  table,
  displayAttributes,
  view,
}: SearchPageProps) => {
  const [searchResults, setSearchResults] = useState<QueryObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [filterInput, setFilterInput] = useState<LikeFilter[]>([]);
  const [orderList, setOrderList] = useState<string[]>([]);
  const [pageNum, setPageNum] = useState(0);
  // const [pageSize, setPageSize] = useState(20);
  // const [pageCount, setPageCount] = useState(0);

  let queryObject = searchResults;

  if (searchResults) {
    queryObject = {
      ...searchResults,
      display_attributes: displayAttributes || [],
      view: view,
    };
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchFilters(table, setFilters);

    fetchData(
      pageNum,
      50,
      filterInput,
      orderList,
      signal,
      setSearchResults,
      setError,
      table
    );

    return () => {
      controller.abort();
    };
  }, [searchQuery, filterInput, orderList, pageNum]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-2/3 flex flex-col overflow-hidden drop-shadow-sm items-center bg-white my-5 rounded-lg"
    >
      <QueryBuilder
        setSearchQuery={setSearchQuery}
        filters={filters}
        orderList={orderList}
        filterInput={filterInput}
        setFilterInput={setFilterInput}
        setOrderList={setOrderList}
        setPageNum={setPageNum}
      />
      <QueryView
        searchResults={searchResults}
        pageNum={pageNum}
        setPageNum={setPageNum}
      />
      {error}
    </form>
  );
};
