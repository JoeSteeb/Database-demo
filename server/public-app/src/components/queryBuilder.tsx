type QueryBuilderProps = {
  setSearchQuery: (value: string) => void;
  setPageNum: (value: number) => void;
};

export const QueryBuilder = ({
  setSearchQuery,
  setPageNum,
}: QueryBuilderProps) => {
  return (
    <div className="flex justify-center my-5 gap-10">
      <div className="p-1 drop-shadow-sm rounded-md bg-white">
        search
        <input
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPageNum(0);
          }}
        />
      </div>
      <div className="p-1 drop-shadow-sm rounded-md bg-white">
        filter
        <input />
      </div>
    </div>
  );
};
