import { useEffect, useState } from "react";

type User = {
  user_id: string;
};

export const People = () => {
  const [searchResults, setSearchResults] = useState<User[] | null>(null);
  const [error, setError] = useState(null);

  const fetchData = () => {
    fetch("http://localhost:3000/api/getUser")
      .then((res) => {
        if (!res.ok) return Promise.reject("Failed to fetch");
        console.log("Fetched Users");
        return res.json();
      })
      .then(setSearchResults)
      .catch(setError);
  };

  useEffect(fetchData, []);

  return (
    <form className="w-2/3 bg-white my-5 drop-shadow-sm">
      <div className="flex justify-center my-5 gap-10">
        <div className="p-1 drop-shadow-sm rounded-md bg-white">
          search
          <input />
        </div>
        <div className="p-1 drop-shadow-sm rounded-md bg-white">
          filter<input></input>
        </div>
      </div>
      <div>
        {searchResults &&
          searchResults.map((p) => (
            <div key={p.user_id}>User: {p.user_id}</div>
          ))}
      </div>
    </form>
  );
};
