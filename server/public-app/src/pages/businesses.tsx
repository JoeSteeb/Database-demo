import { SearchPage } from "./searchPage";
import { ProfileView } from "../components/profileView";

export const Businesses = () => {
  return (
    <SearchPage
      table="business"
      id="business_id"
      view={ProfileView}
      displayAttributes={["business_name", "city", "business_state"]} // Adjusted to include business_type
    />
  );
};
