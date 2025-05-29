import { useEffect, useState } from "react";
import type { User } from "../interfaces/databaseInterface";
import { Loading } from "./animations/loading";

type ProfileViewProps = { data: User | null };
export const ProfileView = ({ data }: ProfileViewProps) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/figures/user", { method: "POST" })
      .then((res) => res.text()) // SVG is text, not JSON
      .then((data) => setSvgContent(data))
      .catch((err) => console.error("Failed to fetch SVG:", err));
  }, []);

  if (!data)
    return (
      <div className="flex flex-col items-center">
        <h1>USER NOT FOUND</h1>
        <h3>Type: {typeof data}</h3>
      </div>
    );
  else
    return (
      <div className="flex flex-col items-center">
        <h1>{data.user_name} </h1>
        <h3>Created: {data.yelping_since}</h3>
        {svgContent ? (
          <div dangerouslySetInnerHTML={{ __html: svgContent }} />
        ) : (
          <div className="mt-20">
            <Loading />
          </div>
        )}
      </div>
    );
};
