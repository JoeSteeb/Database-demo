import DropDownMenu from "./dropDown";

type QueryBuilderProps = {
  setSearchQuery: (value: string) => void;
  setPageNum: (value: number) => void;
  setFilterInput: (value: string[]) => void;
  setOrderList: (value: string[]) => void;
  filters?: string[];
  orderList?: string[];
  filterInput?: string[];
};

export const QueryBuilder = ({
  setSearchQuery,
  filters,
  setPageNum,
  orderList,
  setOrderList,
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
              <input className="ml-1 border border-gray-300 rounded px-2 outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          ))}
        />
      )}

      {filters && (
        <DropDownMenu
          title="Order By"
          items={filters.map((item: string) => (
            <div
              className="flex flex-row"
              key={item}
              onClick={() => {
                if (orderList === undefined) {
                  setOrderList([item]);
                } else if (!orderList.includes(item)) {
                  setOrderList([...orderList, item]);
                } else {
                  setOrderList(orderList.filter((e) => e !== item));
                }
              }}
            >
              <div>{item}</div>
              {orderList?.includes(item) ? (
                <div className="flex w-5 ml-1 pl-1 border-blue-300 border-1 rounded-full">
                  {orderList.indexOf(item) + 1}
                </div>
              ) : (
                <div className="flex w-5 ml-1 border-gray-300 border-1 rounded-full"></div>
              )}
            </div>
          ))}
        />
      )}
    </div>
  );
};
