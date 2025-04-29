// src/api/fetchData.ts
import type { LikeFilter, QueryObject } from "../interfaces/databaseInterface";

export const fetchData = async (
  pageNum: number,
  pageSize: number,
  likeFilters: LikeFilter[],
  signal: AbortSignal,
  setSearchResults: (res: QueryObject) => void,
  setError: (err: string) => void
) => {
  try {
    console.log(`Offset ${pageNum * pageSize} pageSize ${pageSize}`);
    const res = await fetch("http://localhost:3001/api/getUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        likeFilters: likeFilters,
        offset: pageNum * pageSize,
        limit: pageSize,
      }),
      signal,
    });

    if (!res.ok) throw new Error("Failed to fetch");
    console.log("Fetched Users");
    const data = await res.json();
    setSearchResults(data);
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.log("Fetch aborted");
    } else {
      setError(err.message);
    }
  }
};

export const fetchFilters = async (
  table: string,
  setFilters: (set: string[]) => void
) => {
  try {
    const res = await fetch("http://localhost:3001/api/columnsInTable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableName: table }),
    });

    if (!res.ok) throw new Error("Failed to fetch");
    console.log("Fetched Filters");
    const data = await res.json();
    setFilters(data);
    return data;
  } catch (err: any) {
    console.error(err);
  }
};
