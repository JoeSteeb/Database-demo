import DropDownMenu from "./dropDown";

type QueryBuilderProps = {
  setSearchQuery: (value: string) => void;
  setPageNum: (value: number) => void;
  filters?: string[];
};

export const QueryBuilder = ({
  setSearchQuery,
  filters,
  setPageNum,
}: QueryBuilderProps) => {
  console.log("filters: " + filters);
  return (
    <div className="flex justify-center my-5 gap-10">
      <div className="p-1 drop-shadow-sm rounded-md bg-white">
        Search
        <input
          className="ml-1"
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPageNum(0);
          }}
        />
      </div>

      {filters && (
        <DropDownMenu
          title="Filter By"
          items={filters.map((item: string) => (
            <div className="flex flex-row" key={item}>
              <div>{item}</div>
              <input className="ml-1 border border-gray-300 rounded px-2 outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          ))}
        />
      )}

      {filters && (
        <DropDownMenu
          title="Order By"
          items={filters.map((item: string) => (
            <div className="flex flex-row" key={item}>
              <div>{item}</div>
            </div>
          ))}
        />
      )}
    </div>
  );
};
