import type { QueryObject, Displayable } from "../interfaces/databaseInterface";
// import { ProfileView } from "./profileView";
import React, { useState } from "react";
import { Loading } from "./animations/loading";

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
  const View = searchResults?.view;
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setSelected(null);
  });

  if (!searchResults) {
    return (
      <div className="flex w-full justify-center items-center max-w-md h-dvh my-1">
        <Loading />
      </div>
    );
  }

  const handleClick = (user: Displayable) => {
    setSelected(
      <div className="absolute inset-20 inset-x-50 z-10 bg-white drop-shadow-sm rounded-lg">
        <button
          className="bg-[#ffe8e8] ml-1 mt-1"
          onClick={() => setSelected(null)}
        >
          EXIT
        </button>
        {View && <View data={user} />}
      </div>
    );
  };
  return (
    <>
      <div className="flex flex-col items-center overflow-y-auto px-4">
        {searchResults.result.map((u) => (
          <button
            onClick={() => handleClick(u)}
            className="w-full max-w-md my-1"
            key={u.id}
          >
            {searchResults.display_attributes?.reduce((acc, attr) => {
              return acc + (u as any)[attr] + " ";
            })}
          </button>
        ))}
      </div>

      <div className="flex flex-row my-5">
        <button
          type="button"
          onClick={() => {
            if (pageNum > 0) setPageNum(pageNum - 1);
          }}
        >
          Previous
        </button>
        {[...Array(5)].map((_, i) => (
          <button
            className={`${
              pageNum === i ? "bg-[#e2e2e2]" : "bg-red"
            } border px-4 py-2 mx-1 rounded`}
            onClick={() => setPageNum(i)}
            key={i}
            type="button"
          >
            {i + 1}
          </button>
        ))}

        <button
          type="button"
          onClick={() => {
            if (pageNum < 4) setPageNum(pageNum + 1);
          }}
        >
          Next
        </button>
      </div>
      {selected}
    </>
  );
};
