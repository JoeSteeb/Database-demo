import { useEffect, useState } from "react";

type User = {
  user_id: string;
};

type QueryObject = {
  count: number;
  result: User[];
};

export const People = () => {
  const [searchResults, setSearchResults] = useState<QueryObject | null>(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const fetchData = () => {
    console.log(`Offset ${pageNum * pageSize} pageSize ${pageSize}`);
    fetch("http://localhost:3000/api/getUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: searchQuery,
        offset: pageNum * pageSize,
        limit: pageSize,
      }),
    })
      .then((res) => {
        if (!res.ok) return Promise.reject("Failed to fetch");
        console.log("Fetched Users");
        return res.json();
      })
      .then(setSearchResults)
      .catch(setError);
  };

  useEffect(fetchData, [searchQuery, pageNum]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-2/3 flex flex-col overflow-hidden drop-shadow-sm items-center bg-white my-5"
    >
      <div className="flex justify-center my-5 gap-10">
        <div className="p-1 drop-shadow-sm rounded-md bg-white">
          search
          <input />
        </div>
        <div className="p-1 drop-shadow-sm rounded-md bg-white">
          filter
          <input />
        </div>
      </div>

      <div className="flex flex-col items-center overflow-y-auto px-4">
        {searchResults &&
          searchResults.result.map((p) => (
            <button className="w-full max-w-md my-1" key={p.user_id}>
              User: {p.user_id}
            </button>
          ))}
      </div>

      <div className="flex flex-row my-5">
        <button type="button">Previous</button>
        {[...Array(5)].map((_, i) => (
          <button
            onClick={() => {
              setPageNum(i);
            }}
            key={i}
            type="button"
          >
            {i + 1}
          </button>
        ))}
        <button type="button">Next</button>
      </div>
      {error}
    </form>
  );
};
