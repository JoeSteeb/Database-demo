import { SearchPage } from "./searchPage";
import { BusinessView } from "../components/businessView";

export const Businesses = () => {
  return (
    <SearchPage
      table="business"
      id="business_id"
      view={BusinessView}
      displayAttributes={["business_name", "city", "business_state"]} // Adjusted to include business_type
    />
  );
};
