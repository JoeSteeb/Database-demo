import type { QueryObject } from "../interfaces/databaseInterface";
import React, { useState } from "react";

type QueryViewProps = {
  searchResults: QueryObject | null;
  pageNum: number;
  setPageNum: (page: number) => void;
};

export const QueryView = ({
  searchResults,
  pageNum,
  setPageNum,
}: QueryViewProps) => {
  const [selected, setSelected] = useState<React.ReactNode | null>(null);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelected(
      <div className="absolute inset-0 z-10 bg-black opacity-50">
        USER VIEW
        <button onClick={() => setSelected(null)}>EXIT</button>
      </div>
    );
  };
  return (
    <>
      <div className="flex flex-col items-center overflow-y-auto px-4">
        {searchResults &&
          searchResults.result.map((p) => (
            <button
              onClick={handleClick}
              className="w-full max-w-md my-1"
              key={p.user_id}
            >
              User: {p.user_name} Created: {p.yelping_since}
            </button>
          ))}
      </div>

      <div className="flex flex-row my-5">
        <button type="button">Previous</button>
        {[...Array(5)].map((_, i) => (
          <button
            className={`${
              pageNum === i ? "bg-[#fdf2f2]" : "bg-red"
            } border px-4 py-2 mx-1 rounded`}
            onClick={() => setPageNum(i)}
            key={i}
            type="button"
          >
            {i + 1}
          </button>
        ))}
        <button type="button">Next</button>
      </div>
      {selected}
    </>
  );
};
