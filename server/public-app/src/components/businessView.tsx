import { useEffect, useState } from "react";
import { StarsIcon } from "./icons/stars";
import { MapView } from "./map";
import type { Business } from "../interfaces/databaseInterface";
// import { Loading } from "./animations/loading";

type BusinessViewProps = { data: Business | null };
export const BusinessView = ({ data }: BusinessViewProps) => {
  useEffect(() => {}, []);

  if (!data)
    return (
      <div className="flex flex-col items-center">
        <h1>BUSINESS NOT FOUND</h1>
        <h3>Type: {typeof data}</h3>
      </div>
    );
  else
    return (
      <div className="flex flex-col items-center">
        <h1>{data.business_name} </h1>
        <h3>
          {data.city}, {data.business_state}
        </h3>
        <StarsIcon rating={data.stars} />
        <MapView coordinates={[data.longitude, data.latitude]} />
      </div>
    );
};
