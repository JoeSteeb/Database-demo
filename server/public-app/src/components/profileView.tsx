import { useEffect, useState } from "react";
import type { User } from "../interfaces/databaseInterface";
import { Loading } from "./animations/loading";

type ProfileViewProps = { user: User | null };
export const ProfileView = ({ user }: ProfileViewProps) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/figures/user", { method: "POST" })
      .then((res) => res.text()) // SVG is text, not JSON
      .then((data) => setSvgContent(data))
      .catch((err) => console.error("Failed to fetch SVG:", err));
  }, []);

  if (!user)
    return (
      <div className="flex flex-col items-center">
        <h1>USER NOT FOUND</h1>
      </div>
    );
  else
    return (
      <div className="flex flex-col items-center">
        <h1>{user.user_name} </h1>
        <h3>Created: {user.yelping_since}</h3>
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
