import { SearchPage } from "./searchPage";
import { ProfileView } from "../components/profileView";

export const People = () => {
  return (
    <SearchPage
      table="users"
      id="user_id"
      view={ProfileView}
      displayAttributes={["user_name"]}
    />
  );
};
