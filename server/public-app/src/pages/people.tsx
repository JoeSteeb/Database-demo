import { SearchPage } from "./searchPage";

export const People = () => {
  return <SearchPage table="users" displayAttributes={["user_name"]} />;
};
