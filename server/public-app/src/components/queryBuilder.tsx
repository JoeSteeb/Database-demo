import { mock } from "node:test";
import DropDownMenu from "./dropDown";

let mockItems = ["test1", "test2", "test3"];

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
        Search
        <input
          className="ml-1"
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPageNum(0);
          }}
        />
        <DropDownMenu title="test" items={mockItems} />
      </div>
    </div>
  );
};
