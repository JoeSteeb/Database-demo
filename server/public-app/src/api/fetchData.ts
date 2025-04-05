// src/api/fetchData.ts
import type { QueryObject } from "../interfaces/databaseInterface";

export const fetchData = async (
  pageNum: number,
  pageSize: number,
  searchQuery: string,
  signal: AbortSignal,
  setSearchResults: (res: QueryObject) => void,
  setError: (err: string) => void
) => {
  try {
    console.log(`Offset ${pageNum * pageSize} pageSize ${pageSize}`);
    const res = await fetch("http://localhost:3000/api/getUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: searchQuery,
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
